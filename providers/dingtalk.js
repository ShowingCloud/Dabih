const OAuth2Strategy = require('passport-oauth2').Strategy;
const crypto = require('crypto');
const querystring = require('querystring');

const config = require('../config/config');


module.exports = (list) => {
  if (list) {
    list.push('dingtalk');
  }

  const strategy = new OAuth2Strategy({
    authorizationURL: 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize',
    qrAuthorizationURL: 'https://oapi.dingtalk.com/connect/qrconnect',
    tokenURL: 'https://oapi.dingtalk.com/sns/gettoken', // It doesn't work anyway
    clientID: config.dingTalkAppId,
    clientSecret: config.dingTalkAppSecret,
    callbackURL: 'https://sso.scs.im/auth/dingtalk/callback',
    scope: 'snsapi_login',
  },
  (accessToken, refreshToken, profile, done) => done(null, profile));

  strategy.authorizationParams = () => ({ appid: config.dingTalkAppId });
  strategy.tokenParams = () => ({ accessKey: config.dingTalkAppId });

  strategy._oauth2.getOAuthAccessToken = (code, params, done) => (done(null, code, null, params));

  strategy.userProfile = (accessToken, done) => {
    const params = {
      accessKey: config.dingTalkAppId,
    };

    const timestamp = String(Date.now());
    params.timestamp = timestamp;
    params.signature = crypto.createHmac('sha256', config.dingTalkAppSecret).update(timestamp).digest('base64');

    strategy._oauth2._request('POST', `https://oapi.dingtalk.com/sns/getuserinfo_bycode?${querystring.stringify(params)}`,
      {}, JSON.stringify({ tmp_auth_code: accessToken }), accessToken, (err, body) => {
        if (err) {
          done(err);
        }

        try {
          const json = JSON.parse(body);

          if (json.errcode) {
            done(json.errmsg);
          }

          const profile = { provider: 'dingtalk' };
          profile.id = json.user_info.openid;
          profile.nickname = json.user_info.nick;
          profile.unionid = json.user_info.unionid;
          profile._raw = body;
          profile._json = json.user_info;

          done(null, profile);
        } catch (error) {
          done(error);
        }
      });
  };

  return strategy;
};
