/**
 * Trainers Listing Page Component
 * 
 * This is the main page for browsing and searching through available trainers.
 * It provides a comprehensive trainer discovery experience with search functionality.
 * 
 * FEATURES:
 * - Search functionality with debounced input for performance
 * - Grid layout of trainer cards with responsive design
 * - Real-time search by trainer name or specialization
 * - Loading states and error handling
 * - Testimonials section to build trust
 * - Hero section with prominent search bar
 * 
 * SEARCH FUNCTIONALITY:
 * - Debounced search (700ms delay) to prevent excessive API calls
 * - Searches both trainer names and specializations
 * - Real-time results update as user types
 * - Manual search button for explicit search action
 * 
 * LAYOUT SECTIONS:
 * 1. Hero section with search bar
 * 2. Trainer grid with cards
 * 3. Client testimonials section
 */

import TrainerCard from './../../components/Trainers/TrainerCard'
import Testimonial from '../../components/Testimonial/Testimonial';
import { BASE_URL } from "./../../config";
import useFetchData from "./../../hooks/useFetchData";
import Loader from "./../../components/Loader/Loader";
import Error from "./../../components/Error/Error";
import { useState, useEffect } from 'react';

const Trainers = () => {
  /**
   * Search State Management
   * 
   * Manages search functionality with debouncing for performance optimization.
   * 
   * STATE VARIABLES:
   * - query: Current search input value (immediate)
   * - debouncedQuery: Delayed search value (used for API calls)
   */
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  /**
   * Manual Search Handler
   * 
   * Handles explicit search button clicks.
   * Trims whitespace and logs search action for debugging.
   */
  const handleSearch = () => {
    setQuery(query.trim());
    console.log('handle search');
  }

  /**
   * Debounced Search Effect
   * 
   * Implements search debouncing to prevent excessive API calls while user is typing.
   * Waits 700ms after user stops typing before updating the search query.
   * 
   * PERFORMANCE BENEFIT:
   * - Reduces API calls from potentially hundreds to just the final search term
   * - Improves user experience by preventing rapid UI updates
   * - Reduces server load and potential rate limiting issues
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 700);

    // Cleanup timeout on component unmount or query change
    return () => clearTimeout(timeout);
  }, [query]);

  /**
   * Fetch Trainers Data with Search
   * 
   * Uses custom hook to fetch trainers with optional search query parameter.
   * The API endpoint supports searching by name or specialization.
   */
  const { data: trainers, loading, error } = useFetchData(
    `${BASE_URL}trainers?query=${debouncedQuery}`
  );

  return (
    <>
      {/* HERO SECTION - SEARCH INTERFACE */}
      <section className="bg-[#fff9ea]">
        <div className="container text-center">
          
          {/* Page Title */}
          <h2 className="heading">Find a Trainer</h2>
          
          {/* SEARCH BAR */}
          {/* Prominent search interface with input and button */}
          <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between">
            
            {/* Search Input Field */}
            <input
              type="search"
              className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor"
              placeholder="Search Trainer by name or specialisation"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {/*
              SEARCH INPUT FEATURES:
              - type="search" provides mobile keyboard optimization
              - bg-transparent blends with container background
              - w-full takes full available width
              - Real-time value updates trigger debounced search
            */}
            
            {/* Search Button */}
            <button 
              onClick={handleSearch} 
              className="btn mt-0 rounded-[0px] rounded-r-md"
            >
              Search
            </button>
            {/*
              SEARCH BUTTON STYLING:
              - Follows brand button styling (btn class)
              - Custom rounded corners (right side only)
              - mt-0 removes default button margin
            */}
          </div>
        </div>
      </section>

      {/* TRAINERS GRID SECTION */}
      <section>
        <div className="container">
          
          {/* LOADING STATE */}
          {loading && <Loader />}
          
          {/* ERROR STATE */}
          {error && <Error />}
          
          {/* SUCCESS STATE - TRAINER CARDS GRID */}
          {!loading && !error && ( 
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {/* 
                RESPONSIVE GRID BREAKDOWN:
                - Mobile (default): 1 column
                - Small screens (640px+): 2 columns
                - Medium screens (768px+): 3 columns  
                - Large screens (1024px+): 4 columns
                - gap-5 provides consistent spacing between cards
              */}
              
              {/* Render Individual Trainer Cards */}
              {trainers.map(trainer => (
                <TrainerCard key={trainer.id} trainer={trainer} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      {/* Social proof section to build trust and credibility */}
      <section className="container">
        
        {/* Section Header */}
        <div className="xl:w-[470px] mx-auto">
          <h2 className="heading text-center">What our clients say</h2>
          <p className="text__para text-center">
            World-class fitness training for everyone. Our trainers offer unmatched expertise and support.
          </p>
        </div>
        
        {/* Testimonials Component */}
        {/* Displays client reviews and success stories */}
        <div>
          <Testimonial />
        </div>
      </section>
    </>
  );
}

export default Trainers;
