/**
 * Bookings Component
 * 
 * This component displays a table of all bookings for a trainer.
 * It shows client information, session details, payment status, and booking dates.
 * Used in the trainer dashboard to manage and view client bookings.
 * 
 * Props:
 * - bookings: Array of booking objects with client and session information
 */

import { formatDate } from '../../utils/formatDate' // Utility to format dates for display
import convertTime from '../../utils/convertTime' // Utility to convert 24hr to 12hr time format

const Bookings = ({bookings}) => {
  // Default avatar SVG for users without profile photos
  const defaultAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMiIgeT0iMTAiPgo8cGF0aCBkPSJNOCAwQzUuNzkgMCA0IDEuNzkgNCA0UzUuNzkgOCA4IDhTMTIgNi4yMSAxMiA0UzEwLjIxIDAgOCAwWk04IDJDOS4xIDIgMTAgMi45IDEwIDRTOS4xIDYgOCA2UzYgNS4xIDYgNFM2LjkgMiA4IDJaIiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik04IDlDNS4yNCA5IDMgMTEuMjQgMyAxNEgxM0MxMyAxMS4yNCAxMC43NiA5IDggOVoiIGZpbGw9IiM5QjlCOUIiLz4KPC9zdmc+Cjwvc3ZnPgo=";

  /**
   * Handle image loading errors by setting fallback to default avatar
   * This ensures users without photos still have a visual representation
   */
  const handleImageError = (e) => {
    e.target.src = defaultAvatar;
  };

  /**
   * Safe time conversion with error handling
   * Prevents app crashes if time data is malformed
   */
  const safeConvertTime = (time) => {
    if (!time || time === '') return 'Not set';
    try {
      return convertTime(time); // Convert from 24hr to 12hr format
    } catch (error) {
      return 'Invalid time'; // Fallback for invalid time data
    }
  };

  /**
   * Safe date formatting with error handling
   * Ensures dates are properly displayed even if data is malformed
   */
  const safeFormatDate = (date) => {
    if (!date) return 'Not specified';
    try {
      return formatDate(new Date(date)); // Format date for display
    } catch (error) {
      return 'Invalid date'; // Fallback for invalid date data
    }
  };

  return (
    <div>
      {/* Bookings Table */}
      <table className="w-full text-left text-sm text-gray-500">
        {/* Table Header */}
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Gender</th>
            <th scope="col" className="px-6 py-3">Session Date</th>
            <th scope="col" className="px-6 py-3">Time Slot</th>
            <th scope="col" className="px-6 py-3">Payment</th>
            <th scope="col" className="px-6 py-3">Price</th>
            <th scope="col" className="px-6 py-3">Booked on</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {/* Map through each booking to create table rows */}
          {bookings?.map(item => (
            <tr key={item._id}>
              {/* Client Name and Photo Column */}
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
              >
                {/* Client Profile Photo */}
                <img
                  src={item.user?.photo || defaultAvatar} // Use client photo or default
                  className="w-10 h-10 rounded-full object-cover"
                  alt={item.user?.name || 'User'}
                  onError={handleImageError} // Handle broken image links
                />
                <div className="pl-3">
                  {/* Client Name */}
                  <div className="text-base font-semibold">
                    {item.user?.name || 'Unknown User'}
                  </div>
                  {/* Client Email */}
                  <div className="text-normal text-gray-500">
                    {item.user?.email || 'No email available'}
                  </div>
                </div>
              </th>
              
              {/* Gender Column */}
              <td className="px-6 py-4">
                {item.user?.gender || 'Not specified'}
              </td>
              
              {/* Session Date Column */}
              <td className="px-6 py-4">
                <div>
                  {/* Actual session date (when the training will occur) */}
                  <div className="font-semibold">
                    {safeFormatDate(item.bookingDate)}
                  </div>
                  {/* Day of the week for the session */}
                  <div className="text-sm text-gray-500 capitalize">
                    {item.timeSlot?.day || 'Not specified'}
                  </div>
                </div>
              </td>
              
              {/* Time Slot Column */}
              <td className="px-6 py-4">
                {/* Check if time slot data exists */}
                {item.timeSlot && item.timeSlot.startingTime && item.timeSlot.endingTime ? (
                  <div className="text-sm">
                    {/* Display time range in 12hr format */}
                    {safeConvertTime(item.timeSlot.startingTime)} - {safeConvertTime(item.timeSlot.endingTime)}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">Not specified</div>
                )}
              </td>
              
              {/* Payment Status Column */}
              <td className="px-6 py-4">
                {/* Show green dot and "Paid" for completed payments */}
                {item.isPaid && (
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    Paid
                  </div>
                )}
                {/* Show red dot and "Unpaid" for pending payments */}
                {!item.isPaid && (
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                    Unpaid
                  </div>
                )}
              </td>
              
              {/* Price Column */}
              <td className="px-6 py-4">${item.ticketPrice}</td>
              
              {/* Booking Creation Date Column */}
              {/* This shows when the booking was made, not when the session is scheduled */}
              <td className="px-6 py-4">{safeFormatDate(item.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty State Message */}
      {/* Show this message when there are no bookings to display */}
      {(!bookings || bookings.length === 0) && (
        <div className="text-center py-8">
          <p className="text-gray-500">No bookings found</p>
        </div>
      )}
    </div>
  )
}

export default Bookings