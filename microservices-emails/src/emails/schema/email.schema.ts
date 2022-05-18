import * as mongoose from 'mongoose';

export const EmailSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    to: { type: String, required: true },
    from: { type: String, required: true },
    timeToLifeSec: { type: Number, required: true },
  },
  { timestamps: true },
);

// EmailSchema.index({ username: 1 }, { unique: true });
// EmailSchema.index({ email: 1 }, { unique: true });
