/**
 * TrainerList Component
 * 
 * This component displays a grid of available personal trainers fetched from the API.
 * It serves as the main trainer browsing interface where users can view all trainers
 * and select one to book sessions with.
 * 
 * FEATURES:
 * - Fetches trainer data from the backend API
 * - Displays trainers in a responsive grid layout
 * - Handles loading states with spinner
 * - Shows error messages if API request fails
 * - Renders individual trainer cards with their information
 * 
 * LAYOUT:
 * - Mobile: 1 column grid
 * - Tablet: 2 column grid
 * - Desktop: 3 column grid
 * - Responsive spacing and gaps
 * 
 * STATES:
 * - Loading: Shows spinner while fetching data
 * - Error: Shows error message if request fails
 * - Success: Shows grid of trainer cards
 */

import TrainerCard from "./TrainerCard";
import { BASE_URL } from "./../../config";
import useFetchData from "./../../hooks/useFetchData";
import Loader from "./../../components/Loader/Loader";
import Error from "./../../components/Error/Error";

const TrainerList = () => {
  /**
   * Fetch Trainers Data
   * 
   * Uses custom hook to fetch trainer data from the API.
   * The hook handles loading states, error handling, and data management.
   * 
   * RETURNS:
   * - data: Array of trainer objects from API
   * - loading: Boolean indicating if request is in progress
   * - error: Error message if request fails
   */
  const { data: trainers, loading, error } = useFetchData(`${BASE_URL}trainers`);

  return (
    <>
      {/* LOADING STATE */}
      {/* Shows spinner while API request is in progress */}
      {loading && <Loader />}
      
      {/* ERROR STATE */}
      {/* Shows error message if API request fails */}
      {error && <Error />}

      {/* SUCCESS STATE */}
      {/* Renders trainer grid when data is successfully loaded */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
          {/* 
            RESPONSIVE GRID CLASSES EXPLAINED:
            - grid-cols-1: 1 column on mobile devices
            - sm:grid-cols-2: 2 columns on small screens (640px+)
            - md:grid-cols-3: 3 columns on medium screens (768px+)
            - gap-5: 20px gap between grid items
            - lg:gap-[30px]: 30px gap on large screens (1024px+)
            - mt-[30px]: 30px top margin
            - lg:mt-[55px]: 55px top margin on large screens
          */}
          
          {/* TRAINER CARDS */}
          {/* Maps through trainers array and renders a card for each trainer */}
          {trainers.map(trainer => (
            <TrainerCard 
              key={trainer._id}  // Unique key for React list rendering
              trainer={trainer}  // Pass trainer data to individual card component
            />
          ))}
        </div>
      )}
    </>
  );
};

export default TrainerList;
