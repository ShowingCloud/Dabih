const Express = require('express');
const Passport = require('passport');
const Session = require('express-session');
const RedisStore = require('connect-redis')(Session);

const routes = require('./providers/routes');
const config = require('./config/config');
require('./models/mongodb');
const IdentityFederation = require('./models/identityFederation');


const providerList = [];
Passport.use(require('./providers/oidc')(providerList));
Passport.use(require('./providers/facebook')(providerList));
Passport.use(require('./providers/twitter')(providerList));
Passport.use(require('./providers/google')(providerList));
Passport.use(require('./providers/github')(providerList));
Passport.use(require('./providers/qq')(providerList));
Passport.use(require('./providers/linkedin')(providerList));
Passport.use(require('./providers/alipay')(providerList));
Passport.use(require('./providers/meituan')(providerList));
Passport.use(require('./providers/weibo')(providerList));
Passport.use(require('./providers/teambition')(providerList));
Passport.use(require('./providers/dingtalk')(providerList));

global.IdentityFederation = IdentityFederation(providerList);

Passport.serializeUser((profile, done) => {
  done(null, profile);
});

Passport.deserializeUser((profile, done) => {
  done(null, profile);
});


const app = Express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

app.use(Express.static('public'));
app.use(Express.static(`${__dirname}/node_modules/jquery/dist`));
app.use(Express.static(`${__dirname}/node_modules/bootstrap/dist`));
app.use(Express.static(`${__dirname}/node_modules/@fortawesome/fontawesome-free`));

app.use(require('helmet')());
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')(config.sessionSecret));
app.use(require('body-parser').urlencoded({ extended: true }));

app.use(Session({
  store: new RedisStore({
    url: config.sessionStorageURL,
    logErrors: true,
    prefix: 'Dabih-Session:',
  }),
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true,
}));

app.use(Passport.initialize());
app.use(Passport.session());


app.get('/',
  (req, res) => {
    res.render('home', { user: req.user });
  });

app.get('/login',
  (req, res) => {
    res.render('login');
  });

providerList.forEach((provider) => {
  if (provider === 'oidc') {
    routes(app, provider, 'showingcloud');
  } else {
    routes(app, provider);
  }
});

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
