/**
 * Trainer Dashboard Navigation Tabs Component
 * 
 * This component provides the sidebar navigation for the trainer dashboard.
 * It manages tab switching and critical account actions like logout and account deletion.
 * 
 * FEATURES:
 * - Tab navigation with active state highlighting
 * - User logout functionality with context state management
 * - Account deletion with confirmation dialog and API integration
 * - Responsive design (mobile menu icon for smaller screens)
 * 
 * PROPS:
 * - tab: Currently active tab string
 * - setTab: Function to change active tab
 */

import { useContext } from "react";
import { BiMenu } from "react-icons/bi";
import { authContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";

const Tabs = ({ tab, setTab }) => {
  // Authentication context for user data and state management
  const { dispatch, user } = useContext(authContext);
  const navigate = useNavigate();

  /**
   * Handle User Logout
   * 
   * Clears authentication state using context dispatch.
   * This triggers a logout action that clears user data from both
   * component state and localStorage via the AuthContext reducer.
   */
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  /**
   * Handle Account Deletion
   * 
   * Performs complete trainer account deletion with confirmation.
   * This is a destructive action that removes all trainer data and bookings.
   * 
   * PROCESS:
   * 1. Shows confirmation dialog to prevent accidental deletion
   * 2. Makes DELETE API request to remove trainer from database
   * 3. Shows success/error feedback to user
   * 4. Logs out user and redirects to home page if successful
   */
  const handleDeleteAccount = async () => {
    // Confirmation dialog to prevent accidental deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your trainer account? This action cannot be undone and will remove all your bookings."
    );

    if (!confirmDelete) return;

    try {
      // Use fresh token from localStorage for authentication
      const token = localStorage.getItem('token');
      
      // API call to delete trainer account
      const res = await fetch(`${BASE_URL}trainers/${user._id}`, {
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
      toast.success("Trainer account deleted successfully");
      dispatch({ type: "LOGOUT" });
      navigate('/');
    } catch (err) {
      // Error handling with user feedback
      toast.error(err.message || "Failed to delete account");
    }
  };

  return (
    <div>
      {/* MOBILE MENU ICON */}
      {/* Hidden on desktop, shows hamburger menu on mobile devices */}
      <span className="lg:hidden">
        <BiMenu className="w-6 h-6 cursor-pointer" />
      </span>
      
      {/* DESKTOP SIDEBAR NAVIGATION */}
      {/* Hidden on mobile, shows full sidebar on desktop */}
      <div className="hidden lg:flex flex-col p-[30px] bg-white shadow-panelShadow items-center h-max rounded-md">
        
        {/* NAVIGATION TABS */}
        {/* Each button manages its own active state styling */}
        
        {/* Overview Tab - Profile summary */}
        <button
          onClick={() => setTab("overview")}
          className={`${
            tab === "overview"
              ? "bg-indigo-100 text-primaryColor"  // Active state styling
              : "bg-transparent text-headingColor" // Inactive state styling
          } w-full btn mt-0 rounded-md`}
        >
          Overview
        </button>
        
        {/* Bookings Tab - Appointment management */}
        <button
          onClick={() => setTab("bookings")}
          className={`${
            tab === "bookings"
              ? "bg-indigo-100 text-primaryColor"
              : "bg-transparent text-headingColor"
          } w-full btn mt-0 rounded-md`}
        >
          Bookings
        </button>
        
        {/* Settings Tab - Account preferences */}
        <button
          onClick={() => setTab("settings")}
          className={`${
            tab === "settings"
              ? "bg-indigo-100 text-primaryColor"
              : "bg-transparent text-headingColor"
          } w-full btn mt-0 rounded-md`}
        >
          Settings
        </button>
        
        {/* Profile Tab - Edit profile information */}
        <button
          onClick={() => setTab("profile")}
          className={`${
            tab === "profile"
              ? "bg-indigo-100 text-primaryColor"
              : "bg-transparent text-headingColor"
          } w-full btn mt-0 rounded-md`}
        >
          Profile
        </button>

        {/* ACCOUNT ACTIONS SECTION */}
        {/* Separated from navigation tabs with top margin */}
        <div className="mt-[100px] w-full">
          
          {/* Logout Button - Safe account exit */}
          <button 
            onClick={handleLogout} 
            className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white"
          >
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
    </div>
  );
};

export default Tabs;