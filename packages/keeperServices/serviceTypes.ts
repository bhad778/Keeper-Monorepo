import { TCompany } from 'apps/Keeper-API/models/Company';
import { QueryOptions, RootFilterQuery } from 'mongoose';
import { TJob } from 'packages/keeperTypes';

export type TFindCompanyPayload = {
  query: RootFilterQuery<TCompany>; // Query can include any subset of TCompany fields
  operation?: 'findOne' | 'find'; // Defaults to 'findOne'
  options?: QueryOptions;
};

export type TUpdateCompanyPayload = {
  query: RootFilterQuery<TCompany>; // Can contain any subset of TCompany fields
  updateData: Partial<TCompany>; // Can contain any subset of TCompany fields
  operation?: 'updateOne' | 'updateMany'; // Optional, defaults to undefined
};

export type TFindJobPayload = {
  query: RootFilterQuery<TJob>; // Query can include any subset of TCompany fields
  operation?: 'findOne' | 'find'; // Defaults to 'findOne'
  options?: QueryOptions;
};

export type TUpdateJobPayload = {
  query: RootFilterQuery<TJob>; // Query can include any subset of TCompany fields
  operation?: 'updateOne' | 'updateMany'; // Defaults to 'findOne'
};

export type TDeleteJobPayload = {
  query: RootFilterQuery<TJob>; // Query can include any subset of TJob fields
  operation?: 'deleteOne' | 'deleteMany'; // Defaults to 'deleteOne' if not provided
};
