/**
 * Trainer Dashboard Component
 * 
 * This is the main dashboard page for trainers to manage their profile and view bookings.
 * It provides a tabbed interface with three main sections:
 * 
 * FEATURES:
 * - Overview: Displays trainer profile summary with photo, certifications, and about section
 * - Bookings: Shows all client bookings and appointment management
 * - Profile: Allows trainers to edit their profile information
 * 
 * LAYOUT:
 * - Left sidebar: Tab navigation
 * - Right content area: Dynamic content based on selected tab
 * - Responsive design that stacks on mobile devices
 * 
 * DATA FLOW:
 * - Fetches trainer profile data on component mount
 * - Manages active tab state locally
 * - Passes data down to appropriate child components
 */

import Error from "../../components/Error/Error";
import Loader from "../../components/Loader/Loader";
import useGetProfile from "../../hooks/useFetchData";
import { useState } from "react";
import { BASE_URL } from "../../config";
import Tabs from "./Tabs";
import starIcon from "../../assets/images/Star.png";
import TrainerAbout from "../../pages/Trainer/TrainerAbout";
import Profile from "./Profile";
import Bookings from "./Bookings";

const Dashboard = () => {
  /**
   * Fetch Trainer Profile Data
   * 
   * Uses custom hook to fetch authenticated trainer's complete profile data.
   * The '/profile/me' endpoint returns current user's data based on JWT token.
   * 
   * RETURNS:
   * - data: Complete trainer profile including bookings, qualifications, experiences
   * - loading: Boolean indicating if API request is in progress
   * - error: Error message if request fails
   */
  const { data, loading, error } = useGetProfile(
    `${BASE_URL}trainers/profile/me`
  );

  /**
   * Tab State Management
   * 
   * Controls which content section is currently displayed in the dashboard.
   * Default is 'overview' to show trainer profile summary first.
   * 
   * TAB OPTIONS:
   * - 'overview': Profile summary and about information
   * - 'bookings': Client appointments and booking management
   * - 'profile': Editable profile settings
   */
  const [tab, setTab] = useState("overview");

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        {/* LOADING STATE */}
        {/* Shows spinner while fetching trainer profile data */}
        {loading && !error && <Loader />}
        
        {/* ERROR STATE */}
        {/* Shows error message if profile data fetch fails */}
        {error && !loading && <Error />}

        {/* SUCCESS STATE */}
        {/* Renders dashboard content when data is successfully loaded */}
        {!loading && !error && (
          <div className="grid lg:grid-cols-3 gap-[30px] lg:gap-[50px]">
            {/* 
              RESPONSIVE GRID LAYOUT:
              - Mobile: Single column (tabs stack above content)
              - Desktop: 3-column grid (1 col for tabs, 2 cols for content)
            */}
            
            {/* LEFT SIDEBAR - TAB NAVIGATION */}
            {/* Navigation component that manages tab switching */}
            <Tabs tab={tab} setTab={setTab} />
            
            {/* RIGHT CONTENT AREA */}
            {/* Spans 2 columns on desktop for more content space */}
            <div className="lg:col-span-2">
              <div className="mt-8">
                
                {/* OVERVIEW TAB CONTENT */}
                {/* Displays trainer profile summary and detailed about section */}
                {tab === "overview" && (
                  <div>
                    {/* TRAINER PROFILE HEADER */}
                    {/* Shows profile photo, basic info, and ratings in a horizontal layout */}
                    <div className="flex items-center gap-4 mb-10">
                      
                      {/* Profile Photo */}
                      <figure className="max-w-[200px] max-h-[200px]">
                        <img src={data?.photo} alt="" className="w-full" />
                      </figure>
                      
                      {/* Trainer Information Column */}
                      <div>
                        {/* CERTIFICATIONS BADGE */}
                        {/* Only shows if trainer has qualifications data */}
                        {Array.isArray(data.qualifications) && data.qualifications.length > 0 && (
                          <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-4 lg:py-2 lg:px-6 rounded 
                                          text-[12px] leading-4 lg:text-[16px] lg:leading-6 font-semibold">
                            {/* Extracts certification names and joins them with commas */}
                            {data.qualifications.map((q) => q.certification).join(", ")}
                          </span>
                        )}

                        {/* Trainer Name */}
                        <h3 className="text-[22px] leading-9 font-bold text-headingColor mt-3">
                          {data.name}
                        </h3>

                        {/* RATING DISPLAY */}
                        {/* Shows star icon with average rating and total review count */}
                        <div className="flex items-center gap-[6px]">
                          <span className="flex items-center gap-[6px] text-headingColor text-[14px] 
                                          leading-5 lg:text-[16px] lg:leading-6 font-semibold">
                            <img src={starIcon} alt="" />
                            {/* Format rating to 1 decimal place for consistency */}
                            {Number(data.averageRating).toFixed(1)}
                          </span>
                          <span className="text-textColor text-[14px] 
                                          leading-5 lg:text-[16px] lg:leading-6 font-semibold">
                            {data.totalRating}
                          </span>
                        </div>
                        
                        {/* Bio/Description */}
                        <p className="text__para font-[15px] lg:max-w-[390px] leading-6">
                          {data?.bio}
                        </p>
                      </div>
                    </div>
                    
                    {/* DETAILED ABOUT SECTION */}
                    {/* Reuses TrainerAbout component from public trainer profile page */}
                    <TrainerAbout
                      name={data.name}
                      about={data.about}
                      qualifications={data.qualifications || []} // Fallback to empty array
                      experiences={data.experiences || []}       // Fallback to empty array
                    />
                  </div>
                )}
                
                {/* BOOKINGS TAB CONTENT */}
                {/* Shows trainer's appointment schedule and booking management */}
                {tab === "bookings" && (
                  <Bookings bookings={data?.bookings || []} />
                )}
                
                {/* PROFILE TAB CONTENT */}
                {/* Editable form for trainer to update their profile information */}
                {tab === "profile" && <Profile trainerData={data}/>}
                
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
