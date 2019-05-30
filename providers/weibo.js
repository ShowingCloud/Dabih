const WeiboStrategy = require('passport-weibo').Strategy;

const config = require('../config/config');


module.exports = (list) => {
  if (list) {
    list.push('weibo');
  }

  return new WeiboStrategy({
    clientID: config.weiboAppId,
    clientSecret: config.weiboAppSecret,
    callbackURL: 'https://sso.scs.im/auth/weibo/callback',
  },
  (accessToken, refreshToken, profile, done) => done(null, profile));
};
