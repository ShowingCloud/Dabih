const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const config = require('../config/config');


module.exports = (list) => {
  if (list) {
    list.push('google');
  }

  return new GoogleStrategy({
    clientID: config.googleClientId,
    clientSecret: config.googleClientSecret,
    callbackURL: 'https://sso.scs.im/auth/google/callback',
    scope: ['openid', 'email', 'profile'],
  },
  (accessToken, refreshToken, profile, done) => done(null, profile));
};
