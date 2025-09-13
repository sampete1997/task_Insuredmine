const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const policyInfoSchema = new Schema({
    policy_number: { type: String, required: true, unique: true },
    policy_start_date: { type: Date, required: true },
    policy_end_date: { type: Date, required: true },
    policy_category_id: { type: Schema.Types.ObjectId, ref: 'PolicyCategory', required: true },
    policy_carrier_id: { type: Schema.Types.ObjectId, ref: 'PolicyCarrier', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    premium_amount: { type: Number, required: true }
}, { timestamps: true });

const PolicyInfo = model('policy_info', policyInfoSchema);

module.exports = PolicyInfo;