const OIDCStrategy = require('passport-openidconnect').Strategy;

module.exports = (list) => {
  if (list) {
    list.push('openidconnect');
  }

  return new OIDCStrategy({
    clientID: 'sso',
    clientSecret: 'sso_secret',
    authorizationURL: 'https://auth.scs.im/auth',
    tokenURL: 'https://auth.scs.im/token',
    callbackURL: 'https://sso.scs.im/callback',
  },
  (token, tokenSecret, profile, cb) => cb(null, profile));
};
