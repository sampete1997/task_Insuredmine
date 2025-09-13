const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userAccountSchema = new Schema({
    account_name: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const UserAccount = model('user_account', userAccountSchema);

module.exports = UserAccount;