import React from 'react'
import { formatDate } from '../../utils/formatDate'

const Bookings = ({bookings}) => {
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
                src={item.user?.photo || '/default-avatar.png'} // Add fallback for missing photo
                className="w-10 h-10 rounded-full"
                alt=""
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/40x40?text=User'; // Fallback image
                }}
              />
              <div className="pl-3">
                <div className="text-base font-semibold">
                  {item.user?.name || 'Deleted User'} {/* Handle missing user name */}
                </div>
                <div className="text-normal text-gray-500">
                  {item.user?.email || 'No email available'} {/* Handle missing email */}
                </div>
              </div>
            </th>
            <td className="px-6 py-4">
              {item.user?.gender || 'Not specified'} {/* Handle missing gender */}
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