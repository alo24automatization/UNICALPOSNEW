const { Schema, model, Types } = require('mongoose');
const Joi = require('joi');

const productdata = new Schema(
  {
    name: { type: String, required: true },
    unit: { type: Schema.Types.ObjectId, ref: 'Unit', index: true },
    code: { type: String, required: true },
    barcode: { type: String },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product', index: true }],
    product: { type: Schema.Types.ObjectId, ref: 'Product', index: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', index: true },
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true, index: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

function validateProductData(productdata) {
  const schema = Joi.object({
    name: Joi.string().required(),
    unit: Joi.string(),
    code: Joi.string().required(),
    category: Joi.string(),
    market: Joi.string().required(),
  });

  return schema.validate(productdata);
}

module.exports.validateProductData = validateProductData;
module.exports.ProductData = model('ProductData', productdata);
