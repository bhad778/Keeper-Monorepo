import axios from 'axios';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  errorMessage?: string;
};

// // This helper function gets the environment variable from either Vite or Node.js environment
// function getEnvVariable(name: string): string | undefined {
//   // Check if we're in a Vite environment
//   if (typeof import.meta !== 'undefined' && import.meta.env) {
//     return import.meta.env[name];
//   }
//   // Check if we're in a Node.js environment
//   else if (typeof process !== 'undefined' && process.env) {
//     return process.env[name];
//   }
//   // Fallback if neither is available
//   return undefined;
// }

const apiUrl = process.env.VITE_API_URL;

export const postRequest = <T>(endpoint: string, payload?: any): Promise<ApiResponse<T>> => {
  console.log('apiUrl', apiUrl);
  console.log('endpoint', endpoint);
  return axios
    .post(`${apiUrl}/${endpoint}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.data)
    .catch(error => {
      console.error(
        `Error in postRequest with this endpoint- ${endpoint} and this payload- ${JSON.stringify(
          payload,
        )}, and heres the error- ${error}`,
      );
      throw error;
    });
};

export const getRequest = (url: string, headers: Record<string, string> = {}) => {
  return axios.get(url, { headers }).then(response => response.data);
};
