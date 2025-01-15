import mongoose, { Schema, Document } from 'mongoose';

// Job Application Interface
interface IJobApplication extends Document {
  employeeId: mongoose.Schema.Types.ObjectId; // Reference to the User model
  jobId: mongoose.Schema.Types.ObjectId; // Reference to the Job model
  createdAt: Date; // Date when the user applied
}

const jobApplicationSchema = new Schema<IJobApplication>({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  createdAt: { type: Date, default: Date.now },
});

jobApplicationSchema.index({ userId: 1 }); // Index for querying by userId
jobApplicationSchema.index({ jobId: 1 });

const JobApplication = mongoose.model<IJobApplication>('JobApplication', jobApplicationSchema);

export default JobApplication;
