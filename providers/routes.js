const passport = require('passport');

module.exports = (app, p, IdentityFederation) => {
  const { provider, directory } = p;

  app.get(`/auth/${directory}`,
    passport.authenticate(provider));

  app.get(`/auth/${directory}/callback`,
    passport.authenticate(provider, {
      failureRedirect: '/login',
    }), async (req, res) => {
      let identity;

      if (req.session.user) {
        const [identityId, identityProvider] = await Promise.all([
          // eslint-disable-next-line no-underscore-dangle
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
      identity[`${provider}Profile`] = req.user._json || req.user._profileJson; // eslint-disable-line no-underscore-dangle
      await identity.save();

      req.session.user = identity;
      res.redirect('/');
    });
};
