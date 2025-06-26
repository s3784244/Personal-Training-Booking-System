/**
 * SidePanel Component
 * 
 * This component renders the booking interface on trainer detail pages.
 * It allows clients to:
 * - Select a date for their training session
 * - Choose from available time slots
 * - View booking summary
 * - Complete booking through Stripe payment
 * 
 * Props:
 * - trainerId: ID of the trainer being booked
 * - ticketPrice: Price per training session
 * - timeSlots: Array of available time slots for the trainer
 */

import React, { useContext, useState } from 'react';
import convertTime from '../../utils/convertTime';
import { BASE_URL } from './../../config';
import { toast } from 'react-toastify';
import { authContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SidePanel = ({trainerId, ticketPrice, timeSlots}) => {
  const { role, user, token } = useContext(authContext);
  const navigate = useNavigate();
  
  const [isBooking, setIsBooking] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  // Get available days from trainer's time slots
  const getAvailableDays = () => {
    if (!timeSlots || timeSlots.length === 0) return [];
    
    return timeSlots.map(slot => slot.day?.toLowerCase()).filter(Boolean);
  };

  // Check if a date is available for booking
  const isDateAvailable = (dateString) => {
    const availableDays = getAvailableDays();
    if (availableDays.length === 0) return false;
    
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    return availableDays.includes(dayName);
  };

  // Generate list of available dates for the next 3 months
  const getAvailableDates = () => {
    const availableDays = getAvailableDays();
    if (availableDays.length === 0) return [];

    const dates = [];
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    // Start from tomorrow
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1);

    while (currentDate <= threeMonthsFromNow) {
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      if (availableDays.includes(dayName)) {
        dates.push(new Date(currentDate).toISOString().split('T')[0]);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  // Handle date change with validation
  const handleDateChange = (e) => {
    const selectedDateValue = e.target.value;
    
    if (isDateAvailable(selectedDateValue)) {
      setSelectedDate(selectedDateValue);
      // Reset time slot selection when date changes
      setSelectedTimeSlot(null);
    } else {
      toast.error('This date is not available. Please select a date when the trainer is available.');
      e.target.value = '';
    }
  };

  const bookingHandler = async () => {
    if (isBooking) return;
    
    if (!token) {
      toast.info('Please login to book a session');
      navigate('/login');
      return;
    }

    if (role === 'trainer') {
      toast.error('Trainers cannot book sessions');
      return;
    }

    if (!selectedTimeSlot) {
      toast.error('Please select a time slot');
      return;
    }

    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    setIsBooking(true);

    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${BASE_URL}bookings/checkout-session/${trainerId}`, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timeSlot: selectedTimeSlot,
          bookingDate: selectedDate
        })
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
      setIsBooking(false);
    }
  }

  const safeConvertTime = (time) => {
    if (!time || time === '') return 'Not set';
    try {
      return convertTime(time);
    } catch (error) {
      return 'Invalid time';
    }
  };

  const isTrainer = role === 'trainer';
  const isSameTrainer = user?._id === trainerId;
  const hasNoTimeSlots = !timeSlots || timeSlots.length === 0;
  const availableDates = getAvailableDates();
  
  const shouldDisableButton = isTrainer || isSameTrainer || hasNoTimeSlots || isBooking || !selectedTimeSlot || !selectedDate;

  const getDisableReason = () => {
    if (isBooking) return "Processing booking...";
    if (isTrainer) return "Trainers cannot book sessions";
    if (isSameTrainer) return "You cannot book your own session";
    if (hasNoTimeSlots) return "No available time slots";
    if (!selectedTimeSlot || !selectedDate) return "Please select time slot and date";
    return "";
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
      {/* Price Display Section */}
      <div className="flex items-center justify-between">
        <p className="text__para mt-0 font-semibold">Price</p>
        <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
          ${ticketPrice}
        </span>
      </div>

      {/* Date Selection with Available Days Info */}
      <div className="mt-[30px]">
        <p className="text__para mt-0 font-semibold text-headingColor">Select Date:</p>
        
        {/* Show available days */}
        {getAvailableDays().length > 0 && (
          <div className="mt-1 mb-2">
            <p className="text-xs text-gray-600">
              Available on: {getAvailableDays().map(day => 
                day.charAt(0).toUpperCase() + day.slice(1)
              ).join(', ')}
            </p>
          </div>
        )}

        {/* Use regular date input with validation */}
        <input
          type="date"
          value={selectedDate}
          min={today}
          onChange={handleDateChange}
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primaryColor"
        />

        {/* ALTERNATIVE: datalist*/}
        {/* Uncomment this section and comment the above input if you prefer dropdown */}
{/*         
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primaryColor"
        >
          <option value="">Choose a date...</option>
          {availableDates.map(date => (
            <option key={date} value={date}>
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </option>
          ))}
        </select>
        */}

        {/* Show warning if no available dates */}
        {availableDates.length === 0 && hasNoTimeSlots && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700 text-xs">
              ⚠️ No available dates - trainer has no time slots configured
            </p>
          </div>
        )}
      </div>

      {/* Time Slot Selection Section */}
      <div className="mt-[30px]">
        <p className="text__para mt-0 font-semibold text-headingColor">Available Time Slots:</p>
        <div className="mt-3 space-y-2">
          {timeSlots?.map((item, index) => (
            <div 
              key={index} 
              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                selectedTimeSlot === item 
                  ? 'border-primaryColor bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => setSelectedTimeSlot(item)}
            >
              <div className="flex items-center justify-between">
                <p className="text-[15px] leading-6 text-textColor font-semibold">
                  {safeConvertTime(item.startingTime)} - {safeConvertTime(item.endingTime)}
                </p>
              </div>
              {selectedTimeSlot === item && (
                <div className="mt-1">
                  <span className="text-primaryColor text-sm font-medium">✓ Selected</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {hasNoTimeSlots && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700 text-sm font-medium">
              ⚠️ No time slots available for booking
            </p>
          </div>
        )}
      </div>

      {/* Booking Summary display */}
      {selectedTimeSlot && selectedDate && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700 text-sm font-medium">Booking Summary:</p>
          <p className="text-sm text-green-600">
            Date: {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-sm text-green-600">
            Time: {safeConvertTime(selectedTimeSlot.startingTime)} - {safeConvertTime(selectedTimeSlot.endingTime)}
          </p>
        </div>
      )}

      {/* Booking Button Section */}
      {shouldDisableButton ? (
        <div className="text-center mt-4">
          <p className="text-gray-500 text-sm mb-2">
            {getDisableReason()}
          </p>
          <button 
            disabled 
            className="btn rounded-md w-full opacity-50 cursor-not-allowed"
          >
            Book Session
          </button>
        </div>
      ) : (
        <button onClick={bookingHandler} className="btn px-2 w-full rounded-md mt-4">
          {isBooking ? 'Processing...' : 'Book Session'}
        </button>
      )}
    </div>
  );
};

export default SidePanel;
