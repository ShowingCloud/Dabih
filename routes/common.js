const ensureLogin = require('connect-ensure-login');

const config = require('../config/config');


module.exports = (app) => {
  app.get('/',
    (req, res) => {
      res.render('home', { user: req.user });
    });

  app.get('/login',
    (req, res) => {
      res.render('login', { providers: config.providers });
    });

  app.get('/profile',
    ensureLogin.ensureLoggedIn(),
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
};
