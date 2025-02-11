import { JobSourceWebsiteEnum } from './brightDataTypes';

export type TCompany = {
  _id?: string;
  createdAt?: Date;
  lastSourceWebsiteUpdate?: Date | null;
  lastGlassdoorCompanyUpdate?: Date | null;
  lastGlassdoorReviewsUpdate?: Date | null;
  lastCrunchbaseCompanyUpdate?: Date | null;
  reviews?: any[]; // Replace `any[]` with a specific type if reviews have a defined structure
  reviewsCount?: number | null;
  reviewsUrl?: string | null;
  linkedInId?: string | null;
  indeedId?: string | null;
  sourceWebsite: JobSourceWebsiteEnum;
  sourceWebsiteUrl?: string | null;
  companyWebsiteUrl?: string | null;
  companyName?: string | null;
  about?: string | null;
  description?: string | null;
  logo?: string | null;
  bannerImage?: string | null;
  companyUUID?: string | null;
  countryCode?: string | null;
  salariesCount?: number | null;
  salariesUrl?: string | null;
  interviewsUrl?: string | null;
  photosCount?: number | null;
  photosUrl?: string | null;
  jobsCount?: number | null;
  jobsUrl?: string | null;
  benefitsUrl?: string | null;
  overviewUrl?: string | null;
  companySize?: string | null;
  revenue?: string | null;
  headquarters?: string | null;
  companyType?: string | null;
  foundedDate?: string | null;
  industry?: string | null;
  diversityScore?: string | null;
  locations?: any[] | null; // Replace `any[]` with a specific type if locations have a defined structure
  glassdoorUrl?: string | null;
  crunchbaseUrl?: string | null;
  interviewDifficulty?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  socialMediaLinks?: any[] | null; // Replace `any[]` with a specific type if links have a defined structure
  interviewsCount?: number | null;
  rating?: number | null;
  careerOpportunitiesRating?: number | null;
  ceoApprovalRating?: number | null;
  compensationBenefitsRating?: number | null;
  cultureValuesRating?: number | null;
  seniorManagementRating?: number | null;
  workLifeBalanceRating?: number | null;
  businessOutlookRating?: number | null;
  recommendToFriendRating?: number | null;
};
