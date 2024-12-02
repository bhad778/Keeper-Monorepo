import axios from 'axios';
import { TJob, TJobSettings } from 'types';

const apiUrl = import.meta.env.VITE_API_URL;

const JobsService = {
  getJobsForSwiping: (payload?: any) => {
    return axios
      .post(`${apiUrl}/getJobsForSwiping`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.data);
  },
  getJobById: (payload: { jobId: string }) => {
    return axios
      .post(`${apiUrl}/getJobById`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.data);
  },
  updateJobSettings: (payload: { jobId: string; updateJobSettingsObject: Partial<TJobSettings> }) => {
    return axios
      .post(`${apiUrl}/updateJobSettings`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.data);
  },
  updateJobData: (payload?: { jobId: string; updateObject: Partial<TJob> }) => {
    return axios
      .post(`${apiUrl}/updateJobData`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.data);
  },
  getEmployersJobs: (payload: { userId: string }) => {
    return axios
      .post(`${apiUrl}/getEmployersJobs`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.data);
  },
  addJob: (payload: { newJobData: TJob }) => {
    return axios
      .post(`${apiUrl}/addJob`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.data);
  },
  deleteJob: (payload: { jobId: string }) => {
    return axios
      .post(`${apiUrl}/deleteJob`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.data);
  },
  updateJobPreferences: (payload: any) => {
    return axios
      .post(`${apiUrl}/updateJobPreferences`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.data);
  },
  recordJobsSwipes: (payload: any) => {
    return axios
      .post(`${apiUrl}/recordJobsSwipes`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.data);
  },
};

export default JobsService;
