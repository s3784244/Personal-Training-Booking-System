/**
 * Time Conversion Utility
 * 
 * Converts time from 24-hour format to 12-hour format with AM/PM.
 * Used throughout the application for displaying user-friendly time formats.
 * 
 * EXAMPLES:
 * - "14:30" becomes "2:30 PM"
 * - "09:00" becomes "9:00 AM"
 * - "00:00" becomes "12:00 AM"
 * 
 * @param {string} time - Time in 24-hour format (HH:MM)
 * @returns {string} - Time in 12-hour format with AM/PM
 */

const convertTime = (time) => {
  // Handle empty or null values
  if (!time || time === '') {
    return 'Not set';
  }

  // If it's already in the correct format or if it's invalid, return as is or handle error
  try {
    // Split time string into hours and minutes
    const timeParts = time.split(':');
    if (timeParts.length !== 2) {
      return 'Invalid time';
    }

    let hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];

    if (isNaN(hours)) {
      return 'Invalid time';
    }

    // Determine AM or PM
    const period = hours >= 12 ? 'pm' : 'am';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours = 12 AM)
  
    // Format final time string
    const formattedTime = hours + ':' + minutes + ' ' + period;
  
    return formattedTime;
  } catch (error) {
    return 'Invalid time';
  }
};

export default convertTime;
