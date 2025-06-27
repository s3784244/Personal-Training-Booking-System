/**
 * Date Formatting Utility
 * 
 * Formats dates for consistent display throughout the application.
 * Provides flexible date formatting with customizable options.
 * 
 * DEFAULT FORMAT: "15 Jan 2024" (day month year)
 * CUSTOM FORMAT: Can be overridden with config parameter
 * 
 * @param {Date|string} date - Date to format
 * @param {Object} config - Optional formatting configuration
 * @returns {string} - Formatted date string
 */

export const formatDate = (date, config) => {
  // Default formatting options
  const defaultOptions = {
    day: 'numeric',    // 1, 2, 3, etc.
    month: 'short',    // Jan, Feb, Mar, etc.
    year: 'numeric'    // 2024, 2025, etc.
  };
  
  // Use custom config or default options
  const options = config ? config : defaultOptions;

  // Format date using Australian locale (en-AU)
  return new Date(date).toLocaleDateString('en-AU', options);
}