import {
  TMatch,
  TGeoLocation,
  EmploymentTypes,
  TOnsiteSchedule,
  TFrontendBackendOptions,
  TCompanySize,
  TWorkAuthOptions,
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

export type TJob = {
  _id?: string;
  expoPushToken: string | null;
  ownerId: string;
  ownerEmail: string;
  createdAt: Date;
  lastUpdatedOnWeb: boolean;
  matches: TMatch[];
  color: string;
  geoLocation: TGeoLocation;
  settings: TJobSettings;
  preferences: TJobPreferences;
  receivedLikes: string[];
  publicJobTakenCount: number;
  publicTakers: string[];
};

export type TBenefitOptions = 'None' | 'Dental' | 'Vision' | 'Health Care' | '401k';

export type TEmployerFilterListOptions =
  | 'Experience'
  | 'Skills'
  | 'Company Size'
  | 'Frontend/Backend'
  | 'Work Auth'
  | 'Salary/Contract';

export type TJobCompensation = {
  type: EmploymentTypes;
  payRange?: TCompensationRange;
  salaryConversionRange?: TCompensationRange;
};

export type TCompensationRange = {
  min: number;
  max: number;
};

// export type TLocation = {
//   address: string;
//   geoLocation: TGeoLocation;
// };

export type TJobPreferences = {
  searchRadius: number | undefined;
  yearsOfExperience: number | undefined;
  relevantSkills: Array<string> | undefined;
  geoLocation: TGeoLocation | undefined;
  isRemote: boolean | undefined;
  frontendBackendOptionsOpenTo: TFrontendBackendOptions[] | undefined;
  companySizeOptionsOpenTo: TCompanySize[] | undefined;
  employmentTypeOptionsOpenTo: EmploymentTypes[] | undefined;
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
