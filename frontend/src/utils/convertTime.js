const convertTime = (time) => {
  // Handle empty or null values
  if (!time || time === '') {
    return 'Not set';
  }

  // If it's already in the correct format or if it's invalid, return as is or handle error
  try {
    const timeParts = time.split(':');
    if (timeParts.length !== 2) {
      return 'Invalid time';
    }

    let hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];

    if (isNaN(hours)) {
      return 'Invalid time';
    }

    const period = hours >= 12 ? 'pm' : 'am';
    
    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours = hours - 12;
    }

    return `${hours}:${minutes} ${period}`;
  } catch (error) {
    return 'Invalid time';
  }
};

export default convertTime;
