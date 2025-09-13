const express = require("express");
const router = express.Router();
const { Worker } = require("worker_threads");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const User = require("../models/User");
const PolicyInfo = require("../models/PolicyInfo");
const ScheduledMessage = require("../models/ScheduledMessage");
const { uploadFile } = require("../middleware/fileUpload");
const CronJobs = require("../models/CronJobs");

const uploadFileToDb = async (req, res) => {
    try {
        const worker = new Worker("./workers/worker.js", {
            workerData: { filePath: req.file.filename },
        });

        worker.on("message", (msg) => {
            if (msg.error) {
                return res.status(400).send({ status: "error", message: msg.error });
            }
            res.status(200).json({ message: "success", data: msg });
        });

        worker.on("error", (err) => {
            console.log("worker error", err);
            res.status(500).send(err);
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

// Search policy by username

const searchPolicy = async (req, res) => {
    try {
        const username = req.query?.username;
        if (!username)
            return res.status(400).json({ msg: "Please provide username" });
        console.log("username", username);
        const user = await User.findOne({ firstname: username });
        console.log("user", user);
        if (!user) return res.status(404).json({ message: "User not found" });

        const result = await PolicyInfo.aggregate([
            {
                $match: { user_id: user._id },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "policy_carriers",
                    localField: "policy_carrier_id",
                    foreignField: "_id",
                    as: "policy_carrier",
                },
            },
            {
                $unwind: {
                    path: "$policy_carrier",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "policy_categories",
                    localField: "policy_category_id",
                    foreignField: "_id",
                    as: "policy_category",
                },
            },
            {
                $unwind: {
                    path: "$policy_category",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);

        res.status(200).json({ message: "success", data: result });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

// Aggregated policies per user

const aggregatePolicy = async (req, res) => {
    try {
        const user_id = req.body?.user_id || null;
        let filter = {};
        if (user_id) {
            filter = { user_id: new ObjectId(user_id) };
        }

        const result = await PolicyInfo.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: "$user_id",
                    policies: { $push: "$$ROOT" },
                    totalPolicies: { $sum: 1 },
                },
            },
        ]);

        res.json({ message: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const scheduledMessage = async (req, res) => {
    try {
        const { message, day, time } = req.body;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (!dateRegex.test(day)) {
            return res.status(400).json({ message: 'Invalid day format. Expected YYYY-MM-DD' });
        }

        if (!timeRegex.test(time)) {
            return res.status(400).json({ message: 'Invalid time format. Expected HH:MM (24-hour)' });
        }

        // Convert time to current timezone to UTC 
        const execute_at = new Date(`${day}T${time}`);

        const cronJob = await CronJobs.create({ json_string: JSON.stringify({ message, day, time }), execute_at });

        res.status(200).json({ message: 'success', data: 'Message scheduled successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
};

module.exports = { uploadFileToDb, searchPolicy, aggregatePolicy, scheduledMessage };
