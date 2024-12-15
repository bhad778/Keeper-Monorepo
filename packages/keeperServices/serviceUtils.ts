import axios from 'axios';
import { apiUrl } from 'keeperEnvironment';

export const postRequest = (endpoint: string, payload?: any) => {
  return axios
    .post(`${apiUrl}/${endpoint}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.data);
};

export const getRequest = (url: string, headers: Record<string, string> = {}) => {
  return axios.get(url, { headers }).then(response => response.data);
};
