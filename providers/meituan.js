const OAuth2Strategy = require('passport-oauth2').Strategy;

const RefreshToken = require('./refreshToken')('meituan');
const config = require('../config/config');


const strategy = new OAuth2Strategy({
  authorizationURL: 'https://openapi.waimai.meituan.com/oauth/authorize',
  tokenURL: 'https://openapi.waimai.meituan.com/oauth/access_token',
  clientID: config.meituanAppId,
  clientSecret: config.meituanAppSecret,
  callbackURL: 'https://sso.scs.im/auth/meituan/callback',
},
async (accessToken, refreshToken, params, profile, done) => {
  if (!accessToken || !profile.id) {
    done(profile);
    return false;
  }

  const { RefreshTokenClient, RefreshTokenConfig } = await RefreshToken;

  await RefreshTokenClient
    .multi()
    .hmset(profile.id, {
      id: profile.id,
      accessToken,
      refreshToken,
    })
    .expire(profile.id, 2 * (params.expires_in || RefreshTokenConfig.expiry))
    .exec();

  const prof = Object.assign({}, profile, {
    _accessToken: accessToken, // eslint-disable-line no-underscore-dangle
  });

  done(null, prof);
  return true;
});

strategy.name = 'meituan';
strategy._oauth2._userInfoURL = 'https://openapi.waimai.meituan.com/oauth/userinfo'; // eslint-disable-line no-underscore-dangle
strategy._oauth2._refreshTokenURL = 'https://openapi.waimai.meituan.com/oauth/refresh_token'; // eslint-disable-line no-underscore-dangle
strategy.authorizationParams = () => ({ app_id: config.meituanAppId });
strategy.tokenParams = () => ({
  app_id: config.meituanAppId,
  secret: config.meituanAppSecret,
});

strategy.userProfile = (accessToken, done) => {
  strategy._oauth2._request('POST', // eslint-disable-line no-underscore-dangle
    // eslint-disable-next-line no-underscore-dangle
    `${strategy._oauth2._userInfoURL}?app_id=${config.meituanAppId}&secret=${config.meituanAppSecret}&access_token=${accessToken}`,
    null, null, null, (err, body) => {
      if (err) done(err);
      else {
        try {
          const json = JSON.parse(body);

          if (json.error_code) {
            done(body);
            return false;
          }

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
      return null;
    });
};

strategy.refreshToken = async (id) => {
  const { RefreshTokenClient, RefreshTokenConfig, ReloadConfig } = await RefreshToken;
  const { refreshToken, accessToken } = await RefreshTokenClient.hgetall(id);
  if (!refreshToken || !accessToken) {
    return false;
  }

  const ttl = await RefreshTokenClient.ttl(id);
  const stage = ttl * 3 / RefreshTokenClient.expiry;
  if (stage > 5 || (stage <= 4 && stage > 3) || (stage <= 2 && stage > 1)) {
    return false;
  }

  let ret = false;
  const callback = async (err, body) => {
    if (err) {
      console.log('Refresh Token Error: ', err); // eslint-disable-line no-console
      return false;
    }

    let json;
    try {
      json = JSON.parse(body);

      if (json.error_code || !json.access_token) {
        console.log('Refresh Token Error:', json); // eslint-disable-line no-console
        return false;
      }

      if (accessToken !== json.access_token) {
        await RefreshTokenClient
          .multi()
          .hset(id, 'accessToken', json.access_token)
          .expire(id, 2 * (json.expires_in || RefreshTokenConfig.expiry))
          .exec();
        ret = json.access_token;
      } else {
        await RefreshTokenClient.expire(id,
          2 * (json.expires_in || RefreshTokenConfig.expiry));
        ret = true;
      }
    } catch (error) {
      console.log('Refresh Token Error: ', error); // eslint-disable-line no-console
      return false;
    }

    try {
      if (json.expires_in && RefreshTokenConfig.expiry !== json.expires_in) {
        await RefreshTokenClient.hset('config', 'expiry', json.expires_in);
        await ReloadConfig();
      }
    } catch (error) {
      console.log('Refresh Token Update Expiry Error: ', error); // eslint-disable-line no-console
    }

    return ret;
  };

  for (let i = 0; !ret && i < 3; i += 1) {
    strategy._oauth2.get( // eslint-disable-line no-underscore-dangle
      // eslint-disable-next-line no-underscore-dangle
      `${strategy._oauth2._refreshTokenURL}?app_id=${config.meituanAppId}&secret=${config.meituanAppSecret}&refresh_token=${refreshToken}&&grant_type=refresh_token`,
      null, callback,
    );
  }

  if (!ret) {
    try {
      if (ttl * 3 < RefreshTokenConfig.expiry) {
        await RefreshTokenClient.del(id);
      } else {
        await RefreshTokenClient.expire(id, ttl - RefreshTokenConfig.expiry / 3);
      }
    } catch (error) {
      console.log('Refresh Token Update Expiry Error: ', error); // eslint-disable-line no-console
    }
  }

  if (ret === true) {
    ret = false; // Don't update IdentityFederation
  }
  return ret;
};

module.exports = strategy;
