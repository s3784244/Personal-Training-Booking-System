/**
 * User Account Dashboard Component
 * 
 * This is the main dashboard page for clients/users to manage their account and view bookings.
 * It provides a tabbed interface with two main sections:
 * 
 * FEATURES:
 * - My Bookings: View all training session bookings
 * - Profile Settings: Edit personal account information
 * - Account management: Logout and delete account functionality
 * - Responsive layout with sidebar navigation
 * 
 * LAYOUT:
 * - Left sidebar: User profile summary and account actions
 * - Right content area: Dynamic content based on selected tab
 * - Mobile responsive design that stacks vertically
 * 
 * AUTHENTICATION:
 * - Fetches authenticated user's profile data
 * - Manages logout through AuthContext
 * - Handles account deletion with confirmation
 */

import { useContext, useState } from "react";
import { authContext } from "../../context/AuthContext";
import userImg from "../../assets/images/trainer-img01.png";
import MyBookings from "./MyBookings";
import Profile from "./Profile";
import useGetProfile from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import Loading from "../../components/Loader/Loader";
import Error from "../../components/Error/Error";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAccount = () => {
  // Authentication context for logout functionality
  const { dispatch } = useContext(authContext);
  
  /**
   * Tab State Management
   * 
   * Controls which content section is displayed in the dashboard.
   * Default is 'bookings' to show user's training appointments first.
   */
  const [tab, setTab] = useState("bookings");
  const navigate = useNavigate();

  /**
   * Fetch User Profile Data
   * 
   * Uses custom hook to fetch authenticated user's complete profile data.
   * The '/profile/me' endpoint returns current user's data based on JWT token.
   */
  const {data:userData, loading, error} = useGetProfile(`${BASE_URL}users/profile/me`);
  
  /**
   * Handle User Logout
   * 
   * Clears authentication state using context dispatch.
   * This triggers a logout action that clears user data from both
   * component state and localStorage via the AuthContext reducer.
   */
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  }

  /**
   * Handle Account Deletion
   * 
   * Performs complete user account deletion with confirmation.
   * This is a destructive action that removes all user data and bookings.
   * 
   * PROCESS:
   * 1. Shows confirmation dialog to prevent accidental deletion
   * 2. Makes DELETE API request to remove user from database
   * 3. Shows success/error feedback to user
   * 4. Logs out user and redirects to home page if successful
   */
  const handleDeleteAccount = async () => {
    // Confirmation dialog to prevent accidental deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      // Use fresh token from localStorage for authentication
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${BASE_URL}users/${userData._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      // Success flow: notify user, logout, and redirect
      toast.success("Account deleted successfully");
      dispatch({ type: "LOGOUT" });
      navigate('/');
    } catch (err) {
      // Error handling with user feedback
      toast.error(err.message || "Failed to delete account");
    }
  }

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        {/* LOADING STATE */}
        {loading && !error && <Loading />}
        
        {/* ERROR STATE */}
        {error && !loading && <Error errMessage={error}/>}

        {/* SUCCESS STATE - DASHBOARD CONTENT */}
        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-10">
            {/* 
              RESPONSIVE GRID LAYOUT:
              - Mobile: Single column (profile stacks above content)
              - Desktop: 3-column grid (1 col for profile, 2 cols for content)
            */}
            
            {/* LEFT SIDEBAR - USER PROFILE SUMMARY */}
            <div className="pb-[50px] px-[30px] rounded-md">
              
              {/* User Profile Photo */}
              <div className="flex items-center justify-center">
                <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor">
                  <img
                    src={userData.photo}
                    alt="User Profile"
                    className="w-full h-full rounded-full"
                  />
                </figure>
              </div>

              {/* User Basic Information */}
              <div className="text-center mt-4">
                <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">
                  {userData.name}
                </h3>
                <p className="text-textColor text-[15px] leading-6 font-medium">
                  {userData.email}
                </p>
              </div>

              {/* ACCOUNT ACTIONS SECTION */}
              <div className="mt-[50px] md:mt-[100px]">
                
                {/* Logout Button - Safe account exit */}
                <button onClick={handleLogout} className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white">
                  Logout
                </button>
                
                {/* Delete Account Button - Destructive action with warning styling */}
                <button 
                  onClick={handleDeleteAccount} 
                  className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white hover:bg-red-700 transition-colors"
                >
                  Delete account
                </button>
              </div>
            </div>

            {/* RIGHT CONTENT AREA - TAB CONTENT */}
            <div className="md:col-span-2 md:px-[30px]">
              
              {/* TAB NAVIGATION */}
              <div>
                {/* My Bookings Tab */}
                <button
                  onClick={() => setTab("bookings")}
                  className={`${
                    tab === "bookings" ? "bg-primaryColor text-white font-normal" : ""
                  } p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] 
                  leading-7 border border-solid border-primaryColor`}
                >
                  My Bookings
                </button>

                {/* Profile Settings Tab */}
                <button
                  onClick={() => setTab("settings")}
                  className={`${
                    tab === "settings" ? "bg-primaryColor text-white font-normal" : ""
                  } py-2 px-5 rounded-md text-headingColor font-semibold text-[16px] 
                  leading-7 border border-solid border-primaryColor`}
                >
                  Profile Settings
                </button>
              </div>
              
              {/* DYNAMIC CONTENT BASED ON SELECTED TAB */}
              
              {/* Bookings Tab Content */}
              {tab === "bookings" && <MyBookings />}
              
              {/* Profile Settings Tab Content */}
              {tab === "settings" && <Profile user={userData} />}
              
            </div>
          </div>
        )}
      </div> 
    </section>
  );
};

export default MyAccount;
