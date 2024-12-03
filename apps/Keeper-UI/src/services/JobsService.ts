import { TJob, TJobSettings } from 'keeperTypes';
import getEnvVars from '../../environment';

const { apiUrl } = getEnvVars();

const JobsService = {
  // getJobsForSwiping: (payload?: { preferences: TJobPreferences; jobId: string }) => {
  getJobsForSwiping: (payload?: any) => {
    return fetch(`${apiUrl}/getJobsForSwiping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },

  getJobById: (payload: { jobId: string }) => {
    return fetch(`${apiUrl}/getJobById`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },

  updateJobSettings: (payload: { jobId: string; updateJobSettingsObject: Partial<TJobSettings> }) => {
    return fetch(`${apiUrl}/updateJobSettings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },

  updateJobData: (payload?: { jobId: string; updateObject: Partial<TJob> }) => {
    return fetch(`${apiUrl}/updateJobData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },

  getEmployersJobs: (payload: { userId: string }) => {
    return fetch(`${apiUrl}/getEmployersJobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  addJob: (payload: { newJobData: TJob }) => {
    return fetch(`${apiUrl}/addJob`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  deleteJob: (payload: { jobId: string }) => {
    return fetch(`${apiUrl}/deleteJob`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  updateJobPreferences: payload => {
    return fetch(`${apiUrl}/updateJobPreferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        response.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
  recordJobsSwipes: payload => {
    return fetch(`${apiUrl}/recordJobsSwipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
};

export default JobsService;
