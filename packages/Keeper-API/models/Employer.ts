import mongoose from 'mongoose';

const EmployerSchema = new mongoose.Schema({
  phoneNumber: String,
  accountType: String,
  createdAt: Date,
  email: String,
  expoPushToken: String,
  isNew: Boolean,
  hasSeenFirstLikeAlert: Boolean,
  hasReceivedLikeNotification: Boolean,
});

export default mongoose.model('Employers', EmployerSchema);
