import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ERROR_MESSAGES } from '@/shared/config/messages';

const getErrorMessage = (error: AxiosError): string => {
  if (error.code === 'ECONNABORTED') return ERROR_MESSAGES.TIMEOUT;

  switch (error.response?.status) {
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 429:
      return ERROR_MESSAGES.TOO_MANY_REQUESTS;
    default:
      return ERROR_MESSAGES.DEFAULT;
  }
};

/**
 * OpenWeather API 전용 Axios 인스턴스
 */
export const weatherClient = axios.create({
  baseURL: import.meta.env.VITE_WEATHER_BASE_URL,
  timeout: 5000, // 5초 이상 응답 없으면 타임아웃
  params: {
    appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
    units: 'metric', // 섭씨 온도를 기본 단위로 설정
    lang: 'kr', // 응답 메시지 한국어 설정
  },
});

/**
 * [Request Interceptor]
 * 요청 직전 공통으로 처리할 로직이 있다면 여기서 정의합니다.
 */
weatherClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 예: 특정 요청에서만 파라미터를 변경하거나 로깅이 필요할 때
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * [Response Interceptor]
 * 에러 발생 시 사용자에게 친절한 메시지를 전달하기 위해 정제합니다.
 */
weatherClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = getErrorMessage(error);

    if (import.meta.env.MODE === 'development') {
      console.error(`[API Error Debug]:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
    return Promise.reject(new Error(message));
  },
);
