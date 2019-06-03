const OAuth2Strategy = require('passport-oauth2').Strategy;

const config = require('../config/config');


module.exports = (list) => {
  if (list) {
    list.push('alipay');
  }

  const strategy = new OAuth2Strategy({
    authorizationURL: 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm',
    tokenURL: 'https://openapi.alipay.com/gateway.do',
    clientID: config.alipayAppId,
    alipayPublicKey: config.alipayPublicKey,
    privateKey: config.alipayAppPrivateKey,
    callbackURL: 'https://sso.scs.im/auth/alipay/callback',
    scope: 'auth_user,auth_base,auth_ecard',
  },
  (accessToken, refreshToken, profile, done) => done(null, profile));

  strategy.name = 'alipay';
  strategy.authorizationParams = () => ({ app_id: config.alipayAppId });
  strategy.tokenParams = () => ({});

  strategy.authenticate = function (req, options) {
    Object.getOwnPropertyDescriptors(OAuth2Strategy.prototype).forEach((key) => {
      Object.defineProperty(this, key, key.value);
    });
    return this.authenticate(req, options);
  };

  strategy._oauth2.getOAuthAccessToken = (code, oldParams, done) => {
    const params = oldParams;
  };

  return strategy;
};
