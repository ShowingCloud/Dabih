const QQStrategy = require('passport-qq').Strategy;

const config = require('../config/config');


module.exports = (list) => {
  if (list) {
    list.push('qq');
  }

  return new QQStrategy({
    clientID: config.qqAppId,
    clientSecret: config.qqAppKey,
    callbackURL: 'https://sso.scs.im/auth/qq/callback',
  },
  (accessToken, refreshToken, profile, done) => done(null, profile));
};
