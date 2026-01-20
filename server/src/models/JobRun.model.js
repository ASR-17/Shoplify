// server/src/models/JobRun.model.js
import mongoose from "mongoose";

const jobRunSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    lastRunAt: { type: Date, default: null },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const JobRun = mongoose.model("JobRun", jobRunSchema);
export default JobRun;
