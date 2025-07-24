import { STORAGE_KEYS } from '../constants';
import { User } from '../../../types/user';

/**
 * Utility functions for handling auth-related storage
 */

/**
 * Save authentication token to session storage
 */
export const saveAuthToken = (token: string | object): void => {
  sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, JSON.stringify(token));
};

/**
 * Get authentication token from session storage
 */
export const getAuthToken = (): string | null => {
  const token = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (!token) return null;
  
  try {
    return JSON.parse(token);
  } catch (error) {
    console.error('Error parsing auth token:', error);
    return null;
  }
};

/**
 * Remove authentication token from session storage
 */
export const removeAuthToken = (): void => {
  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Save user data to session storage
 */
export const saveUser = (user: User): void => {
  sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * Get user data from session storage
 */
export const getUser = (): User | null => {
  const user = sessionStorage.getItem(STORAGE_KEYS.USER);
  if (!user) return null;
  
  try {
    return JSON.parse(user);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Remove user data from session storage
 */
export const removeUser = (): void => {
  sessionStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Clear all auth-related data from storage
 */
export const clearAuthData = (): void => {
  removeAuthToken();
  removeUser();
}; 