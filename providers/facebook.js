const FacebookStrategy = require('passport-facebook').Strategy;

const config = require('../config/config');


module.exports = new FacebookStrategy({
  clientID: config.facebookAppId,
  clientSecret: config.facebookAppSecret,
  callbackURL: 'https://sso.scs.im/auth/facebook/callback',
},
(accessToken, refreshToken, profile, done) => done(null, profile));
