const OAuth2Strategy = require('passport-oauth2').Strategy;

const config = require('../config/config');


module.exports = (list) => {
  if (list) {
    list.push('dingtalk');
  }

  return new OAuth2Strategy({
    authorizationURL: 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize',
    tokenURL: 'https://oapi.dingtalk.com/connect/oauth2/sns_token',
    clientID: config.dingTalkAppId,
    clientSecret: config.dingTalkAppSecret,
    callbackURL: 'https://sso.scs.im/auth/teambition/callback',
    scope: 'snsapi_login',
  },
  (accessToken, refreshToken, profile, done) => done(null, profile));
};
