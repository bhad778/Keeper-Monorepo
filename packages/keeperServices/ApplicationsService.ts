import { TAddApplication, TApplicationWithJob, TFindApplicationsByUserId } from './serviceTypes';
import { postRequest } from './serviceUtils';

const ApplicationsService = {
  addApplication: (payload: TAddApplication) => postRequest('addApplication', payload),
  findApplicationsByUserId: (payload: TFindApplicationsByUserId) =>
    postRequest<TApplicationWithJob[]>('findApplicationsByUserId', payload),
};

export default ApplicationsService;
