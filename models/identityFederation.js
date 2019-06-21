const mongoose = require('mongoose');

const config = require('../config/config');


const schema = {};
config.providers.forEach((provider) => {
  schema[`${provider.provider}Id`] = { type: String, unique: true };
  schema[`${provider.provider}Profile`] = Object;
});

module.exports = mongoose.model('IdentityFederation', new mongoose.Schema(schema, {
  timestamps: true,
}));
