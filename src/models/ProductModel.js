const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  pd_name: {
    type: String,
    required: true,
  },
  pd_image: {
    type: String,
    required: true,
  },
  pd_title: {
    type: String,
    required: true,
  },
  pd_price: {
    type: Number,
    required: true,
  },
  pd_description: {
    type: String,
  },
  pd_category: {
    type: Schema.Types.Mixed,  // Mixed is used for generic objects
    required: true,
  },
  is_delete: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
