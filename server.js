const express = require('express');
const passport = require('passport');
const session = require('express-session');
const redis = require('connect-redis')(session);

const OIDCStrategy = require('passport-openidconnect').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const QQStrategy = require('passport-qq').Strategy;
const LinkedInStrategy = require('@sokratis/passport-linkedin-oauth2').Strategy;
const AlipayStrategy = require('passport-alipay-oauth2').Strategy;
const OAuth2Strategy = require('passport-oauth2').Strategy;

const config = require('./config/config');


passport.use(new OIDCStrategy({
  clientID: 'sso',
  clientSecret: 'sso_secret',
  authorizationURL: 'https://oidc.scs.im/auth',
  tokenURL: 'https://oidc.scs.im/token',
  callbackURL: 'https://sso.scs.im/callback',
},
(token, tokenSecret, profile, cb) => cb(null, profile)));

passport.use(new FacebookStrategy({
  clientID: config.facebookAppId,
  clientSecret: config.facebookAppSecret,
  callbackURL: 'https://sso.scs.im/auth/facebook/callback',
},
(accessToken, refreshToken, profile, done) => done(null, profile)));

passport.use(new TwitterStrategy({
  consumerKey: config.twitterConsumerKey,
  consumerSecret: config.twitterConsumerSecret,
  callbackURL: 'https://sso.scs.im/auth/twitter/callback',
},
(token, tokenSecret, profile, done) => done(null, profile)));

passport.use(new GoogleStrategy({
  clientID: config.googleClientId,
  clientSecret: config.googleClientSecret,
  callbackURL: 'https://sso.scs.im/auth/google/callback',
  scope: ['openid', 'email', 'profile'],
},
(accessToken, refreshToken, profile, done) => done(null, profile)));

passport.use(new GitHubStrategy({
  clientID: config.gitHubClientId,
  clientSecret: config.gitHubClientSecret,
  callbackURL: 'https://sso.scs.im/auth/github/callback',
},
(accessToken, refreshToken, profile, done) => done(null, profile)));

passport.use(new QQStrategy({
  clientID: config.qqAppId,
  clientSecret: config.qqAppKey,
  callbackURL: 'https://sso.scs.im/auth/qq/callback',
},
(accessToken, refreshToken, profile, done) => done(null, profile)));

passport.use(new LinkedInStrategy({
  clientID: config.linkedInClientId,
  clientSecret: config.linkedInClientSecret,
  callbackURL: 'https://sso.scs.im/auth/linkedin/callback',
},
(accessToken, refreshToken, profile, done) => done(null, profile)));

passport.use(new AlipayStrategy({
  appId: config.alipayAppId,
  alipayPublicKey: config.alipayPublicKey,
  privateKey: config.alipayAppPrivateKey,
  callbackURL: 'https://sso.scs.im/auth/alipay/callback',
},
(accessToken, refreshToken, profile, done) => done(null, profile)));

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://openapi.waimai.meituan.com/oauth/authorize',
  tokenURL: 'https://openapi.waimai.meituan.com/oauth/access_token',
  clientID: config.meituanAppId,
  clientSecret: config.meituanAppSecret,
  callbackURL: 'https://sso.scs.im/auth/meituan/callback',
},
(accessToken, refreshToken, profile, done) => done(null, profile)));

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://api.weibo.com/oauth2/authorize',
  tokenURL: 'https://api.weibo.com/oauth2/access_token',
  clientID: config.weiboAppId,
  clientSecret: config.weiboAppSecret,
  callbackURL: 'https://sso.scs.im/auth/weibo/callback',
},
(accessToken, refreshToken, profile, done) => done(null, profile)));

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://account.teambition.com/oauth2/authorize',
  tokenURL: 'https://account.teambition.com/oauth2/access_token',
  clientID: config.teambitionClientId,
  clientSecret: config.teambitionClientSecret,
  callbackURL: 'https://sso.scs.im/auth/teambition/callback',
},
(accessToken, refreshToken, profile, done) => done(null, profile)));

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize',
  tokenURL: 'https://oapi.dingtalk.com/connect/oauth2/sns_token',
  clientID: config.dingTalkAppId,
  clientSecret: config.dingTalkAppSecret,
  callbackURL: 'https://sso.scs.im/auth/teambition/callback',
  scope: 'snsapi_login',
},
(accessToken, refreshToken, profile, done) => done(null, profile)));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});


const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(session({
  store: new redis({ url: config.sessionStorageURL }),
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true,
}));

app.use(express.static('public'));
app.use(express.static(`${__dirname}/node_modules/jquery/dist`));
app.use(express.static(`${__dirname}/node_modules/bootstrap/dist`));
app.use(express.static(`${__dirname}/node_modules/@fortawesome/fontawesome-free`));

app.use(passport.initialize());
app.use(passport.session());


app.get('/',
  (req, res) => {
    res.render('home', { user: req.user });
  });

app.get('/login',
  (req, res) => {
    res.render('login');
  });

app.get('/auth/idp',
  passport.authenticate('openidconnect'));

app.get('/auth/idp/callback',
  passport.authenticate('openidconnect', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

app.get('/auth/google',
  passport.authenticate('google'));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

app.get('/auth/qq',
  passport.authenticate('qq'));

app.get('/auth/qq/callback',
  passport.authenticate('qq', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

app.get('/auth/linkedin',
  passport.authenticate('linkedin'));

app.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

app.get('/auth/alipay',
  passport.authenticate('alipay'));

app.get('/auth/alipay/callback',
  passport.authenticate('alipay', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

app.get('/auth/meituan',
  passport.authenticate('oauth2'));

app.get('/auth/meituan/callback',
  passport.authenticate('oauth2', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

app.get('/auth/weibo',
  passport.authenticate('oauth2'));

app.get('/auth/weibo/callback',
  passport.authenticate('oauth2', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

app.get('/auth/teambition',
  passport.authenticate('oauth2'));

app.get('/auth/teambition/callback',
  passport.authenticate('oauth2', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

app.get('/auth/dingtalk',
  passport.authenticate('oauth2'));

app.get('/auth/dingtalk/callback',
  passport.authenticate('oauth2', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    res.render('profile', { user: req.user });
  });

app.get('/tos',
  (req, res) => {
    res.render('tos');
  });

app.get('/pp',
  (req, res) => {
    res.render('pp');
  });

app.listen(config.port);
