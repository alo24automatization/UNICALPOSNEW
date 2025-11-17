const { Schema, model } = require('mongoose');
const Joi = require('joi');

const client = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true, index: true },
    isArchive: { type: Boolean, default: false },
    packman: { type: Schema.Types.ObjectId, ref: 'Packman', index: true },
    balance: { type: Number, default: 0 },
    debtLimit: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

// client.schema.js
client.virtual('saleconnectors', {
  ref: 'SaleConnector',
  localField: '_id',
  foreignField: 'client',
});

client.set('toObject', { virtuals: true });
client.set('toJSON', { virtuals: true });

function validateClient(client) {
  const schema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    market: Joi.string().required(),
    debtLimit: Joi.number().optional(),
  });

  return schema.validate(client);
}

module.exports.validateClient = validateClient;
module.exports.Client = model('Client', client);
