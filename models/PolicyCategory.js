const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const policyCategorySchema = new Schema({
    category_name: { type: String, required: true }
}, { timestamps: true });

const PolicyCategory = model('policy_category', policyCategorySchema);

module.exports = PolicyCategory;