const Express = require('express');
const Passport = require('passport');
const Helmet = require('helmet');
const Session = require('express-session');
const RedisStore = require('connect-redis')(Session);

const routes = require('./providers/routes');
const config = require('./config/config');
require('./models/mongodb');
const IdentityFederation = require('./models/identityFederation');


const providerList = [];
Passport.use(require('./providers/openidconnect')(providerList));
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

Passport.serializeUser((profile, done) => {
  done(null, profile);
});

Passport.deserializeUser((profile, done) => {
  done(null, profile);
});


const app = Express();
app.use(Helmet());

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

app.set('trust proxy', 1);
app.use(Session({
  cookie: {
    secure: true,
  },
  resave: false,
  saveUninitialized: false,
  secret: [config.sessionSecret, ...config.otherSessionSecrets],
  store: new RedisStore({
    url: config.sessionStorageURL,
    logErrors: true,
    prefix: 'Dabih-Session:',
  }),
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

const identityFederation = IdentityFederation(providerList);
providerList.forEach((provider) => {
  if (provider === 'openidconnect') {
    routes(app, provider, identityFederation, 'showingcloud');
  } else {
    routes(app, provider, identityFederation);
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
