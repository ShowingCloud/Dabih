const mongoose = require('mongoose');

module.exports = (list) => {
  let schema = {};
  list.forEach((provider) => {
    schema[`${provider}Id`] = { type: String, unique: true };
    schema[`${provider}Profile`] = Object;
  });

  return mongoose.model('IdentityFederation', new mongoose.Schema(schema, {
    timestamps: true,
  }));
};
