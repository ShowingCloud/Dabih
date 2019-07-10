const mongoose = require('mongoose');

const config = require('../config/config');


const schema = {};
config.providers.forEach((provider) => {
  schema[`${provider.provider}Id`] = { type: String, unique: true, sparse: true };
  schema[`${provider.provider}Profile`] = Object;
  schema[`${provider.provider}Access`] = String;
  schema[`${provider.provider}Refresh`] = String;
});

module.exports = mongoose.model('IdentityFederation', new mongoose.Schema(schema, {
  timestamps: true,
}));
