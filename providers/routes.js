const passport = require('passport');

module.exports = (app, provider, path) => {
  const dir = path || provider;

  app.get(`/auth/${dir}`,
    passport.authenticate(provider));

  app.get(`/auth/${dir}/callback`,
    passport.authenticate(provider, {
      failureRedirect: '/login',
    }), async (req, res) => {
      if (req.session) {
        identity = await global.IdentityFederation.findById(req.session).exec();
      } else {
        identity = await global.IdentityFederation.findOne({ [`${provider}Id`]: req.user.id }).exec()
          || new global.IdentityFederation();
      }

      identity[`${provider}Id`] = req.user.id;
      identity[`${provider}Profile`] = req.user._json;
      await identity.save();

      res.redirect('/');
    });
};
