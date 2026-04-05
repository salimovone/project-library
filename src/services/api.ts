import axios, {
  AxiosHeaders,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

type ApiErrorValue = string | string[] | undefined;

export interface ApiErrorPayload {
  detail?: string;
  message?: string;
  [key: string]: ApiErrorValue;
}

interface RefreshTokenResponse {
  access: string;
  refresh?: string;
}

interface FailedQueueEntry {
  reject: (error: ApiErrorPayload) => void;
  resolve: (token: string) => void;
}

interface RetryableRequestConfig<Data = unknown>
  extends InternalAxiosRequestConfig<Data> {
  _retry?: boolean;
}

const rawApiBaseUrl = import.meta.env.VITE_API_BASE;

export const API_BASE_URL = rawApiBaseUrl.endsWith('/')
  ? rawApiBaseUrl.slice(0, -1)
  : rawApiBaseUrl;

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: 'application/json' },
});

let isRefreshing = false;
let failedQueue: FailedQueueEntry[] = [];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(
    (entry) =>
      typeof entry === 'string' ||
      entry === undefined ||
      (Array.isArray(entry) && entry.every((item) => typeof item === 'string')),
  );
}

export function toApiErrorPayload(
  error: unknown,
  fallbackMessage = 'Network Error',
): ApiErrorPayload {
  if (isApiErrorPayload(error)) {
    return error;
  }

  if (error instanceof Error && error.message) {
    return { message: error.message };
  }

  return { message: fallbackMessage };
}

export function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  const payload = toApiErrorPayload(error, fallbackMessage);

  if (payload.detail) {
    return payload.detail;
  }

  if (payload.message) {
    return payload.message;
  }

  const firstValue = Object.values(payload)[0];

  if (typeof firstValue === 'string') {
    return firstValue;
  }

  if (Array.isArray(firstValue)) {
    return firstValue[0] ?? fallbackMessage;
  }

  return fallbackMessage;
}

function processQueue(error: ApiErrorPayload | null, token?: string): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }

    if (token) {
      resolve(token);
    }
  });

  failedQueue = [];
}

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');

    if (token) {
      const headers = AxiosHeaders.from(config.headers);
      headers.set('Authorization', `Bearer ${token}`);
      config.headers = headers;
    }

    return config;
  },
  (error: unknown) => Promise.reject(toApiErrorPayload(error)),
);

client.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(toApiErrorPayload(error));
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject: (queueError) => reject(queueError),
          });
        }).then((token) => {
          const headers = AxiosHeaders.from(originalRequest.headers);
          headers.set('Authorization', `Bearer ${token}`);
          originalRequest.headers = headers;
          return client.request(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh');

      if (!refreshToken) {
        const refreshError = toApiErrorPayload(null, 'No refresh token available.');
        processQueue(refreshError);
        localStorage.clear();
        return Promise.reject(refreshError);
      }

      try {
        const response = await axios.post<RefreshTokenResponse>(
          `${API_BASE_URL}/token/refresh/`,
          { refresh: refreshToken },
          { headers: { Accept: 'application/json' } },
        );

        const { access, refresh } = response.data;
        localStorage.setItem('access', access);

        if (refresh) {
          localStorage.setItem('refresh', refresh);
        }

        const headers = AxiosHeaders.from(originalRequest.headers);
        headers.set('Authorization', `Bearer ${access}`);
        originalRequest.headers = headers;

        processQueue(null, access);

        return client.request(originalRequest);
      } catch (refreshError) {
        const normalizedRefreshError = axios.isAxiosError(refreshError)
          ? toApiErrorPayload(
              refreshError.response?.data,
              refreshError.message || 'Session refresh failed.',
            )
          : toApiErrorPayload(refreshError, 'Session refresh failed.');

        processQueue(normalizedRefreshError);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(normalizedRefreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(
      toApiErrorPayload(error.response?.data, error.message || 'Network Error'),
    );
  },
);

export interface ApiClient {
  delete<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse>;
  get<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse>;
  patch<TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig<TRequest>,
  ): Promise<TResponse>;
  post<TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig<TRequest>,
  ): Promise<TResponse>;
  put<TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig<TRequest>,
  ): Promise<TResponse>;
  request<TResponse, TRequest = unknown>(
    config: AxiosRequestConfig<TRequest>,
  ): Promise<TResponse>;
}

async function request<TResponse, TRequest = unknown>(
  config: AxiosRequestConfig<TRequest>,
): Promise<TResponse> {
  const response = await client.request<TResponse, { data: TResponse }, TRequest>(
    config,
  );
  return response.data;
}

const api: ApiClient = {
  delete: async <TResponse>(url: string, config?: AxiosRequestConfig) => {
    const response = await client.delete<TResponse>(url, config);
    return response.data;
  },
  get: async <TResponse>(url: string, config?: AxiosRequestConfig) => {
    const response = await client.get<TResponse>(url, config);
    return response.data;
  },
  patch: async <TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig<TRequest>,
  ) => {
    const response = await client.patch<TResponse>(url, data, config);
    return response.data;
  },
  post: async <TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig<TRequest>,
  ) => {
    const response = await client.post<TResponse>(url, data, config);
    return response.data;
  },
  put: async <TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig<TRequest>,
  ) => {
    const response = await client.put<TResponse>(url, data, config);
    return response.data;
  },
  request,
};

export default api;