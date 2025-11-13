import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const useAuthenticatedFetch = () => {
  const { token, logout } = useAuth();

  const authenticatedFetch = useCallback(async (url: string, options: FetchOptions = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add JWT token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Fallback to API key if no token (for backwards compatibility)
    const API_KEY = import.meta.env.VITE_API_KEY as string | undefined;
    if (!token && API_KEY) {
      headers['x-api-key'] = API_KEY;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle token expiration
      if (response.status === 401 && token) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }

      return response;
    } catch (error) {
      throw error;
    }
  }, [token, logout]);

  return authenticatedFetch;
};
