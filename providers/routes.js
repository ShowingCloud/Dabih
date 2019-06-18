const passport = require('passport');

module.exports = (app, provider, IdentityFederation, path) => {
  const dir = path || provider;

  app.get(`/auth/${dir}`,
    passport.authenticate(provider));

  app.get(`/auth/${dir}/callback`,
    passport.authenticate(provider, {
      failureRedirect: '/login',
    }), async (req, res) => {
      let identity;

      if (req.session.user) {
        const [identityId, identityProvider] = await Promise.all([
          IdentityFederation.findById(req.session.user._id),
          IdentityFederation.findOne({ [`${provider}Id`]: req.user.id }),
        ]);

        if (identityId && identityProvider) {
          if (identityId.id === identityProvider.id) {
            identity = identityId;
          } else {
            identity = identityId;
            // DO THE OTHER THINGS
          }
        } else {
          identity = identityId || identityProvider || new IdentityFederation();
        }
      } else {
        identity = await IdentityFederation.findOne({ [`${provider}Id`]: req.user.id }).exec()
          || new IdentityFederation();
      }

      identity[`${provider}Id`] = req.user.id;
      identity[`${provider}Profile`] = req.user._json || req.user._profileJson;
      await identity.save();

      req.session.user = identity;
      res.redirect('/');
    });
};
