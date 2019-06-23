const Express = require('express');
const Passport = require('passport');
const Session = require('express-session');
const RedisStore = require('connect-redis')(Session);
const OidcProvider = require('oidc-provider');

const commonRoutes = require('./routes/common');
const providerRoutes = require('./providers/routes');
const oidcRoutes = require('./providers/oidcRoutes');
const {
  config,
  oidcConfig,
  clients,
  keystore,
} = require('./config');

const RedisAdapter = require('./models/redisAdapter');
require('./models/mongodb');
const IdentityFederation = require('./models/identityFederation');
const providers = require('./providers');


config.providers.forEach(provider => Passport.use(providers[provider.provider]));

Passport.serializeUser((profile, done) => {
  done(null, profile);
});

Passport.deserializeUser((profile, done) => {
  done(null, profile);
});


const app = Express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

['public', `${__dirname}/node_modules/jquery/dist`, `${__dirname}/node_modules/bootstrap/dist`,
  `${__dirname}/node_modules/@fortawesome/fontawesome-free`]
  .forEach(dir => app.use(Express.static(dir)));

app.use(require('helmet')());
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')(config.sessionSecret));
app.use(require('body-parser').urlencoded({ extended: true }));

app.enable('trust proxy');
app.use(Session({
  cookie: {
    secure: true,
  },
  resave: false,
  saveUninitialized: false,
  secret: [config.sessionSecret, ...config.otherSessionSecrets],
  store: new RedisStore({
    url: config.redisStorageURL,
    logErrors: true,
    prefix: config.redisSessionPrefix,
  }),
}));

app.use(Passport.initialize());
app.use(Passport.session());

providerRoutes(app, IdentityFederation);
commonRoutes(app);

const oidcProvider = new OidcProvider(config.issuer, {
  ...oidcConfig,

  async findById(ctx, id, token) {
    const account = await IdentityFederation.findById(id);
    if (account) {
      return {
        accountId: id,
        claims(use, scope, claims, rejected) {
          return Object.assign({}, account, {
            sub: id,
          });
        },
      };
    }

    return null;
  },
});

let server;
(async () => {
  await oidcProvider.initialize({
    adapter: RedisAdapter,
    clients,
    keystore,
  });

  oidcProvider.defaultHttpOptions = { timeout: 15000 };
  oidcProvider.proxy = true;

  oidcRoutes(app, oidcProvider);
  app.use('/oidc', oidcProvider.callback);
  server = app.listen(config.port);
})().catch((err) => {
  if (server && server.listening) server.close();
  console.error(err); // eslint-disable-line no-console
  process.exitCode = 1;
});
