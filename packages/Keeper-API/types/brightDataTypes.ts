// indeed job exactly as it comes from brightdata
export type TBrightDataIndeedJob = {
  jobid: string;
  company_name: string;
  date_posted_parsed: Date;
  job_title: string;
  // details job description
  description_text: string;
  benefits: string[];
  qualifications: string[];
  // full-time, part-time, etc.
  job_type: IndeedJobTypeEnum;
  location: string;
  // null, $30.52 - $40.69 an hour, $33,540 - $54,455 a year, From $55,000 a year, $26.13 an hour
  salary_formatted: string;
  company_rating: number;
  company_reviews_count: number;
  country?: string;
  date_posted: string;
  // additional job description
  description: string;
  region: string;
  // link to company profile
  company_link: string;
  company_website: string;
  // company website domain, not sure what this is
  domain: string;
  apply_link: string;
  // source of the job listing, not sure what this is
  srcname: string;
  // url of the job listing
  url: string;
  is_expired: boolean;
};

export type TBrightDataIndeedCompany = {
  company_id: string;
  name: string;
  description: string;
  url: string;
  industry: string;
  company_size: string;
  revenue: string;
  logo: string;
  headquarters: string;
  country_code: string;
  reviews_url: string;
  salaries_url: string;
  jobs_url: string;
  interviews_url: string;
  photos_url: string;
  jobs_count: number;
  interviews_count: number;
  photos_count: number;
  salaries_count: number;
  reviews_count: number;
  website: string;
};

// linkedin job exactly as it comes from brightdata
export type TBrightDataLinkedInJob = {
  url: string;
  job_posting_id: Date;
  job_title: string;
  company_name: string;
  company_id: string;
  job_location: string;
  job_summary: string;
  job_seniority_level: BrightDataSeniorityEnum;
  job_function: string;
  job_employment_type: string;
  job_industries: string;
  job_base_pay_range?: string;
  company_url: string;
  // this is the actual date object
  job_posted_date: string;
  // this is a string like "5 days ago"
  job_posted_time: string;
  job_num_applicants: string;
  apply_link: string;
  country_code: string;
  company_logo: string;
};

export type TBrightDataLinkedInCompany = {
  id: string;
  company_id: string;
  name: string;
  country_code: string;
  locations: string;
  about: string;
  specialties: string;
  company_size: string;
  organization_type: string;
  industries: string;
  website: string;
  headquarters: string;
  image: string;
  logo: string;
  crunchbase_url: string;
  url: string;
  description: string;
  founded: number;
  employees_in_linkedin: number;
  followers: number;
};

export type TBrightDataGlassdoorCompany = {
  error_code?: any;
  error?: any;
  ratings_overall: number;
  details_size: string;
  company_type: string;
  country_code: string;
  url_jobs: string;
  url_overview: string;
  url_reviews: string;
  benefits_url: string;
  details_headquarters: string;
  details_industry: string;
  details_revenue: string;
  details_website: string;
  ratings_career_opportunities: number;
  ratings_ceo_approval: number;
  ratings_compensation_benefits: number;
  ratings_culture_values: number;
  diversity_inclusion_score: string;
  ratings_senior_management: number;
  ratings_work_life_balance: number;
  ratings_business_outlook: number;
  ratings_recommend_to_friend: number;
  interview_difficulty: string;
  interviews_count: number;
  reviews_count: number;
  url: string;
};

export type TBrightDataCompanyReview = {};

export type TJobsQueueMessage = {
  snapshotId: string;
  sourceWebsite: JobSourceWebsiteEnum;
};

export type TSourceWebsiteCompaniesQueueMessage = {
  snapshotId: string;
};

export type TGlassdoorCompaniesQueueMessage = {
  snapshotId: string;
};

export enum BrightDataSeniorityEnum {
  NotApplicable = 'Not Applicable',
  Internship = 'Internship',
  EntryLevel = 'Entry level',
  Associate = 'Associate',
  MidSeniorLevel = 'Mid-Senior level',
  Director = 'Director',
}

export enum JobSourceWebsiteEnum {
  LinkedIn = 'LinkedIn',
  Indeed = 'Indeed',
}

export enum IndeedJobTypeEnum {
  FullTime = 'Full-time',
  Contract = 'Contract',
  Seasonal = 'Seasonal',
}

export enum BrightDataSnapshotTypeEnum {
  JobListings = 'JobListings',
  CompanyReviews = 'CompanyReviews',
  SourceWebsiteCompanyDetails = 'SourceWebsiteCompanyDetails',
  GlassdoorCompanyDetails = 'GlassdoorCompanyDetails',
}
