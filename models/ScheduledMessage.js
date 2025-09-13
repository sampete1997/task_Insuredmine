const mongoose = require("mongoose");
const { Schema ,model} = mongoose;

const ScheduledMessageSchema = new Schema(
  {
    message: { type: String, required: true },
    day: { type: String, required: true },
    time: { type: String, required: true },
    // executedAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const ScheduledMessage = model("scheduled_message", ScheduledMessageSchema);

module.exports = ScheduledMessage;
