import { TFindCompanyPayload, TUpdateCompanyPayload } from './serviceTypes';
import { postRequest } from './serviceUtils';

const CompaniesService = {
  findCompany: (payload: TFindCompanyPayload) => postRequest('findCompany', payload),
  updateCompany: (payload: TUpdateCompanyPayload) => postRequest('updateCompany', payload),
};

export default CompaniesService;
