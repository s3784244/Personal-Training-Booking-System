/**
 * Trainer Details Component
 * 
 * This is the main trainer profile page that displays comprehensive information about a specific trainer.
 * It provides a detailed view with booking functionality and tabbed content sections.
 * 
 * FEATURES:
 * - Trainer profile header with photo, name, specialization, and ratings
 * - Tabbed interface switching between "About" and "Feedback" sections
 * - Booking sidebar with pricing and time slot selection
 * - Responsive layout (2-column on desktop, stacked on mobile)
 * - Dynamic data fetching based on trainer ID from URL
 * 
 * LAYOUT:
 * - Left column (2/3 width): Trainer info and tabbed content
 * - Right column (1/3 width): Booking panel
 * - Mobile: Stacked single-column layout
 * 
 * URL STRUCTURE:
 * - /trainers/:id - where :id is the trainer's unique identifier
 */

import React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import trainerImg from '../../assets/images/trainer-img02.png'
import starIcon from '../../assets/images/Star.png'
import TrainerAbout from './TrainerAbout'
import Feedback from './Feedback'
import SidePanel from './SidePanel'
import { BASE_URL } from "./../../config";
import useFetchData from "./../../hooks/useFetchData";
import Loader from "./../../components/Loader/Loader";
import Error from "./../../components/Error/Error";

const TrainerDetails = () => {
  /**
   * Tab State Management
   * 
   * Controls which content section is displayed below the trainer profile.
   * Default is "about" to show trainer's background information first.
   * 
   * TAB OPTIONS:
   * - 'about': Shows qualifications, experience, and detailed bio
   * - 'feedback': Shows reviews and rating system
   */
  const [tab, setTab] = useState("about");

  // Extract trainer ID from URL parameters
  const {id} = useParams();
  
  /**
   * Fetch Trainer Data
   * 
   * Uses custom hook to fetch complete trainer profile data including:
   * - Basic info (name, photo, bio, specialization)
   * - Professional data (qualifications, experiences, time slots)
   * - Social proof (reviews, ratings)
   * - Pricing information
   */
  const { data: trainer, loading, error } = useFetchData(`${BASE_URL}trainers/${id}`);

  /**
   * Destructure Trainer Data
   * 
   * Extracts all necessary trainer properties for easy access in JSX.
   * This prevents repetitive trainer.property access throughout the component.
   */
  const {
    name,
    qualifications,
    experiences,
    timeSlots,
    reviews,
    bio,
    about,
    averageRating,
    totalRating,
    specialization,
    ticketPrice,
    photo,
  } = trainer;

  /**
   * Enhanced Text Formatting Helper
   * 
   * Handles various text formatting scenarios:
   * - Adds spaces before capital letters in concatenated words
   * - Capitalizes first letter of each word
   * - Ensures consistent formatting for specializations
   */
  const formatSpecialization = (string) => {
    if (!string) return '';
    
    // Add spaces before capital letters (for cases like "WeightTraining")
    const withSpaces = string.replace(/([a-z])([A-Z])/g, '$1 $2');
    
    // Capitalize first letter of each word
    return withSpaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">

        {/* LOADING STATE */}
        {loading && <Loader />}
        
        {/* ERROR STATE */}
        {error && <Error />}
        
        {/* SUCCESS STATE - TRAINER PROFILE CONTENT */}
        {!loading && !error && ( 
          <div className="grid md:grid-cols-3 gap-[50px]">
            {/* 
              RESPONSIVE GRID LAYOUT:
              - Mobile: Single column (content stacks vertically)
              - Desktop: 3-column grid (main content spans 2 cols, sidebar spans 1 col)
            */}
            
            {/* LEFT SECTION - MAIN TRAINER INFORMATION */}
            <div className="md:col-span-2">
              
              {/* TRAINER PROFILE HEADER */}
              {/* Horizontal layout with photo and key information */}
              <div className="flex items-center gap-5">
                
                {/* Trainer Profile Photo */}
                <figure className="max-w-[200px] max-h-[200px]">
                  <img src={photo} alt="" className="w-full" />
                </figure>

                {/* Trainer Information Column */}
                <div>
                  {/* Specialization Badge */}
                  <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-6 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded">
                    {formatSpecialization(specialization)}
                  </span>
                  
                  {/* Trainer Name */}
                  <h3 className="text-headingColor text-[22px] leading-9 mt-3 font-bold">
                    {name}
                  </h3>
                  
                  {/* RATING DISPLAY */}
                  {/* Shows star icon with average rating and total review count */}
                  <div className="flex items-center gap-[6px]">
                    <span className="flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-semibold text-headingColor">
                      <img src={starIcon} alt="" /> 
                      {/* Format rating to 1 decimal place for consistency */}
                      {Number(averageRating).toFixed(1)}
                    </span>
                    <span className="text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-[400] text-textColor">
                      ({totalRating})
                    </span>
                  </div>
                  
                  {/* Trainer Bio - Short description */}
                  <p className="text__para text-[14px] leading-6 md:text-[15px] lg:max-w-[390px]">
                   {bio}
                  </p>
                </div>
              </div>
              
              {/* TAB NAVIGATION */}
              {/* Horizontal tab buttons with active state styling */}
              <div className="mt-[50px] border-b border-solid border-[#0066ff34]">
                
                {/* About Tab Button */}
                <button 
                  onClick={() => setTab('about')} 
                  className={`${
                    tab==='about' && 'border-b border-solid border-primaryColor'
                  } py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
                >
                  About
                </button>
                
                {/* Feedback Tab Button */}
                <button 
                  onClick={() => setTab('feedback')} 
                  className={`${
                    tab==='feedback' && 'border-b border-solid border-primaryColor'
                  } py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
                >
                  Feedback
                </button>
                {/*
                  TAB STYLING LOGIC:
                  - Active tab gets bottom border in primary color
                  - Inactive tabs have no bottom border
                  - All tabs have consistent padding and typography
                  - Hover states handled by CSS classes
                */}
              </div>
              
              {/* DYNAMIC TAB CONTENT */}
              {/* Renders different components based on selected tab */}
              <div className="mt-[50px]">
                
                {/* About Tab Content */}
                {/* Shows detailed trainer background information */}
                {tab === 'about' && 
                  <TrainerAbout 
                    name={name} 
                    about={about} 
                    qualifications={qualifications}
                    experiences={experiences} 
                  />
                }
                
                {/* Feedback Tab Content */}
                {/* Shows reviews and rating submission interface */}
                {tab === 'feedback' && 
                  <Feedback 
                    reviews={reviews} 
                    totalRating={totalRating} 
                  />
                }
              </div>
            </div>
            
            {/* RIGHT SIDEBAR - BOOKING PANEL */}
            {/* Sticky booking interface with pricing and time slots */}
            <div>
              <SidePanel 
                trainerId={trainer._id}
                ticketPrice={ticketPrice}
                timeSlots={timeSlots}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default TrainerDetails
