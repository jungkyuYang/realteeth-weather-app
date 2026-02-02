import axios, { type AxiosError, type CreateAxiosDefaults } from 'axios';

import { ERROR_MESSAGES } from '@/shared/constants/constants';

const FIVE_SECONDS = 1000 * 5;

export const createBaseClient = (config?: CreateAxiosDefaults) => {
  const instance = axios.create({
    timeout: FIVE_SECONDS,
    ...config,
  });

  const getErrorMessage = (error: AxiosError): string => {
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

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const message = getErrorMessage(error);

      if (import.meta.env.MODE === 'development') {
        console.error(`[API Error Debug]:`, {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data,
        });
      }

      //  여기서 Error 객체에 원본 status 등을 담아 던지면
      // 나중에 UI에서 상태 코드별로 다른 처리를 하고 싶을 때 유리합니다.
      return Promise.reject(new Error(message));
    },
  );

  return instance;
};
