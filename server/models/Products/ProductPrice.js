const { Schema, model } = require('mongoose');
const Joi = require('joi');

const productprice = new Schema(
  {
    sellingprice: { type: Number },
    sellingpriceuzs: { type: Number },
    incomingprice: { type: Number },
    incomingpriceuzs: { type: Number },
    tradeprice: { type: Number },
    tradepriceuzs: { type: Number },
    proceint: { type: Number },
    product: { type: Schema.Types.ObjectId, ref: 'Product', index: true },
    incoming: {
      type: Schema.Types.ObjectId,
      ref: 'Incoming',
      index: true,
    },
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true, index: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

function validateProductPrice(productprice) {
  const schema = Joi.object({
    sellingprice: Joi.number(),
    incomingprice: Joi.number(),
    sellingpriceuzs: Joi.number(),
    incomingpriceuzs: Joi.number(),
    proceint: Joi.number(),
    product: Joi.string().required(),
    incoming: Joi.string().required(),
    market: Joi.string().required(),
  });

  return schema.validate(productprice);
}

module.exports.validateProductPrice = validateProductPrice;
module.exports.ProductPrice = model('ProductPrice', productprice);
