/**
 * User Bookings Component
 * 
 * This component displays all training session bookings made by the current user.
 * It fetches booking data and renders trainer cards for each booked session.
 * 
 * FEATURES:
 * - Fetches user's booking history from API
 * - Displays trainer cards for each booking
 * - Handles loading and error states
 * - Shows empty state when no bookings exist
 * - Responsive grid layout for booking cards
 * 
 * DATA FLOW:
 * - Uses custom hook to fetch booking data
 * - Renders TrainerCard components for each booking
 * - Shows appropriate messages for different states
 * 
 * NOTE: Currently reuses TrainerCard component, but bookings might need
 * additional information like booking date, status, etc.
 */

import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import TrainerCard from "../../components/Trainers/TrainerCard";
import Loading from "../../components/Loader/Loader";
import Error from "../../components/Error/Error";

const MyBookings = () => {
  /**
   * Fetch User Bookings Data
   * 
   * Uses custom hook to fetch all bookings made by the authenticated user.
   * The endpoint returns trainer data for each booking.
   * 
   * RETURNS:
   * - data: Array of trainer objects from user's bookings
   * - loading: Boolean indicating if request is in progress
   * - error: Error message if request fails
   */
  const {
    data: bookings,
    loading,
    error,
  } = useFetchData(`${BASE_URL}users/bookings/my-bookings`);

  return (
    <div>
      {/* LOADING STATE */}
      {/* Shows spinner while fetching booking data */}
      {loading && !error && <Loading />}

      {/* ERROR STATE */}
      {/* Shows error message if booking data fetch fails */}
      {error && !loading && <Error errMessage={error} />}

      {/* SUCCESS STATE WITH BOOKINGS */}
      {/* Renders booking cards when data is successfully loaded */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* 
            RESPONSIVE GRID LAYOUT:
            - Mobile: Single column layout
            - Desktop: 2-column grid for better space utilization
            - Each booking shows as a trainer card
          */}
          {bookings.map(trainer => (
            <TrainerCard trainer={trainer} key={trainer._id} />
          ))}
        </div>
      )}
      
      {/* EMPTY STATE */}
      {/* Shows message when user has no bookings */}
      {!loading && !error && bookings.length === 0 && 
        <h2 className="mt-5 text-center leading-7 text-[20px] font-semibold text-primaryColor">
          You do not have any bookings
        </h2>
      }
    </div>
  );
};

export default MyBookings;
