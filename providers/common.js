const crypto = require('crypto');
const fs = require('fs');

module.exports = class sign {
  constructor(provider, privateKey, publicKey) {
    if (provider === 'alipay') {
      this.privateKey = fs.readFileSync(privateKey);
      this.publicKey = fs.readFileSync(publicKey);
    } else {
      this.privateKey = privateKey;
      this.publicKey = publicKey || null;
    }
  }

  generateSign(params) {
    const str = Object.keys(params || {})
      .filter(k => params[k])
      .filter(k => k !== 'sign')
      .sort()
      .reduce((r, k) => `${r}${k}=${params[k]}&`, '')
      .slice(0, -1);

    return crypto.createSign('RSA-SHA256')
      .update(str)
      .sign(this.privateKey, 'base64');
  }

  verifySign(params, signature) {
    const str = JSON.stringify(Object.keys(params || {})
      .filter(k => params[k])
      .filter(k => k !== 'sign')
      .reduce((r, k) => Object.assign(r, { [k]: params[k] }), {}));

    return crypto.createVerify('RSA-SHA256')
      .update(str)
      .verify(this.publicKey, signature, 'base64')
      || crypto.createVerify('RSA-SHA256') /* as recommended in Alipay documentation */
        .update(str.replace(/\//g, '\\/'))
        .verify(this.publicKey, signature, 'base64');
  }
};
