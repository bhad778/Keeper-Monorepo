import { QueryOptions, RootFilterQuery } from 'mongoose';
import { OperationEnum, TJob, TCompany } from 'keeperTypes';

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

export type TFindJobPayload = {
  query: RootFilterQuery<TJob>; // Query can include any subset of TCompany fields
  operation?: OperationEnum; // Defaults to 'findOne'
  options?: QueryOptions;
};

export type TUpdateJobPayload = {
  query: RootFilterQuery<TJob>; // Query can include any subset of TCompany fields
  updateData: { [K in keyof TJob]?: TJob[K] };
  operation?: OperationEnum; // Defaults to 'findOne'
  options?: QueryOptions;
};

export type TDeleteJobPayload = {
  query: RootFilterQuery<TJob>; // Query can include any subset of TJob fields
  operation?: OperationEnum; // Defaults to 'deleteOne' if not provided
  options?: QueryOptions;
};
