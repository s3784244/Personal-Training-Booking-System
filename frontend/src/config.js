export const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://personal-trainer-booking-api.vercel.app/api/v1/' 
  : 'http://localhost:5000/api/v1/';

export const token = localStorage.getItem('token');