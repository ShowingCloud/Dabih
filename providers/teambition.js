const OAuth2Strategy = require('passport-oauth2').Strategy;

const config = require('../config/config');


module.exports = (list) => {
  if (list) {
    list.push('teambition');
  }

  return new OAuth2Strategy({
    authorizationURL: 'https://account.teambition.com/oauth2/authorize',
    tokenURL: 'https://account.teambition.com/oauth2/access_token',
    clientID: config.teambitionClientId,
    clientSecret: config.teambitionClientSecret,
    callbackURL: 'https://sso.scs.im/auth/teambition/callback',
  },
  (accessToken, refreshToken, profile, done) => done(null, profile));
};
