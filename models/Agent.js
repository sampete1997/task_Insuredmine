const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const agentSchema = new Schema({
    name: { type: String, required: true },
}, { timestamps: true });

const Agent = model('agent', agentSchema);

module.exports = Agent;