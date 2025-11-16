const { Schema, model } = require('mongoose');

const clientBalanceTransactions = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    type: { type: String, required: true, enum: ['credit', 'debit'] },
    paymentType: { type: String, required: true, enum: ['cash', 'card', 'transfer'] },
    amount: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports.ClientBalanceTransactions = model(
  'ClientBalanceTransactions',
  clientBalanceTransactions,
);
