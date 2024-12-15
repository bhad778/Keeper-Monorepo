import { TCompany } from 'apps/Keeper-API/models/Company';
import { QueryOptions } from 'mongoose';

export type FindCompanyPayload = {
  query: Partial<TCompany>; // Query can include any subset of TCompany fields
  operation?: 'findOne' | 'find'; // Defaults to 'findOne'
  options?: QueryOptions;
};

export type UpdateCompanyPayload = {
  query: Partial<TCompany>; // Can contain any subset of TCompany fields
  updateData: Partial<TCompany>; // Can contain any subset of TCompany fields
  operation?: 'updateOne' | 'updateMany'; // Optional, defaults to undefined
};
