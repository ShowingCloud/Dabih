const TwitterStrategy = require('passport-twitter').Strategy;

const config = require('../config/config');


module.exports = new TwitterStrategy({
  consumerKey: config.twitterConsumerKey,
  consumerSecret: config.twitterConsumerSecret,
  callbackURL: 'https://sso.scs.im/auth/twitter/callback',
},
(token, tokenSecret, profile, done) => done(null, profile));
