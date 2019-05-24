const LinkedInStrategy = require('@sokratis/passport-linkedin-oauth2').Strategy;

const config = require('../config/config');


module.exports = (list) => {
  if (list) {
    list.push('linkedin');
  }

  return new LinkedInStrategy({
    clientID: config.linkedInClientId,
    clientSecret: config.linkedInClientSecret,
    callbackURL: 'https://sso.scs.im/auth/linkedin/callback',
  },
  (accessToken, refreshToken, profile, done) => done(null, profile));
};
