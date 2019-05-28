const passport = require('passport');

module.exports = (app, provider, path) => {
  const dir = path || provider;

  app.get(`/auth/${dir}`,
    passport.authenticate(provider));

  app.get(`/auth/${dir}/callback`,
    passport.authenticate(provider, {
      failureRedirect: '/login',
    }), async (req, res) => {
      const [identity_id, identity_provider] = await Promise.all([
        global.IdentityFederation.findById(req.session.user._id).exec(),
        global.IdentityFederation.findOne({ [`${provider}Id`]: req.user.id }).exec()
      ]);

      if (req.session.user) {
        identity = await global.IdentityFederation.findById(req.session.user._id).exec();
      } else {
        identity = await global.IdentityFederation.findOne({ [`${provider}Id`]: req.user.id }).exec()
          || new global.IdentityFederation();
      }

      identity[`${provider}Id`] = req.user.id;
      identity[`${provider}Profile`] = req.user._json;
      await identity.save();

      req.session.user = identity;
      res.redirect('/');
    });
};
