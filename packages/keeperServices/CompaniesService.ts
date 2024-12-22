import { TCompany } from 'keeperTypes';
import { UpdateWriteOpResult } from 'mongoose';

import { TFindCompanyPayload, TUpdateCompanyPayload } from './serviceTypes';
import { postRequest } from './serviceUtils';

const CompaniesService = {
  findCompany: (payload: TFindCompanyPayload) => postRequest<TCompany | null>('findCompany', payload),
  updateCompany: (payload: TUpdateCompanyPayload) =>
    postRequest<UpdateWriteOpResult | TCompany | null>('updateCompany', payload),
};

export default CompaniesService;
