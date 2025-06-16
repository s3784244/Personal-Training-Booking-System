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
import convertTime from '../../utils/convertTime'; // Utility to convert 24hr to 12hr time format
import { BASE_URL } from './../../config'; // API base URL
import { toast } from 'react-toastify'; // For showing success/error notifications
import { authContext } from '../../context/AuthContext'; // For accessing user authentication state
import { useNavigate } from 'react-router-dom'; // For programmatic navigation

const SidePanel = ({trainerId, ticketPrice, timeSlots}) => {
  // Get authentication context (user info, role, token)
  const { role, user, token } = useContext(authContext);
  const navigate = useNavigate(); // Hook for navigation
  
  // Component state variables
  const [isBooking, setIsBooking] = useState(false); // Loading state during booking process
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // Currently selected time slot
  const [selectedDate, setSelectedDate] = useState(''); // Selected date for the session
  
  /**
   * Main booking handler function
   * Validates user authentication, selections, and initiates Stripe checkout
   */
  const bookingHandler = async () => {
    // Prevent multiple simultaneous booking requests
    if (isBooking) return;
    
    // Check if user is logged in
    if (!token) {
      toast.info('Please login to book a session');
      navigate('/login');
      return;
    }

    // Prevent trainers from booking sessions (business rule)
    if (role === 'trainer') {
      toast.error('Trainers cannot book sessions');
      return;
    }

    // Validate that user has selected a time slot
    if (!selectedTimeSlot) {
      toast.error('Please select a time slot');
      return;
    }

    // Validate that user has selected a date
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    // Set loading state to prevent multiple submissions
    setIsBooking(true);

    try {
      // Get authentication token from localStorage
      const token = localStorage.getItem('token');
      
      // Make API call to create Stripe checkout session
      const res = await fetch(`${BASE_URL}bookings/checkout-session/${trainerId}`, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`, // Include auth token in request
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timeSlot: selectedTimeSlot, // Send selected time slot data
          bookingDate: selectedDate   // Send selected date
        })
      })

      // Parse response data
      const data = await res.json()

      // Check if request was successful
      if (!res.ok) {
        throw new Error(data.message + ' Please try again')
      }

      // Redirect to Stripe checkout page if session URL is provided
      if (data.session?.url) {
        window.location.href = data.session.url
      }
    } catch (err) {
      // Show error message and reset loading state
      toast.error(err.message)
      setIsBooking(false);
    }
  }

  /**
   * Safe time conversion function
   * Handles potential errors when converting time formats
   */
  const safeConvertTime = (time) => {
    if (!time || time === '') return 'Not set';
    try {
      return convertTime(time); // Convert 24hr to 12hr format
    } catch (error) {
      return 'Invalid time';
    }
  };

  // Business logic checks for button state
  const isTrainer = role === 'trainer'; // Check if current user is a trainer
  const isSameTrainer = user?._id === trainerId; // Check if user is viewing their own profile
  const hasNoTimeSlots = !timeSlots || timeSlots.length === 0; // Check if trainer has available slots
  
  // Determine if booking button should be disabled
  const shouldDisableButton = isTrainer || isSameTrainer || hasNoTimeSlots || isBooking || !selectedTimeSlot || !selectedDate;

  /**
   * Get appropriate disable reason message for UI feedback
   */
  const getDisableReason = () => {
    if (isBooking) return "Processing booking...";
    if (isTrainer) return "Trainers cannot book sessions";
    if (isSameTrainer) return "You cannot book your own session";
    if (hasNoTimeSlots) return "No available time slots";
    if (!selectedTimeSlot || !selectedDate) return "Please select time slot and date";
    return "";
  };

  // Get today's date in YYYY-MM-DD format for date input minimum value
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

      {/* Date Selection Section */}
      <div className="mt-[30px]">
        <p className="text__para mt-0 font-semibold text-headingColor">Select Date:</p>
        <input
          type="date"
          value={selectedDate}
          min={today} // Prevent selecting past dates
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primaryColor"
        />
      </div>

      {/* Time Slot Selection Section */}
      <div className="mt-[30px]">
        <p className="text__para mt-0 font-semibold text-headingColor">Available Time Slots:</p>
        <div className="mt-3 space-y-2">
          {/* Map through available time slots */}
          {timeSlots?.map((item, index) => (
            <div 
              key={index} 
              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                selectedTimeSlot === item 
                  ? 'border-primaryColor bg-blue-50'  // Highlight selected slot
                  : 'border-gray-300 hover:border-gray-400' // Default and hover styles
              }`}
              onClick={() => setSelectedTimeSlot(item)} // Handle slot selection
            >
              <div className="flex items-center justify-between">
                {/* Display day of the week */}
                <p className="text-[15px] leading-6 text-textColor font-semibold">
                  {item.day ? item.day.charAt(0).toUpperCase() + item.day.slice(1) : 'Not set'}
                </p>
                {/* Display time range */}
                <p className="text-[15px] leading-6 text-textColor font-semibold">
                  {safeConvertTime(item.startingTime)} - {safeConvertTime(item.endingTime)}
                </p>
              </div>
              {/* Show checkmark for selected slot */}
              {selectedTimeSlot === item && (
                <div className="mt-1">
                  <span className="text-primaryColor text-sm font-medium">✓ Selected</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Show warning if no time slots available */}
        {hasNoTimeSlots && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700 text-sm font-medium">
              ⚠️ No time slots available for booking
            </p>
          </div>
        )}
      </div>

      {/* Booking Summary Section - Only show when both date and time slot are selected */}
      {selectedTimeSlot && selectedDate && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700 text-sm font-medium">Booking Summary:</p>
          <p className="text-sm text-green-600">
            Date: {new Date(selectedDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-green-600">
            Time: {safeConvertTime(selectedTimeSlot.startingTime)} - {safeConvertTime(selectedTimeSlot.endingTime)}
          </p>
          <p className="text-sm text-green-600">
            Day: {selectedTimeSlot.day.charAt(0).toUpperCase() + selectedTimeSlot.day.slice(1)}
          </p>
        </div>
      )}

      {/* Booking Button Section */}
      {shouldDisableButton ? (
        // Disabled button with reason
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
        // Active booking button
        <button 
          onClick={bookingHandler} 
          className='btn mx-2 w-full rounded-md hover:bg-blue-600 transition-colors mt-4'
          disabled={isBooking}
        >
          {isBooking ? 'Processing...' : 'Book Session'}
        </button>
      )}
    </div>
  );
};

export default SidePanel;
