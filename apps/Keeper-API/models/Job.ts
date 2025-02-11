import mongoose from 'mongoose';

import { normalizeLocation, normalizeTitle, normalizeUrl, normalizeCompanyName } from '../keeperApiUtils';
import Company from './Company';

const JobSchema = new mongoose.Schema({
  // devdog fields
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: Company, default: null, required: false },
  createdAt: { type: Date, default: Date.now, required: false },
  geoLocation: { type: Object, default: null, required: false },
  hasGottenGeoLocationData: { type: Boolean, default: false, required: false },
  hasGottenToEditProfileScreen: { type: Boolean, default: false, required: false },
  hasReceivedLikeNotification: { type: Boolean, default: false, required: false },
  receivedLikes: { type: Array, default: [], required: false },
  matches: { type: Array, default: [], required: false },
  relevantSkills: { type: Array, default: [], required: false },
  compensation: { type: String, default: null, required: false },
  formattedCompensation: { type: Object, default: null, required: false },
  requiredYearsOfExperience: { type: Number, default: 0, required: false },
  // this is Indeed, LinkedIn, etc
  sourceWebsite: { type: String, default: null, required: false },
  locationFlexibility: { type: String, default: null, required: false },
  projectDescription: { type: String, default: null, required: false },
  benefits: { type: Array, default: [], required: false },
  responsibilities: { type: Array, default: [], required: false },
  qualifications: { type: Array, default: null, required: false },
  jobLevel: { type: String, default: null, required: false },

  // brightData fields
  // this is the url to the application from the source website
  sourceWebsiteApplicationUrl: { type: String, default: null, required: false, set: value => normalizeUrl(value) },
  jobTitle: { type: String, default: null, required: false, set: value => normalizeTitle(value) },
  companyName: {
    type: String,
    default: null,
    required: false,
    set: value => normalizeCompanyName(value),
  },
  companyLogo: { type: String, default: null, required: false },
  jobLocation: { type: String, default: null, required: false, set: value => normalizeLocation(value) },
  jobSummary: { type: String, default: null, required: false },
  jobEmploymentType: { type: String, default: null, required: false },
  // this is a link to the company's website on the source website
  sourceWebsiteCompanyUrl: { type: String, default: null, required: false, set: value => normalizeUrl(value) },
  // this is the actual date object
  jobPostedDate: { type: String, default: null, required: false },
  applyLink: { type: String, unique: true, required: true },
});

// export type TJobInfered = InferSchemaType<typeof JobSchema>;

JobSchema.index({ createdAt: 1, requiredYearsOfExperience: 1, relevantSkills: 1 });

JobSchema.index({ createdAt: 1, requiredYearsOfExperience: 1, relevantSkills: 1, geoLocation: '2dsphere' });

JobSchema.index({ jobTitle: 'text', locationFlexibility: 'text', relevantSkills: 'text', jobLevel: 'text' });

export default mongoose.model('Jobs', JobSchema);
