import { TJob } from 'keeperTypes';

import { TAddApplication, TFindApplicationsByUserId } from './serviceTypes';
import { postRequest } from './serviceUtils';

const ApplicationsService = {
  addApplication: (payload: TAddApplication) => postRequest('addApplication', payload),
  findApplicationsByUserId: (payload: TFindApplicationsByUserId) =>
    postRequest<TJob[]>('findApplicationsByUserId', payload),
};

export default ApplicationsService;
