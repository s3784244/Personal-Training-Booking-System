import React from 'react'
import { formatDate } from '../../utils/formatDate'

const Bookings = ({bookings}) => {
  // Add a proper fallback image
  const defaultAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMiIgeT0iMTAiPgo8cGF0aCBkPSJNOCAwQzUuNzkgMCA0IDEuNzkgNCA0UzUuNzkgOCA4IDhTMTIgNi4yMSAxMiA0UzEwLjIxIDAgOCAwWk04IDJDOS4xIDIgMTAgMi45IDEwIDRTOS4xIDYgOCA2UzYgNS4xIDYgNFM2LjkgMiA4IDJaIiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik04IDlDNS4yNCA5IDMgMTEuMjQgMyAxNEgxM0MxMyAxMS4yNCAxMC43NiA5IDggOVoiIGZpbGw9IiM5QjlCOUIiLz4KPC9zdmc+Cjwvc3ZnPgo=";

  const handleImageError = (e) => {
    e.target.src = defaultAvatar;
  };

  return (
    <table className="w-full text-left text-sm text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3">Name</th>
          <th scope="col" className="px-6 py-3">Gender</th>
          <th scope="col" className="px-6 py-3">Payment</th>
          <th scope="col" className="px-6 py-3">Price</th>
          <th scope="col" className="px-6 py-3">Booked on</th>
        </tr>
      </thead>

      <tbody>
        {bookings?.map(item => (
          <tr key={item._id}>
            <th
              scope="row"
              className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
            >
              <img
                src={item.user?.photo || defaultAvatar}
                className="w-10 h-10 rounded-full object-cover"
                alt={item.user?.name || 'User'}
                onError={handleImageError}
              />
              <div className="pl-3">
                <div className="text-base font-semibold">
                  {item.user?.name || 'Unknown User'}
                </div>
                <div className="text-normal text-gray-500">
                  {item.user?.email || 'No email available'}
                </div>
              </div>
            </th>
            <td className="px-6 py-4">
              {item.user?.gender || 'Not specified'}
            </td>
            <td className="px-6 py-4">
              {item.isPaid && (
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                  Paid
                </div>
              )}
              {!item.isPaid && (
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                  Unpaid
                </div>
              )}
            </td>
            <td className="px-6 py-4">${item.ticketPrice}</td>
            <td className="px-6 py-4">{formatDate(item.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Bookings