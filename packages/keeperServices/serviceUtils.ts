import axios from 'axios';
import { apiUrl } from 'keeperEnvironment';

type ApiResponse<T> = {
  success: boolean;
  result: T;
};

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
        `Error in postRequest with this endpoint- ${endpoint} and this payload- ${payload}, and heres the error- ${error}`,
      );
      throw error;
    });
};

export const getRequest = (url: string, headers: Record<string, string> = {}) => {
  return axios.get(url, { headers }).then(response => response.data);
};
