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

  strategy.userProfile = (accessToken, done) => (done(null, strategy.profile));

  strategy._oauth2.getOAuthAccessToken = (code, params, done) => {
    const param = params;
    const timestamp = String(Date.now());
    param.timestamp = timestamp;
    param.signature = crypto.createHmac('sha256', config.dingTalkAppSecret).update(timestamp).digest('base64');

    strategy._oauth2._request('POST', `https://oapi.dingtalk.com/sns/getuserinfo_bycode?${querystring.stringify(param)}`,
      {}, JSON.stringify({ tmp_auth_code: code }), code, (err, body) => {
        if (err) {
          done(err, code, null, param);
        }

        try {
          const json = JSON.parse(body);

          if (json.errcode) {
            done(json.errmsg, code, null, param);
          }

          strategy.profile = { provider: 'dingtalk' };
          strategy.profile.id = json.user_info.openid;
          strategy.profile.nickname = json.user_info.nick;
          strategy.profile.unionid = json.user_info.unionid;
          strategy.profile._raw = body;
          strategy.profile._json = json.user_info;

          done(null, code, null, param);
        } catch (error) {
          done(error, code, null, param);
        }
      });
  };

  return strategy;
};
