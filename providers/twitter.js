const TwitterStrategy = require('passport-twitter').Strategy;

const config = require('../config/config');


module.exports = (list) => {
  if (list) {
    list.push('twitter');
  }

  return new TwitterStrategy({
    consumerKey: config.twitterConsumerKey,
    consumerSecret: config.twitterConsumerSecret,
    callbackURL: 'https://sso.scs.im/auth/twitter/callback',
  },
  (token, tokenSecret, profile, done) => done(null, profile));
};
