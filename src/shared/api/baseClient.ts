import axios, { type AxiosError, type CreateAxiosDefaults } from 'axios';

import { ERROR_MESSAGES } from '@/shared/constants/constants';

export const createBaseClient = (config?: CreateAxiosDefaults) => {
  const instance = axios.create({
    timeout: CONSTANTS.TIMEOUT,
    ...config,
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const message = formatErrorMessage(error);

      if (import.meta.env.MODE === 'development') {
        console.error(`[API Error Debug]:`, {
          url: error.config?.url,
          status: error.response?.status,
          message,
        });
      }

      return Promise.reject(new Error(message));
    },
  );

  return instance;
};

const CONSTANTS = {
  TIMEOUT: 1000 * 5, // 5초
} as const;

const formatErrorMessage = (error: AxiosError): string => {
  if (error.code === 'ECONNABORTED' || !error.response) {
    return ERROR_MESSAGES.API.TIMEOUT;
  }

  const status = error.response.status;

  switch (status) {
    case 401:
      return ERROR_MESSAGES.API.UNAUTHORIZED;
    case 404:
      return ERROR_MESSAGES.API.NOT_FOUND;
    case 429:
      return ERROR_MESSAGES.API.TOO_MANY_REQUESTS;
    default:
      return ERROR_MESSAGES.API.DEFAULT;
  }
};
