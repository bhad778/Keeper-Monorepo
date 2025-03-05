import * as Joi from 'joi';

export const JobAlreadySwipedOnSchema = Joi.object({
  jobId: Joi.string().required(),
  isRightSwipe: Joi.boolean().required(),
});

export const GeoLocationSchema = Joi.object({
  type: Joi.string().required(),
  coordinates: Joi.array().items(Joi.number()).required(),
});

export const CompensationRangeSchema = Joi.object({
  min: Joi.number(),
  max: Joi.number(),
});

export const AccountTypeSchema = Joi.any().valid('employee', 'employer');

export const TMatchSchema = Joi.object({
  name: Joi.string().required(),
  custom: Joi.object({
    profileUrl: Joi.string().required(),
    hasNotification: Joi.boolean().required(),
    expoPushToken: Joi.string().allow('').required(),
    isNew: Joi.boolean().required(),
    jobId: Joi.string(),
    jobOwnerId: Joi.string(),
    jobOwnerEmail: Joi.string(),
    jobColor: Joi.string(),
    jobTitle: Joi.string(),
    jobImg: Joi.string(),
    companyName: Joi.string(),
    employeeId: Joi.string().allow(''),
    employeeColor: Joi.string().allow(''),
    employeeEmail: Joi.string().allow(''),
  }).required(),
  description: Joi.string().required(),
  eTag: Joi.string().allow('').required(),
  id: Joi.string().required(),
  updated: Joi.date().required(),
});

export const PubnubNotificationMessageObjectSchema = Joi.object({
  // 'to' here is actually expoPushToken, not to be confused with
  // receiverId which is loggedInUserId of receiver
  to: Joi.string().allow('').required(),
  title: Joi.string().required(),
  body: Joi.string().required(),
  sound: Joi.string().required(),
  data: Joi.object({
    type: Joi.string().valid('match', 'message', 'like').required(),
    senderId: Joi.string().required(),
    receiverId: Joi.string().required(),
    jobId: Joi.string().allow(''),
    matchData: TMatchSchema,
    message: Joi.any(),
  }),
});

export const TUpdateMatchSchema = Joi.object({
  name: Joi.string(),
  custom: Joi.object({
    profileUrl: Joi.string(),
    hasNotification: Joi.boolean(),
    expoPushToken: Joi.string(),
    isNew: Joi.boolean(),
    jobId: Joi.string(),
    jobOwnerId: Joi.string(),
    jobOwnerEmail: Joi.string(),
    jobColor: Joi.string(),
    jobTitle: Joi.string(),
    jobImg: Joi.string(),
    companyName: Joi.string(),
    employeeId: Joi.string().allow(''),
    employeeColor: Joi.string().allow(''),
    employeeEmail: Joi.string().allow(''),
  }),
  description: Joi.string(),
  eTag: Joi.string().allow(''),
  id: Joi.string(),
  updated: Joi.date(),
});

export const JobCompensationSchema = Joi.object({
  type: Joi.string().required(),
  payRange: CompensationRangeSchema,
  salaryConversionRange: CompensationRangeSchema,
});

export const JobPreferencesSchema = Joi.object({
  searchRadius: Joi.number().required(),
  yearsOfExperience: Joi.number().required(),
  relevantSkills: Joi.array().items(Joi.string()).required(),
  geoLocation: GeoLocationSchema.required(),
  isRemote: Joi.boolean().required(),
  frontendBackendOptionsOpenTo: Joi.array().items(Joi.string()).required(),
  companySizeOptionsOpenTo: Joi.array().items(Joi.string()).required(),
  employmentTypeOptionsOpenTo: Joi.array().items(Joi.string()).required(),
  workAuthOptionsOpenTo: Joi.array().items(Joi.string()).required(),
});

export const EmployeePreferencesSchema = Joi.object({
  searchRadius: Joi.number(),
  requiredYearsOfExperience: Joi.number(),
  locationFlexibility: Joi.array().items(Joi.string()),
  seniorityLevel: Joi.array().items(Joi.string()),
  geoLocation: GeoLocationSchema,
  relevantSkills: Joi.array().items(Joi.string()),
  isRemote: Joi.boolean(),
  isNew: Joi.boolean(),
});

export const JobSettingsSchema = Joi.object({
  title: Joi.string().required(),
  companyName: Joi.string().required(),
  companyDescription: Joi.string().required(),
  jobOverview: Joi.string().required(),
  address: Joi.string().required(),
  compensation: Joi.any().required(),
  img: Joi.string().required(),
  onSiteSchedule: Joi.string().valid('Remote', 'Hybrid', 'Office').required(),
  relevantSkills: Joi.array().items(Joi.string()).required(),
  requiredYearsOfExperience: Joi.number().required(),
  jobRequirements: Joi.array().items(Joi.string()).required(),
  benefits: Joi.array().items(Joi.string()).required(),
  referralBonus: Joi.number().required(),
  isPublic: Joi.boolean().required(),
});

export const JobSchema = Joi.object({
  geoLocation: GeoLocationSchema,
  createdAt: Joi.date().required(),
  lastUpdatedOnWeb: Joi.boolean().required(),
  expoPushToken: Joi.string().allow(''),
  matches: Joi.array().items(TMatchSchema).required(),
  ownerId: Joi.string().required(),
  ownerEmail: Joi.string().required(),
  settings: JobSettingsSchema.required(),
  preferences: JobPreferencesSchema.required(),
  color: Joi.string().required(),
  receivedLikes: Joi.array().items(Joi.string()).required(),
  publicJobTakenCount: Joi.number(),
  publicTakers: Joi.array().items(Joi.string()),
});
