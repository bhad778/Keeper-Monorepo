import { TJob, TJobSettings } from 'keeperTypes';
import { UpdateWriteOpResult } from 'mongoose';

import { postRequest } from './serviceUtils';
import {
  TAddJobPayload,
  TDeleteJobPayload,
  TFindJobPayload,
  TGetJobsForSwipingPayload,
  TUpdateJobPayload,
} from './serviceTypes';

const JobsService = {
  getJobsForSwiping: (payload?: TGetJobsForSwipingPayload) => postRequest<TJob[]>('getJobsForSwiping', payload),
  getJobById: (payload: { jobId: string }) => postRequest('getJobById', payload),
  updateJobSettings: (payload: { jobId: string; updateJobSettingsObject: Partial<TJobSettings> }) =>
    postRequest('updateJobSettings', payload),
  updateJobData: (payload?: { jobId: string; updateObject: Partial<TJob> }) => postRequest('updateJobData', payload),
  getEmployersJobs: (payload: { userId: string }) => postRequest('getEmployersJobs', payload),
  updateJobPreferences: (payload: any) => postRequest('updateJobPreferences', payload),
  recordJobsSwipes: (payload: any) => postRequest('recordJobsSwipes', payload),
  addJob: (payload: TAddJobPayload) => postRequest('addJob', payload),
  deleteJob: (payload: TDeleteJobPayload) => postRequest('deleteJob', payload),
  findJob: (payload: TFindJobPayload) => postRequest<TJob | null>('findJob', payload),
  updateJob: (payload: TUpdateJobPayload) => postRequest<UpdateWriteOpResult | TJob | null>('updateJob', payload),
};

export default JobsService;
