const FacebookStrategy = require('passport-facebook').Strategy;

const config = require('../config/config');


module.exports = (list) => {
  if (list) {
    list.push('facebook');
  }

  return new FacebookStrategy({
    clientID: config.facebookAppId,
    clientSecret: config.facebookAppSecret,
    callbackURL: 'https://sso.scs.im/auth/facebook/callback',
  },
  (accessToken, refreshToken, profile, done) => done(null, profile));
};
