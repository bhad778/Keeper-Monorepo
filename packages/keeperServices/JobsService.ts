import { TJob, TJobSettings } from 'keeperTypes';
import { postRequest } from './serviceUtils';

const JobsService = {
  getJobsForSwiping: (payload?: any) => postRequest('getJobsForSwiping', payload),
  getJobById: (payload: { jobId: string }) => postRequest('getJobById', payload),
  updateJobSettings: (payload: { jobId: string; updateJobSettingsObject: Partial<TJobSettings> }) =>
    postRequest('updateJobSettings', payload),
  updateJobData: (payload?: { jobId: string; updateObject: Partial<TJob> }) => postRequest('updateJobData', payload),
  getEmployersJobs: (payload: { userId: string }) => postRequest('getEmployersJobs', payload),
  addJob: (payload: { newJobData: TJob }) => postRequest('addJob', payload),
  updateJobPreferences: (payload: any) => postRequest('updateJobPreferences', payload),
  recordJobsSwipes: (payload: any) => postRequest('recordJobsSwipes', payload),
  deleteJob: (payload: { jobId: string }) => postRequest('deleteJob', payload),
  findJob: (payload: any) => postRequest('findJob', payload),
  updateJob: (payload: any) => postRequest('updateJob', payload),
};

export default JobsService;
