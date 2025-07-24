/**
 * API module exports
 */

// Export axios instance
export { default as axiosInstance } from './axiosInstance';
export { handleApiError } from './errorHandler';

// Export other API modules as needed
export * from './fetchers'; 
export * from './facility/facilityApi';