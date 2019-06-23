const OIDCStrategy = require('passport-openidconnect').Strategy;

const config = require('../config/config');


module.exports = new OIDCStrategy({
  issuer: 'https://auth.scs.im',
  clientID: config.oidcClientId,
  clientSecret: config.oidcClientSecret,
  authorizationURL: 'https://auth.scs.im/oidc/auth',
  tokenURL: 'https://auth.scs.im/oidc/token',
  callbackURL: 'https://sso.scs.im/auth/showingcloud/callback',
},
(token, tokenSecret, profile, done) => done(null, profile));
