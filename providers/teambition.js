const OAuth2Strategy = require('passport-oauth2').Strategy;

const config = require('../config/config');


const strategy = new OAuth2Strategy({
  authorizationURL: 'https://account.teambition.com/oauth2/authorize',
  tokenURL: 'https://account.teambition.com/oauth2/access_token',
  clientID: config.teambitionClientId,
  clientSecret: config.teambitionClientSecret,
  callbackURL: 'https://sso.scs.im/auth/teambition/callback',
},
(accessToken, refreshToken, profile, done) => done(null, profile));

strategy.name = 'teambition';

strategy.userProfile = (accessToken, done) => {
  strategy._oauth2.get('https://api.teambition.com/users/me', accessToken, (err, body) => { // eslint-disable-line no-underscore-dangle
    if (err) {
      return done(err);
    }

    try {
      const json = JSON.parse(body);

      const profile = { provider: 'teambition' };
      profile.id = json._id; // eslint-disable-line no-underscore-dangle
      profile.displayName = json.name;
      profile.username = json.name || json.email;
      profile.email = json.email;
      profile._raw = body; // eslint-disable-line no-underscore-dangle
      profile._json = json; // eslint-disable-line no-underscore-dangle

      return done(null, profile);
    } catch (error) {
      return done(error);
    }
  });
};

module.exports = strategy;
