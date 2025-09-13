const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const policyCarrierSchema = new Schema({
    company_name: { type: String, required: true }
}, { timestamps: true });

const PolicyCarrier = model('policy_carrier', policyCarrierSchema);

module.exports = PolicyCarrier;