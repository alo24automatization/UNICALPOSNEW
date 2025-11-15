const { Schema, model } = require('mongoose');

const clientBalanceTransactions = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    type: { type: String, required: true, enum: ['credit', 'debit'] },
    cash: { type: Number, default: 0 },
    card: { type: Number, default: 0 },
    transfer: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports.ClientBalanceTransactions = model('ClientBalanceTransactions', clientBalanceTransactions);
