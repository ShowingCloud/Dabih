const passport = require('passport');

module.exports = (app, provider, path) => {
  const dir = path || provider;

  app.get(`/auth/${dir}`,
    passport.authenticate(provider));

  app.get(`/auth/${dir}/callback`,
    passport.authenticate(provider, {
      successRedirect: '/',
      failureRedirect: '/login',
    }));
};
