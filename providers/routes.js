const passport = require('passport');

const RefreshToken = require('./refreshToken');
const config = require('../config/config');


module.exports = (app, IdentityFederation) => {
  app.get('/auth/:directory', (req, res, next) => {
    const provider = config.providers.filter(p => p.directory === req.params.directory);

    if (!provider.length) {
      console.log(`Invalid auth request for ${req.params.directory}`); // eslint-disable-line no-console
      return res.redirect('/login');
    }

    return passport.authenticate(provider[0].provider)(req, res, next);
  });

  app.get('/auth/:directory/callback', (req, res, next) => {
    const provider = config.providers.filter(p => p.directory === req.params.directory);

    if (!provider.length) {
      console.log(`Invalid callback for ${req.params.directory}`); // eslint-disable-line no-console
      return res.redirect('/login');
    }

    req.params.provider = provider[0].provider;

    return passport.authenticate(req.params.provider)(req, res, next, {
      failureRedirect: '/login',
    });
  }, async (req, res) => {
    let identity;

    if (!req.params.provider) {
      console.log(`Provider unset for ${req.params.directory}`); // eslint-disable-line no-console
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
    identity[`${req.params.provider}Access`] = req.user._accessToken; // eslint-disable-line no-underscore-dangle
    identity[`${req.params.provider}Refresh`] = req.user._refreshToken; // eslint-disable-line no-underscore-dangle
    await identity.save();

    req.session.user = identity;
    return res.redirect('/');
  });

  app.get('/auth/:directory/refreshTokens', (req, res) => {
    const provider = config.providers.filter(p => p.directory === req.params.directory);

    if (!provider.length) {
      console.log(`Could not refresh tokens for ${req.params.directory}`); // eslint-disable-line no-console
      return res.redirect('/login');
    }

    const { RefreshTokenClient } = RefreshToken(provider[0].provider);
    const stream = RefreshTokenClient.scanStream({
      match: `Dabih-Token:${provider[0].provider}:*`,
    });
    stream.on('data', keys => keys.forEach(async (key) => {
      const id = key.split(':')[2];
      if (id !== 'config') {
        // eslint-disable-next-line no-underscore-dangle
        const ret = await passport._strategies[provider[0].provider].refreshToken(id);
        if (ret) {
          const identity = await IdentityFederation.findById(id).exec();
          identity[`${provider[0].provider}Access`] = ret;
          await identity.save();
        }
      }
    }));

    return res.redirect('/');
  });
};
