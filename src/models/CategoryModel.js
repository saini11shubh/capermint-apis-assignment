const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  cg_name: {
    type: String,
    required: true,
  },
  is_delete: {
    type: Boolean,
    default: false,
  },
  root: {
    type: Array,
  },
  cg_parentId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
