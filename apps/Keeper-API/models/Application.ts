import mongoose, { Schema, Document } from 'mongoose';

import Employee from './Employee';
import Job from './Job';

// Job Application Interface
interface IApplication extends Document {
  employeeId: mongoose.Schema.Types.ObjectId; // Reference to the User model
  jobId: mongoose.Schema.Types.ObjectId; // Reference to the Job model
  createdAt: Date; // Date when the user applied
}

const applicationSchema = new Schema<IApplication>({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: Employee, required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: Job, required: true },
  createdAt: { type: Date, default: Date.now },
});

applicationSchema.index({ userId: 1 }); // Index for querying by userId
applicationSchema.index({ jobId: 1 });

const Application = mongoose.model<IApplication>('Application', applicationSchema);

export default Application;
