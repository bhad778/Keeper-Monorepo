import { TCompany } from 'apps/Keeper-API/models/Company';
import { QueryOptions } from 'mongoose';
import { TJob } from 'packages/keeperTypes';

export type FindCompanyPayload = {
  query: Partial<Record<keyof TJob, TJob[keyof TJob]>>; // Query can include any subset of TCompany fields
  operation?: 'findOne' | 'find'; // Defaults to 'findOne'
  options?: QueryOptions;
};

export type UpdateCompanyPayload = {
  query: Partial<Record<keyof TJob, TJob[keyof TJob]>>; // Can contain any subset of TCompany fields
  updateData: Partial<TCompany>; // Can contain any subset of TCompany fields
  operation?: 'updateOne' | 'updateMany'; // Optional, defaults to undefined
};

export type FindJobPayload = {
  query: Partial<Record<keyof TJob, TJob[keyof TJob]>>; // Query can include any subset of TCompany fields
  operation?: 'findOne' | 'find'; // Defaults to 'findOne'
  options?: QueryOptions;
};

export type UpdateJobPayload = {
  query: Partial<Record<keyof TJob, TJob[keyof TJob]>>; // Query can include any subset of TCompany fields
  operation?: 'updateOne' | 'updateMany'; // Defaults to 'findOne'
};

export type DeleteJobPayload = {
  query: Partial<Record<keyof TJob, TJob[keyof TJob]>>; // Query can include any subset of TJob fields
  operation?: 'deleteOne' | 'deleteMany'; // Defaults to 'deleteOne' if not provided
};
