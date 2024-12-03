import mongoose, { InferSchemaType } from 'mongoose';
import { BrightDataSnapshotTypeEnum } from '../types/brightDataTypes';

const BrightDataSnapshotSchema = new mongoose.Schema({
  snapshotId: { type: String, required: false },
  // LinkedIn, Indeed
  sourceWebsite: { type: String, required: false },
  // BrightDataSnapshotTypeEnum i.e. JobListings, CompanyReviews, etc
  type: {
    type: String,
    enum: Object.values(BrightDataSnapshotTypeEnum),
    required: false,
  },
  createdAt: { type: Date, required: false },
});

export type TBrightDataSnapshot = InferSchemaType<typeof BrightDataSnapshotSchema>;

export default mongoose.model('BrightDataSnapshot', BrightDataSnapshotSchema);
