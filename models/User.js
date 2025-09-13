const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    firstname: { type: String, required: true },
    dob: { type: String, required: true },
    address: { type: String, required: false },
    phone: { type: String, required: true },
    state: { type: String, required: false },
    zip: { type: String, required: false },
    email: { type: String, required: true, },
    gender: { type: String, required: false},
    userType: { type: String, required: true }
}, { timestamps: true });

const User = model('user', userSchema);

module.exports = User;