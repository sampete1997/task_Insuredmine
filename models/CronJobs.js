const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CronJobsSchema = new Schema(
  {
    json_string: { type: String, required: true },
    execute_at: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const CronJobs = model("cron_jobs", CronJobsSchema);

module.exports = CronJobs;
