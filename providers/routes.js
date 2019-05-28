const passport = require('passport');

module.exports = (app, provider, path) => {
  const dir = path || provider;

  app.get(`/auth/${dir}`,
    passport.authenticate(provider));

  app.get(`/auth/${dir}/callback`,
    passport.authenticate(provider, {
      failureRedirect: '/login',
    }), async (req, res) => {
      let identity;

      if (req.session.user) {
        const [identity_id, identity_provider] = await Promise.all([
          global.IdentityFederation.findById(req.session.user._id),
          global.IdentityFederation.findOne({ [`${provider}Id`]: req.user.id })
        ]);

        if (identity_id && identity_provider) {
          if (identity_id === identity_provider) {
            identity = identity_id;
          } else {
            identity = identity_id;
            /* DO THE OTHER THINGS */
          }
        } else {
          identity = identity_id ? identity_id :
            identity_provider ? identity_provider :
            new global.IdentityFederation();
        }

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
