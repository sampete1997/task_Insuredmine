const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URL}/policyDB`);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = { connectMongoDB };
