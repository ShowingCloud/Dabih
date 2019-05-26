const OAuth2Strategy = require('passport-oauth2').Strategy;

const config = require('../config/config');


module.exports = (list) => {
  if (list) {
    list.push('meituan');
  }

  const strategy = new OAuth2Strategy({
    authorizationURL: 'https://openapi.waimai.meituan.com/oauth/authorize',
    tokenURL: 'https://openapi.waimai.meituan.com/oauth/access_token',
    clientID: config.meituanAppId,
    clientSecret: config.meituanAppSecret,
    callbackURL: 'https://sso.scs.im/auth/meituan/callback',
  },
  (accessToken, refreshToken, profile, done) => done(null, profile));

  strategy.authorizationParams = () => {
    return {
      app_id: config.meituanAppId,
    };
  };

  strategy.tokenParams = () => {
    return {
      app_id: config.meituanAppId,
      secret: config.meituanAppSecret,
    };
  };

  return strategy;
};
