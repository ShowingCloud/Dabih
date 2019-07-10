const Redis = require('ioredis');

const config = require('../config/config');


module.exports = (provider) => {
  const refresh = {};

  refresh.RefreshTokenClient = new Redis(config.redisStorageURL, {
    keyPrefix: `${config.redisTokenPrefix}${provider}:`,
  });

  refresh.RefreshTokenClient.hgetall('config').then((result) => { refresh.RefreshTokenConfig = result; });
  refresh.ReloadConfig = function ReloadConfig() {
    refresh.RefreshTokenClient.hgetall('config').then((result) => { refresh.RefreshTokenConfig = result; });
  };

  return refresh;
};
