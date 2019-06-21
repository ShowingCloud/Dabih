const ensureLogin = require('connect-ensure-login');

const config = require('../config/config');


module.exports = (app) => {
  app.get('/',
    (req, res) => res.render('home', { user: req.user }));

  app.get('/login',
    (req, res) => res.render('login', { providers: config.providers }));

  app.get('/login/:provider',
    (req, res) => {
      const provider = config.providers.filter(p => p.directory === req.params.provider);

      if (!provider.length) {
        res.render('login', { providers: config.providers });
      } else {
        res.redirect(`/auth/${provider[0].directory}`);
      }
    });

  app.get('/login/required/:required',
    (req, res) => {
      const required = config.providers.filter(p => req.params.required.split(',').includes(p.directory));

      if (!required.length) {
        res.render('login', { providers: config.providers });
      } else if (required.length === 1) {
        res.redirect(`/auth/${required[0].directory}`);
      } else {
        res.render('login', { providers: required });
      }
    });

  app.get('/login/required/:required/allowed/:allowed',
    (req, res) => {
      const required = config.providers.filter(p => req.params.required.split(',').includes(p.directory));
      const allowed = config.providers.filter(p => req.params.allowed.split(',').includes(p.directory));

      if (!required.length) {
        res.render('login', { providers: config.providers });
      } else if (required.length === 1) {
        res.redirect(`/auth/${required[0].directory}`);
      } else {
        res.render('login', { providers: required.concat(allowed) });
      }
    });

  app.get('/profile',
    ensureLogin.ensureLoggedIn(),
    (req, res) => res.render('profile', { user: req.user }));

  app.get('/tos',
    (req, res) => res.render('tos'));

  app.get('/pp',
    (req, res) => res.render('pp'));
};
