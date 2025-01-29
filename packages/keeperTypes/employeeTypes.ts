import { JobLevel, TOnsiteSchedule } from './employerTypes';
import {
  TGeoLocation,
  TAccountType,
  EmptyObject,
  TMatch,
  EmploymentTypes,
  TFrontendBackendOptions,
  TCompanySize,
} from './globalTypes';

export type TEmployee = {
  _id?: string;
  phoneNumber: string;
  accountType: TAccountType;
  createdAt: Date;
  email: string;
  lastUpdatedOnWeb: boolean | null;
  expoPushToken: string | null;
  geoLocation: TGeoLocation | null;
  receivedLikes: string[];
  hasSeenFirstLikeAlert?: boolean;
  hasGottenToEditProfileScreen?: boolean;
  hasReceivedLikeNotification?: boolean;
  matches: TMatch[];
  settings: TEmployeeSettings;
  preferences: TEmployeePreferences;
};

export type TEmployeeSettings = {
  firstName: string | undefined;
  lastName: string | undefined;
  img: string | undefined;
  address: string | undefined;
  aboutMeText: string | undefined;
  relevantSkills: string[] | undefined;
  jobTitle: string | undefined;
  searchRadius: number | undefined;
  isUsCitizen: boolean | undefined;
  onSiteOptionsOpenTo: TOnsiteSchedule[] | undefined;
  isSeekingFirstJob: boolean | undefined;
  jobHistory: TEmployeePastJob[] | undefined;
  educationHistory: TEmployeeEducation[] | undefined;
  yearsOfExperience: number | undefined;
  employmentTypesOpenTo: EmploymentTypes[] | undefined;
  frontendBackendOptionsOpenTo: TFrontendBackendOptions[] | undefined;
  companySizeOptionsOpenTo: TCompanySize[] | undefined;
  linkedInUrl?: string;
};

export type TEmployeePastJob =
  | {
      uuid?: string;
      jobTitle: string;
      company: string;
      startDate: string;
      endDate: string;
      jobDescription: string;
    }
  | EmptyObject;

export type TEmployeeEducation =
  | {
      uuid?: string;
      school: string;
      major: string;
      endDate: string;
      degree: 'None' | `Bachelor's` | `Master's` | 'Doctorate' | 'Bootcamp';
    }
  | EmptyObject;

export type TEmployeePreferences = {
  searchRadius?: number;
  jobLevel?: JobLevel[];
  locationFlexibility?: string[];
  geoLocation?: TGeoLocation | null;
  relevantSkills?: Array<string>;
  isRemote?: boolean;
  isNew?: boolean;
};

export type TDateRange = {
  startYear: string;
  endYear: string;
};

export type TJobAlreadySwipedOn = {
  jobId: string;
  isRightSwipe: boolean;
};

export type TCoreSignalSearchFilters = {
  fullName: string;
  companyName: string;
};

export type TCoreSignalEducation = {
  id: number;
  member_id: number;
  title: string;
  subtitle: string;
  date_from: string;
  date_to: string;
  activities_and_societies: string | null;
  description: string;
  created: string;
  last_updated: string;
  deleted: number;
  school_url: string | null;
};

export type TCoreSignalExperience = {
  id: number;
  member_id: number;
  title: string | null;
  location: string | null;
  company_name: string | null;
  company_url: string | null;
  date_from: string | null;
  date_to: string | null;
  duration: string | null;
  description: string;
  created: string | null;
  last_updated: string | null;
  deleted: number;
  order_in_profile: string | null;
  company_id: string;
};

export type TCoreSignalGroup = {
  title: string;
  url: string;
  order_in_profile: number;
  member_hash_id: string;
  groups_hash_id: string;
};

export type TCoreSignalWebsite = {
  personal_website: string;
  order_in_profile: number;
  member_hash_id: string;
  websites_hash_id: string;
};

export type TCoreSignalSkill = {
  skill: string;
  order_in_profile: number;
  member_hash_id: string;
  skills_hash_id: string;
  member_skill_list: {
    id: number;
    skill: string;
    hash: string;
    created: string;
    last_updated: string;
  };
};

export type TCoreSignalLanguage = {
  language: string;
  proficiency: string;
  order_in_profile: number;
  member_hash_id: string;
  languages_hash_id: string;
};

export type TCoreSignalInterest = {
  interest: string;
  order_in_profile: number;
  member_hash_id: string;
  interests_hash_id: string;
};

export type TCoreSignalUserData = {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  title: string | null;
  url: string;
  hash: string;
  location: string;
  industry: string;
  summary: string;
  logo_url: string;
  country: string;
  canonical_shorthand_name: string;
  member_education_collection: TCoreSignalEducation[];
  member_experience_collection: TCoreSignalExperience[];
  member_languages_collection: TCoreSignalLanguage[];
  member_skills_collection: TCoreSignalSkill[];
  received_at: string;
  member_hash_id: string;
};

export type TAllPossibleCoreSignalFilters = {
  name: string;
  title: string;
  location: string;
  industry: string;
  summary: string;
  created_at_gte: string;
  created_at_lte: string;
  last_updated_gte: string;
  last_updated_lte: string;
  country: string;
  skill: string;
  certification_name: string;
  experience_title: string;
  experience_company_name: string;
  experience_company_exact_name: string;
  experience_company_website_url: string;
  experience_company_website_exact_url: string;
  experience_company_linkedin_url: string;
  experience_company_industry: string;
  experience_company_size: string;
  experience_company_employees_count_gte: number;
  experience_company_employees_count_lte: number;
  experience_date_from: string;
  experience_date_to: string;
  experience_description: string;
  experience_deleted: boolean;
  experience_company_id: number;
  active_experience: boolean;
  keyword: string;
  education_institution_name: string;
  education_institution_exact_name: string;
  education_program_name: string;
  education_description: string;
  education_date_from: string;
  education_date_to: string;
  education_institution_linkedin_url: string;
};
