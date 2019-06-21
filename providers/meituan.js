const OAuth2Strategy = require('passport-oauth2').Strategy;

const config = require('../config/config');


const strategy = new OAuth2Strategy({
  authorizationURL: 'https://openapi.waimai.meituan.com/oauth/authorize',
  tokenURL: 'https://openapi.waimai.meituan.com/oauth/access_token',
  clientID: config.meituanAppId,
  clientSecret: config.meituanAppSecret,
  callbackURL: 'https://sso.scs.im/auth/meituan/callback',
},
(accessToken, refreshToken, profile, done) => done(null, profile));

strategy.name = 'meituan';
strategy.authorizationParams = () => ({ app_id: config.meituanAppId });
strategy.tokenParams = () => ({
  app_id: config.meituanAppId,
  secret: config.meituanAppSecret,
});

strategy.userProfile = (accessToken, done) => {
  strategy._oauth2._request('POST', // eslint-disable-line no-underscore-dangle
    `https://openapi.waimai.meituan.com/oauth/userinfo?app_id=${config.meituanAppId}&secret=${config.meituanAppSecret}&access_token=${accessToken}`,
    null, null, null, (err, body) => {
      if (err) done(err);
      else {
        try {
          const json = JSON.parse(body);

          const profile = { provider: 'meituan' };
          profile.id = json.openid;
          profile.nickname = json.nickname;
          profile.avatar = json.avatar;
          profile.phone = json.desensitization_phone;
          profile._raw = body; // eslint-disable-line no-underscore-dangle
          profile._json = json; // eslint-disable-line no-underscore-dangle

          done(null, profile);
        } catch (error) {
          done(error);
        }
      }
    });
};

module.exports = strategy;
