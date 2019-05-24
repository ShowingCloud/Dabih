const GitHubStrategy = require('passport-github').Strategy;

const config = require('../config/config');


module.exports = (list) => {
  if (list) {
    list.push('github');
  }

  return new GitHubStrategy({
    clientID: config.gitHubClientId,
    clientSecret: config.gitHubClientSecret,
    callbackURL: 'https://sso.scs.im/auth/github/callback',
  },
  (accessToken, refreshToken, profile, done) => done(null, profile));
};
