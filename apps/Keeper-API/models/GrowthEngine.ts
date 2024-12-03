import mongoose from 'mongoose';

const GrowthEngineSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: false },
  yearsOfExperience: { type: Number, required: false },
  mainSkill: { type: String, required: false },
  accountType: { type: String, required: false },
  hasReceivedEmail: { type: Boolean, required: true },
});

GrowthEngineSchema.index({ hasReceivedEmail: 1 });

export default mongoose.model('GrowthEngines', GrowthEngineSchema);
