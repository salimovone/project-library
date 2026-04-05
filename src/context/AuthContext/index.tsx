import { createContext, useState, type ReactNode } from 'react';
import { API_BASE_URL, getErrorMessage } from '../../services/api';

interface AuthContextValue {
  error: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (
    username: string,
    password: string,
    callback?: () => void,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface LoginResponse {
  access: string;
  refresh: string;
}

interface ErrorResponseShape {
  detail?: string;
  message?: string;
  [key: string]: string | string[] | undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isLoginResponse(value: unknown): value is LoginResponse {
  return (
    isRecord(value) &&
    typeof value.access === 'string' &&
    typeof value.refresh === 'string'
  );
}

function isErrorResponseShape(value: unknown): value is ErrorResponseShape {
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

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type');

  if (!contentType || !contentType.includes('application/json')) {
    return null;
  }

  try {
    const body: unknown = await response.json();
    return body;
  } catch {
    return null;
  }
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('access') !== null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (
    username: string,
    password: string,
    callback?: () => void,
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const payload = await parseResponseBody(response);

      if (!response.ok) {
        throw isErrorResponseShape(payload)
          ? payload
          : { message: 'Tizimga kirishda xatolik yuz berdi.' };
      }

      if (!isLoginResponse(payload)) {
        throw new Error('Server login javobi kutilgan formatda emas.');
      }

      localStorage.setItem('access', payload.access);
      localStorage.setItem('refresh', payload.refresh);

      setIsAuthenticated(true);

      if (callback) {
        callback();
      }
    } catch (caughtError: unknown) {
      setError(
        getErrorMessage(
          caughtError,
          'Tizimga kirishda xatolik yuz berdi. Login yoki parolni tekshiring.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('refresh');
      const accessToken = localStorage.getItem('access');

      if (refreshToken) {
        await fetch(`${API_BASE_URL}/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      }
    } catch (caughtError: unknown) {
      console.error('Logout xatoligi:', caughtError);
    } finally {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{ error, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}