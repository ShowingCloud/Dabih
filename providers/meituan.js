const OAuth2Strategy = require('passport-oauth2').Strategy;

const config = require('../config/config');


module.exports = (list) => {
  if (list) {
    list.push('meituan');
  }

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
    console.log(accessToken);
    strategy._oauth2.get(`https://openapi.waimai.meituan.com/oauth/userinfo?app_id=${config.meituanAppId}&secret=${config.meituanAppSecret}`,
      accessToken, (err, body) => {
        try {
          const json = JSON.parse(body);

          const profile = { provider: 'meituan' };
          profile.id = json.openid;
          profile.nickname = json.nicknamee;
          profile.avatar = json.avatar;
          profile.phone = json.desensitization_phone;
          profile._raw = body;
          profile._json = json;

          done(null, profile);
        } catch (error) {
          done(error);
        }
      });
  };

  return strategy;
};
