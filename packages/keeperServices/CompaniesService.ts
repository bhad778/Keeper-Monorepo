import { postRequest } from './serviceUtils';

const CompaniesService = {
  findCompany: (payload?: any) => postRequest('findCompany', payload),
  updateCompany: (payload?: any) => postRequest('updateCompany', payload),
};

export default CompaniesService;
