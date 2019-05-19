const express = require('express');
const passport = require('passport');

const OIDCStrategy = require('passport-openidconnect').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const QQStrategy = require('passport-qq').Strategy;
const LinkedInStrategy = require('@sokratis/passport-linkedin-oauth2').Strategy;
const AlipayStrategy = require('passport-alipay-oauth2').Strategy;

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
  app_id: config.alipayAppId,
  alipay_public_key: config.alipayPublicKey,
  private_key: config.alipayAppPrivateKey,
  callbackURL: 'https://sso.scs.im/auth/alipay/callback',
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
app.use(require('express-session')({
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
  passport.authenticate('Alipay'));

app.get('/auth/alipay/callback',
  passport.authenticate('Alipay', {
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
