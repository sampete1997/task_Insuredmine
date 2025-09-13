const cronJobs = require("../models/cronJobs");
const ScheduledMessage = require("../models/ScheduledMessage");


const checkTimeToExecuteInsertQuery = async () => {
    try {
        const currentDateTime = new Date();
        const ids = [];
        // console.log('currentDateTime', currentDateTime);
        const cronJobsList = await cronJobs.find({ execute_at: { $lte: currentDateTime } });
        const jobList = cronJobsList?.map(async (job) => {
            console.log("Cron job executed:", job.json_string);
            const details = JSON.parse(job.json_string);
            await ScheduledMessage.create(details);
            ids.push(job._id);
            return null
        });
        await Promise.allSettled(jobList);
        return await cronJobs.deleteMany({ _id: {$in: ids} });
    }
    catch (err) {
        console.log(err);
        throw err
    }
};

module.exports = { checkTimeToExecuteInsertQuery };