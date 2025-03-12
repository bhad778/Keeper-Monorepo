import { QueryOptions, RootFilterQuery } from 'mongoose';
import { OperationEnum, TJob, TCompany, TEmployeePreferences, TResumeData } from 'keeperTypes';

export type TAddApplication = {
  employeeId: string;
  jobId: string;
};

export type TGetResumePayload = {
  employeeId: string;
};

export type TUploadResumePayload = {
  employeeId: string;
  fileName: string;
  fileData: string;
  mimeType: string;
};

export type TGetJobsForSwipingPayload = {
  userId?: string; // ID of the user making the request
  preferences?: TEmployeePreferences; // User's preferences for job search
  isCount?: boolean; // Whether to return only the count of jobs
  isPing?: boolean; // Whether the request is a ping check
};

export type TUpdateEmployeePreferencesPayload = {
  userId: string;
  preferencesObject: TEmployeePreferences;
};

export type TFindApplicationsByUserId = {
  employeeId: string;
};

export type TApplicationWithJob = {
  _id: string;
  employeeId: string;
  jobId: TJob; // Use TJob here since you already have it
  createdAt: string;
  __v: number;
};

export type TFindCompanyPayload = {
  query: RootFilterQuery<TCompany>; // Query can include any subset of TCompany fields
  operation?: OperationEnum; // Defaults to 'findOne'
  options?: QueryOptions;
};

export type TUpdateCompanyPayload = {
  query: RootFilterQuery<TCompany>; // Can contain any subset of TCompany fields
  updateData: { [K in keyof TCompany]?: TCompany[K] };
  operation?: OperationEnum; // Optional, defaults to undefined
  options?: QueryOptions;
};

export type TAddJobPayload = {
  jobs: TJob[]; // Always an array of TJob, even for single job addition
};

export type TFindJobPayload = {
  query: RootFilterQuery<TJob>; // Query can include any subset of TJob fields
  operation?: OperationEnum; // Defaults to 'findOne'
  options?: QueryOptions;
};

export type TUpdateJobPayload = {
  query: RootFilterQuery<TJob>; // Query can include any subset of TJob fields
  updateData: { [K in keyof TJob]?: TJob[K] };
  operation?: OperationEnum; // Defaults to 'findOne'
  options?: QueryOptions;
};

export type TDeleteJobPayload = {
  query: RootFilterQuery<TJob>; // Query can include any subset of TJob fields
  operation?: OperationEnum; // Defaults to 'deleteOne' if not provided
  options?: QueryOptions;
};
