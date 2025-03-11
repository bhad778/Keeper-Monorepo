import mongoose, { Schema, Document } from 'mongoose';

// Resume Interface
interface IResume extends Document {
  employeeId: mongoose.Schema.Types.ObjectId; // Reference to the Employee model
  fileUrl: string; // S3 URL to the resume file
  fileName: string; // Original file name
  uploadDate: Date; // Date when the resume was uploaded
}

const resumeSchema = new Schema<IResume>({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employees',
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

// Create index for quick lookup by employeeId
resumeSchema.index({ employeeId: 1 });

const Resume = mongoose.model<IResume>('Resume', resumeSchema);

export default Resume;
