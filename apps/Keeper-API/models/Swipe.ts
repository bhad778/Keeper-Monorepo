import mongoose from 'mongoose';

const SwipeSchema = new mongoose.Schema({
  ownerId: String,
  isRightSwipe: Boolean,
  receiverId: String,
  timeStamp: Date,
  createdOnWeb: Boolean,
});

export default mongoose.model('Swipes', SwipeSchema);
