const OAuth2Strategy = require('passport-oauth2').Strategy;
const moment = require('moment');
const querystring = require('querystring');

const Sign = require('./common');
const config = require('../config/config');


module.exports = (list) => {
  if (list) {
    list.push('alipay');
  }

  const sign = new Sign('alipay', config.alipayAppPrivateKey, config.alipayPublicKey);

  const strategy = new OAuth2Strategy({
    authorizationURL: 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm',
    tokenURL: 'https://openapi.alipay.com/gateway.do?charset=utf-8',
    clientID: config.alipayAppId,
    callbackURL: 'https://sso.scs.im/auth/alipay/callback',
    scope: 'auth_user,auth_base,auth_ecard',
  },
  (accessToken, refreshToken, profile, done) => done(null, profile));

  strategy.name = 'alipay';
  strategy.authorizationParams = () => ({ app_id: config.alipayAppId });
  strategy.tokenParams = () => ({
    app_id: config.alipayAppId,
    method: 'alipay.system.oauth.token',
    format: 'JSON',
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    version: '1.0',
  });

  strategy.authenticate = function authenticate(req, options) {
    Object.defineProperties(this, Object.getOwnPropertyDescriptors(OAuth2Strategy.prototype));
    this.authorizationParams = strategy.authorizationParams;
    this.tokenParams = strategy.tokenParams;
    this.userProfile = strategy.userProfile;

    if (req.query) {
      req.query.code = req.query.auth_code || null;
      req.query.error = req.query.error_scope || null;
    }

    return this.authenticate(req, options);
  };

  strategy._oauth2.getOAuthAccessToken = function getOAuthAccessToken(code, oldParams, done) {
    const params = oldParams || {};
    params.code = code;
    params.sign = sign.generateSign(params);

    this._request('POST', this._getAccessTokenUrl(), {
      'Content-Type': 'application/x-www-form-urlencoded',
    }, querystring.stringify(params), null, (error, data) => {
      if (error) done(error);
      else {
        let results;
        try {
          results = JSON.parse(data);

          if (!sign.verifySign(results.alipay_system_oauth_token_response
            || results.error_response, results.sign)) {
            throw new Error('alipay.system.oauth.token results signature invalid.');
          }
        } catch (e) {
          done(e);
        }

        if (results.error_response) done(results.error_response);
        else results = results.alipay_system_oauth_token_response;

        const accessToken = results.access_token;
        const refreshToken = results.refresh_token;
        delete results.refresh_token;

        done(null, accessToken, refreshToken, results);
      }
    });
  };

  strategy.userProfile = (accessToken, done) => {
    const params = {
      app_id: config.alipayAppId,
      method: 'alipay.user.info.share',
      format: 'JSON',
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      version: '1.0',
      grant_type: 'authorization_code',
      auth_token: accessToken,
    };
    params.sign = sign.generateSign(params);

    strategy._oauth2._request('POST', strategy._oauth2._getAccessTokenUrl(), {
      'Content-Type': 'application/x-www-form-urlencoded',
    }, querystring.stringify(params), null, (error, data) => {
      if (error) done(error);
      else {
        let results;
        try {
          results = JSON.parse(data);

          if (!sign.verifySign(results.alipay_user_info_share_response
            || results.error_response, results.sign)) {
            throw new Error('alipay.user.info.share results signature invalid.');
          }
        } catch (e) {
          done(e);
        }

        if (results.error_response) done(results.error_response);
        else results = results.alipay_user_info_share_response;

        const profile = { provider: 'alipay' };
        profile.id = results.user_id;
        profile.nickname = results.nick_name;
        profile.avatar = results.avatar;
        profile._raw = data;
        profile._json = results;

        done(null, profile);
      }
    });
  };

  return strategy;
};
