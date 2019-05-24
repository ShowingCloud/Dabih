const OAuth2Strategy = require('passport-oauth2').Strategy;

const config = require('../config/config');


module.exports = (list) => {
  if (list) {
    list.push('weibo');
  }

  return new OAuth2Strategy({
    authorizationURL: 'https://api.weibo.com/oauth2/authorize',
    tokenURL: 'https://api.weibo.com/oauth2/access_token',
    clientID: config.weiboAppId,
    clientSecret: config.weiboAppSecret,
    callbackURL: 'https://sso.scs.im/auth/weibo/callback',
  },
  (accessToken, refreshToken, profile, done) => done(null, profile));
};
