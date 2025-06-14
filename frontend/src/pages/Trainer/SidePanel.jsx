import React, { useContext, useState } from 'react';
import convertTime from '../../utils/convertTime';
import { BASE_URL } from './../../config';
import { toast } from 'react-toastify';
import { authContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SidePanel = ({trainerId, ticketPrice, timeSlots}) => {
  const { role, user, token } = useContext(authContext);
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false); // Add loading state
  
  const bookingHandler = async () => {
    if (isBooking) return; // Prevent multiple clicks
    
    if (!token) {
      toast.info('Please login to book a session');
      navigate('/login');
      return;
    }

    if (role === 'trainer') {
      toast.error('Trainers cannot book sessions');
      return;
    }

    setIsBooking(true); // Set loading state

    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${BASE_URL}bookings/checkout-session/${trainerId}`, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
  
      const data = await res.json()
  
      if (!res.ok) {
        throw new Error(data.message + ' Please try again')
      }
  
      if (data.session?.url) {
        window.location.href = data.session.url
      }
    } catch (err) {
      toast.error(err.message)
      setIsBooking(false); // Reset loading state on error
    }
  }

  // Helper function to safely convert time
  const safeConvertTime = (time) => {
    if (!time || time === '') return 'Not set';
    try {
      return convertTime(time);
    } catch (error) {
      return 'Invalid time';
    }
  };

  // Enhanced validation logic
  const isTrainer = role === 'trainer';
  const isSameTrainer = user?._id === trainerId;
  const hasNoTimeSlots = !timeSlots || timeSlots.length === 0;
  const shouldDisableButton = isTrainer || isSameTrainer || hasNoTimeSlots || isBooking;

  // Helper function to get the disable reason
  const getDisableReason = () => {
    if (isBooking) return "Processing booking...";
    if (isTrainer) return "Trainers cannot book sessions";
    if (isSameTrainer) return "You cannot book your own session";
    if (hasNoTimeSlots) return "No available time slots";
    return "";
  };
  
  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
      <div className="flex items-center justify-between">
        <p className="text__para mt-0 font-semibold">Price</p>
        <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
          ${ticketPrice}
        </span>
      </div>

      <div className="mt-[30px]">
        <p className="text__para mt-0 font-semibold text-headingColor">Available Time Slots:</p>
        <ul className="mt-3">
          {timeSlots?.map((item, index) => (
            <li key={index} className="flex items-center justify-between mb-2">
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                {item.day ? item.day.charAt(0).toUpperCase() + item.day.slice(1) : 'Not set'}
              </p>
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                {safeConvertTime(item.startingTime)} - {safeConvertTime(item.endingTime)}
              </p>
            </li>
          ))}
        </ul>
        {hasNoTimeSlots && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700 text-sm font-medium">
              ⚠️ No time slots available for booking
            </p>
          </div>
        )}
      </div>

      {/* Enhanced conditional button rendering */}
      {shouldDisableButton ? (
        <div className="text-center mt-4">
          <p className="text-gray-500 text-sm mb-2">
            {getDisableReason()}
          </p>
          <button 
            disabled 
            className="btn mx-2 w-full rounded-md bg-gray-400 cursor-not-allowed opacity-50"
          >
            {isBooking ? 'Processing...' : 'Book Session'}
          </button>
        </div>
      ) : (
        <button 
          onClick={bookingHandler} 
          className='btn mx-2 w-full rounded-md hover:bg-blue-600 transition-colors'
          disabled={isBooking}
        >
          {isBooking ? 'Processing...' : 'Book Session'}
        </button>
      )}
    </div>
  );
};

export default SidePanel;
