import { JobSourceWebsiteEnum } from './brightDataTypes';
import {
  TMatch,
  TGeoLocation,
  TFrontendBackendOptions,
  TCompanySize,
  TWorkAuthOptions,
  EmploymentTypeEnum,
} from './globalTypes';

export type TEmployer = {
  _id?: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
  accountType: string;
  isNew: boolean;
  expoPushToken?: string | null;
  employersJobs?: TJob[];
  hasSeenFirstLikeAlert?: boolean;
  hasReceivedLikeNotification?: boolean;
};

export type TEmployerFilterListOptions =
  | 'Experience'
  | 'Skills'
  | 'Company Size'
  | 'Frontend/Backend'
  | 'Work Auth'
  | 'Salary/Contract';

export enum locationFlexibilityEnum {
  remote = 'Remote',
  hybrid = 'Hybrid',
  onsite = 'On-site',
}

export type TLocationFlexibility =
  | 'onsite' // For 100% onsite jobs
  | 'remote' // For 100% remote jobs
  | `hybrid - ${number} days` // For hybrid jobs with a specific number of days
  | 'hybrid'; // For hybrid jobs without a specific number of days

export enum SeniorityLevelEnum {
  Intern = 'Intern',
  Entry = 'Entry',
  Mid = 'Mid',
  Senior = 'Senior',
  Lead = 'Lead',
  Principal = 'Principal',
  Staff = 'Staff',
  Director = 'Director',
}

export enum SeniorityLevelToExperienceEnum {
  intern = 0,
  entry = 0,
  mid = 3,
  senior = 6,
  lead = 8,
  principal = 11,
  staff = 11,
  director = 11,
}

// job in our database
export type TJob = {
  _id?: string;
  companyId?: string | null;
  expoPushToken?: string | null;
  requiredYearsOfExperience: number;
  relevantSkills: string[];
  createdAt: Date;
  receivedLikes: string[];
  matches: TMatch[];
  geoLocation?: TGeoLocation;
  hasGottenToEditProfileScreen?: boolean;
  hasReceivedLikeNotification?: boolean;
  compensation: string | null;
  formattedCompensation: TJobCompensation | null;
  sourceWebsite: JobSourceWebsiteEnum;
  locationFlexibility: TLocationFlexibility | null;
  projectDescription: string | null;
  benefits: string[] | null;
  responsibilities: string[] | null;
  qualifications: string[] | null;
  seniorityLevel: SeniorityLevelEnum | null;
  tags?: string[] | null;

  sourceWebsiteApplicationUrl: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string | null;
  jobLocation: string;
  jobSummary: string;
  jobEmploymentType: string;
  sourceWebsiteCompanyUrl: string;
  // this is the actual date object
  jobPostedDate: string | null;
  applyLink: string;
};

export type TBenefitOptions = 'None' | 'Dental' | 'Vision' | 'Health Care' | '401k';

export type TOnsiteSchedule = 'Remote' | 'Hybrid' | 'Office';

export type TJobCompensation = {
  type: EmploymentTypeEnum;
  payRange?: { min: number; max: number };
};

export type TCompensationRange = {
  min: number;
  max: number;
};

export type TJobPreferences = {
  searchRadius: number | undefined;
  yearsOfExperience: number | undefined;
  relevantSkills: Array<string> | undefined;
  geoLocation: TGeoLocation | undefined;
  isRemote: boolean | undefined;
  frontendBackendOptionsOpenTo: TFrontendBackendOptions[] | undefined;
  companySizeOptionsOpenTo: TCompanySize[] | undefined;
  employmentTypeOptionsOpenTo: EmploymentTypeEnum[] | undefined;
  workAuthOptionsOpenTo: TWorkAuthOptions[] | undefined;
};

export type TJobSettings = {
  title: string | undefined;
  companyName: string | undefined;
  companyDescription: string | undefined;
  jobOverview: string | undefined;
  address: string | undefined;
  compensation: TJobCompensation | undefined;
  requiredYearsOfExperience: number | undefined;
  img: string | undefined;
  onSiteSchedule: TOnsiteSchedule | undefined;
  relevantSkills: string[] | undefined;
  jobRequirements: string[] | undefined;
  benefits: string[] | undefined;
  referralBonus: number | undefined;
  isPublic: boolean | undefined;
};
