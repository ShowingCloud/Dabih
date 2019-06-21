const passport = require('passport');

const config = require('../config/config');


module.exports = (app, IdentityFederation) => {
  app.get('/auth/:directory', (req, res, next) => {
    const provider = config.providers.filter(p => p.directory === req.params.directory);

    if (!provider.length) {
      return res.redirect('/login');
    }

    return passport.authenticate(provider[0].provider)(req, res, next);
  });

  app.get('/auth/:directory/callback', (req, res, next) => {
    const provider = config.providers.filter(p => p.directory === req.params.directory);

    if (!provider.length) {
      return res.redirect('/login');
    }

    req.params.provider = provider[0].provider;

    return passport.authenticate(req.params.provider)(req, res, next, {
      failureRedirect: '/login',
    });
  }, async (req, res) => {
    let identity;

    if (!req.params.provider) {
      return res.redirect('/login');
    }

    if (req.session.user) {
      const [identityId, identityProvider] = await Promise.all([
        // eslint-disable-next-line no-underscore-dangle
        IdentityFederation.findById(req.session.user._id),
        IdentityFederation.findOne({ [`${req.params.provider}Id`]: req.user.id }),
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
      identity = await IdentityFederation.findOne({ [`${req.params.provider}Id`]: req.user.id }).exec()
        || new IdentityFederation();
    }

    identity[`${req.params.provider}Id`] = req.user.id;
    identity[`${req.params.provider}Profile`] = req.user._json || req.user._profileJson; // eslint-disable-line no-underscore-dangle
    await identity.save();

    req.session.user = identity;
    return res.redirect('/');
  });
};
