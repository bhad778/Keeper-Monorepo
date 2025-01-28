import axios from 'axios';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  errorMessage?: string;
};

// const apiUrl = process.env.VITE_API_URL;
const apiUrl = 'https://mzl4y00fba.execute-api.us-east-1.amazonaws.com/dev';

export const postRequest = <T>(endpoint: string, payload?: any): Promise<ApiResponse<T>> => {
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
