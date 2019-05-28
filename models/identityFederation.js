const mongoose = require('mongoose');

module.exports = (list) => {
  const schema = {};
  list.forEach((provider) => {
    schema[`${provider}Id`] = { type: String, unique: true };
    schema[`${provider}Profile`] = Object;
  });

  return mongoose.model('IdentityFederation', new mongoose.Schema(schema, {
    timestamps: true,
  }));
};
