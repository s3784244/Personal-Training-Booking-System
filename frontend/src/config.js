/**
 * Configuration File
 * 
 * This file contains environment-specific configurations including:
 * - API base URLs for different environments (development vs production)
 * - Authentication tokens
 * - Other environment-specific settings
 * 
 * The BASE_URL automatically switches between local development server
 * and production API based on the NODE_ENV environment variable.
 */

// Base URL for API requests - switches between development and production
export const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://personal-trainer-booking-api.vercel.app/api/v1/' 
  : 'http://localhost:5000/api/v1/';

// Authentication token retrieved from localStorage
// This token is used for authenticated API requests
export const token = localStorage.getItem('token');