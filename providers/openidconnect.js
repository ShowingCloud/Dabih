const OIDCStrategy = require('passport-openidconnect').Strategy;

const config = require('../config/config');


module.exports = (list) => {
  if (list) {
    list.push('openidconnect');
  }

  return new OIDCStrategy({
    clientID: config.oidcClientId,
    clientSecret: config.oidcClientSecret,
    authorizationURL: 'https://auth.scs.im/auth',
    tokenURL: 'https://auth.scs.im/token',
    callbackURL: 'https://sso.scs.im/auth/showingcloud/callback',
  },
  (token, tokenSecret, profile, done) => done(null, profile));
};
