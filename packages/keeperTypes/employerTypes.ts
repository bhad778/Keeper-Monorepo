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

// job in our database
export type TJob = {
  expoPushToken?: string | null;
  requiredYearsOfExperience: number;
  relevantSkills: string[];
  createdAt: Date;
  receivedLikes: string[];
  matches: TMatch[];
  geoLocation?: TGeoLocation;
  hasGottenToEditProfileScreen?: boolean;
  hasReceivedLikeNotification?: boolean;
  compensation: TJobCompensation | null;
  sourceWebsite: JobSourceWebsiteEnum;

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
  payRange?: TCompensationRange;
  salaryConversionRange?: TCompensationRange;
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
