const AlipayStrategy = require('passport-alipay-oauth2').Strategy;

const config = require('../config/config');


module.exports = (list) => {
  if (list) {
    list.push('alipay');
  }

  return new AlipayStrategy({
    appId: config.alipayAppId,
    alipayPublicKey: config.alipayPublicKey,
    privateKey: config.alipayAppPrivateKey,
    callbackURL: 'https://sso.scs.im/auth/alipay/callback',
  },
  (accessToken, refreshToken, profile, done) => done(null, profile));
};
