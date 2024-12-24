import mongoose, { InferSchemaType } from 'mongoose';
import { JobSourceWebsiteEnum } from 'keeperTypes';
import { normalizeLocation, normalizeUrl, normalizeCompanyName } from 'keeperUtils';

const CompaniesSchema = new mongoose.Schema({
  createdAt: { type: Date, required: false, default: new Date() },
  // i.e. last update from linkedIn, indeed, etc
  lastSourceWebsiteUpdate: {
    type: Date,
    default: null,
    required: false,
  },
  lastGlassdoorCompanyUpdate: {
    type: Date,
    default: null,
    required: false,
  },
  lastGlassdoorReviewsUpdate: {
    type: Date,
    default: null,
    required: false,
  },
  lastCrunchbaseCompanyUpdate: {
    type: Date,
    default: null,
    required: false,
  },
  reviews: { type: Array, default: [], required: false },
  reviewsCount: { type: Number, default: null, required: false },
  reviewsUrl: { type: String, default: null, required: false },
  linkedInId: { type: String, default: null, required: false },
  indeedId: { type: String, default: null, required: false },
  sourceWebsite: { type: String, default: null, required: false },
  // link to company on linked in or indeed etc
  sourceWebsiteUrl: { type: String, default: null, required: false, set: value => normalizeUrl(value) },
  companyWebsiteUrl: {
    type: String,
    default: null,
    required: false,
    set: value => normalizeUrl(value),
  },
  companyName: {
    type: String,
    default: null,
    required: false,
    set: value => normalizeCompanyName(value),
  },
  about: { type: String, default: null, required: false },
  description: { type: String, default: null, required: false },
  logo: { type: String, default: null, required: false },
  bannerImage: { type: String, default: null, required: false },
  countryCode: { type: String, default: null, required: false },
  salariesCount: { type: Number, default: null, required: false },
  salariesUrl: { type: String, default: null, required: false },
  interviewsUrl: { type: String, default: null, required: false },
  photosCount: { type: Number, default: null, required: false },
  photosUrl: { type: String, default: null, required: false },
  jobsCount: { type: Number, default: null, required: false },
  jobsUrl: { type: String, default: null, required: false },
  benefitsUrl: { type: String, default: null, required: false },
  overviewUrl: { type: String, default: null, required: false },
  companySize: { type: String, default: null, required: false },
  revenue: { type: String, default: null, required: false },
  headquarters: { type: String, default: null, required: false, set: value => normalizeLocation(value) },
  companyType: { type: String, default: null, required: false },
  industry: { type: String, default: null, required: false },
  diversityScore: { type: String, default: null, required: false },
  locations: { type: Array, default: null, required: false },
  glassdoorUrl: { type: String, default: null, required: false },
  interviewDifficulty: { type: String, default: null, required: false },
  interviewsCount: { type: Number, default: null, required: false },
  rating: { type: Number, default: null, required: false },
  careerOpportunitiesRating: { type: Number, default: null, required: false },
  ceoApprovalRating: { type: Number, default: null, required: false },
  compensationBenefitsRating: { type: Number, default: null, required: false },
  cultureValuesRating: { type: Number, default: null, required: false },
  seniorManagementRating: { type: Number, default: null, required: false },
  workLifeBalanceRating: { type: Number, default: null, required: false },
  businessOutlookRating: { type: Number, default: null, required: false },
  recommendToFriendRating: { type: Number, default: null, required: false },
});

export type TCompany = InferSchemaType<typeof CompaniesSchema> & {
  sourceWebsite: JobSourceWebsiteEnum;
};

export default mongoose.model('Company', CompaniesSchema);
