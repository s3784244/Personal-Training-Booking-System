/**
 * Trainer Booking Side Panel Component
 * 
 * This component handles the complete booking flow for personal training sessions:
 * 
 * FEATURES:
 * - Date selection with trainer availability validation
 * - Time slot selection based on trainer's schedule
 * - Booking summary with selected details
 * - Integration with Stripe for payment processing
 * - User authentication and authorization checks
 * 
 * PROPS:
 * - trainerId: Unique identifier for the trainer being booked
 * - ticketPrice: Cost per training session
 * - timeSlots: Array of available time slots with days and times
 * 
 * BUSINESS LOGIC:
 * - Only allows booking on days when trainer is available
 * - Prevents trainers from booking their own sessions
 * - Requires user authentication before booking
 * - Validates date and time slot selection before payment
 */

import React, { useContext, useState } from 'react';
import convertTime from '../../utils/convertTime';
import { BASE_URL } from './../../config';
import { toast } from 'react-toastify';
import { authContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SidePanel = ({trainerId, ticketPrice, timeSlots}) => {
  // Authentication context for user state and permissions
  const { role, user, token } = useContext(authContext);
  const navigate = useNavigate();
  
  // Component state management
  const [isBooking, setIsBooking] = useState(false);           // Booking process state
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // Selected time slot
  const [selectedDate, setSelectedDate] = useState('');           // Selected booking date

  /**
   * Extract Available Days from Trainer's Schedule
   * 
   * Processes the trainer's time slots to determine which days
   * of the week they are available for bookings.
   * 
   * @returns {Array} - Array of available day names (lowercase)
   */
  const getAvailableDays = () => {
    if (!timeSlots || timeSlots.length === 0) return [];
    
    // Extract day names from time slots and filter out empty values
    return timeSlots.map(slot => slot.day?.toLowerCase()).filter(Boolean);
  };

  /**
   * Date Availability Checker
   * 
   * Determines if a specific date is available for booking
   * by checking if it falls on one of the trainer's available days.
   * 
   * @param {string} dateString - Date in YYYY-MM-DD format
   * @returns {boolean} - True if date is available for booking
   */
  const isDateAvailable = (dateString) => {
    const availableDays = getAvailableDays();
    if (availableDays.length === 0) return false;
    
    // Convert date to day name and check availability
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    return availableDays.includes(dayName);
  };

  /**
   * Generate Available Dates for Next 3 Months
   * 
   * Creates a list of all available booking dates by:
   * 1. Getting trainer's available days
   * 2. Iterating through next 3 months
   * 3. Including only dates that match available days
   * 
   * @returns {Array} - Array of available dates in YYYY-MM-DD format
   */
  const getAvailableDates = () => {
    const availableDays = getAvailableDays();
    if (availableDays.length === 0) return [];

    const dates = [];
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    // Start checking from tomorrow
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1);

    // Iterate through dates and add available ones
    while (currentDate <= threeMonthsFromNow) {
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      if (availableDays.includes(dayName)) {
        dates.push(new Date(currentDate).toISOString().split('T')[0]);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  /**
   * Date Change Handler with Validation
   * 
   * Handles date selection and validates availability:
   * - Checks if selected date is available for the trainer
   * - Resets time slot selection when date changes
   * - Shows error message for unavailable dates
   * 
   * @param {Event} e - Date input change event
   */
  const handleDateChange = (e) => {
    const selectedDateValue = e.target.value;
    
    if (isDateAvailable(selectedDateValue)) {
      setSelectedDate(selectedDateValue);
      // Reset time slot when date changes to avoid conflicts
      setSelectedTimeSlot(null);
    } else {
      toast.error('This date is not available. Please select a date when the trainer is available.');
      e.target.value = '';
    }
  };

  /**
   * Main Booking Handler
   * 
   * Manages the complete booking process:
   * 1. Validates user authentication and permissions
   * 2. Checks if date and time slot are selected
   * 3. Creates Stripe checkout session
   * 4. Redirects to payment page
   * 
   * This function integrates with the backend API to create
   * a secure payment session through Stripe.
   */
  const bookingHandler = async () => {
    // Prevent multiple simultaneous booking attempts
    if (isBooking) return;
    
    // Authentication checks
    if (!token) {
      toast.info('Please login to book a session');
      navigate('/login');
      return;
    }

    // Role-based access control
    if (role === 'trainer') {
      toast.error('Trainers cannot book sessions');
      return;
    }

    // Booking validation
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
      
      // Create Stripe checkout session
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

      // Redirect to Stripe checkout page
      if (data.session?.url) {
        window.location.href = data.session.url
      }
    } catch (err) {
      toast.error(err.message)
      setIsBooking(false);
    }
  }

  /**
   * Safe Time Conversion Utility
   * 
   * Converts time format with error handling to prevent app crashes
   * from malformed time data.
   * 
   * @param {string} time - Time string to convert
   * @returns {string} - Formatted time or fallback message
   */
  const safeConvertTime = (time) => {
    if (!time || time === '') return 'Not set';
    try {
      return convertTime(time);
    } catch (error) {
      return 'Invalid time';
    }
  };

  // Component state calculations for UI logic
  const isTrainer = role === 'trainer';
  const isSameTrainer = user?._id === trainerId;
  const hasNoTimeSlots = !timeSlots || timeSlots.length === 0;
  const availableDates = getAvailableDates();
  
  // Determine if booking button should be disabled
  const shouldDisableButton = isTrainer || isSameTrainer || hasNoTimeSlots || isBooking || !selectedTimeSlot || !selectedDate;

  /**
   * Get Appropriate Disable Message
   * 
   * Returns user-friendly message explaining why booking is disabled.
   * 
   * @returns {string} - Reason for disabled booking button
   */
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
      {/* PRICE DISPLAY SECTION */}
      <div className="flex items-center justify-between">
        <p className="text__para mt-0 font-semibold">Price</p>
        <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
          ${ticketPrice}
        </span>
      </div>

      {/* DATE SELECTION SECTION */}
      <div className="mt-[30px]">
        <p className="text__para mt-0 font-semibold text-headingColor">Select Date:</p>
        
        {/* Display available days to guide user selection */}
        {getAvailableDays().length > 0 && (
          <div className="mt-1 mb-2">
            <p className="text-xs text-gray-600">
              Available on: {getAvailableDays().map(day => 
                day.charAt(0).toUpperCase() + day.slice(1)
              ).join(', ')}
            </p>
          </div>
        )}

        {/* Date input with availability validation */}
        <input
          type="date"
          value={selectedDate}
          min={today}  // Prevent past date selection
          onChange={handleDateChange}
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primaryColor"
        />

        {/* Warning message for trainers with no time slots */}
        {availableDates.length === 0 && hasNoTimeSlots && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700 text-xs">
              ⚠️ No available dates - trainer has no time slots configured
            </p>
          </div>
        )}
      </div>

      {/* TIME SLOT SELECTION SECTION */}
      <div className="mt-[30px]">
        <p className="text__para mt-0 font-semibold text-headingColor">Available Time Slots:</p>
        <div className="mt-3 space-y-2">
          {timeSlots?.map((item, index) => (
            <div 
              key={index} 
              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                selectedTimeSlot === item 
                  ? 'border-primaryColor bg-blue-50'  // Highlight selected slot
                  : 'border-gray-300 hover:border-gray-400'  // Default styling
              }`}
              onClick={() => setSelectedTimeSlot(item)}
            >
              <div className="flex items-center justify-between">
                {/* Display day and time information */}
                <div className="flex flex-col">
                  <p className="text-[15px] leading-6 text-textColor font-semibold">
                    {item.day ? item.day.charAt(0).toUpperCase() + item.day.slice(1) : 'Not set'}
                  </p>
                  <p className="text-[13px] leading-5 text-gray-500">
                    {safeConvertTime(item.startingTime)} - {safeConvertTime(item.endingTime)}
                  </p>
                </div>
              </div>
              {/* Selection indicator */}
              {selectedTimeSlot === item && (
                <div className="mt-1">
                  <span className="text-primaryColor text-sm font-medium">✓ Selected</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* No time slots available warning */}
        {hasNoTimeSlots && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700 text-sm font-medium">
              ⚠️ No time slots available for booking
            </p>
          </div>
        )}
      </div>

      {/* BOOKING SUMMARY SECTION */}
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

      {/* BOOKING BUTTON SECTION */}
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
