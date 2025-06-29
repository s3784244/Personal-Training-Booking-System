/**
 * Header Component
 * 
 * This is the main navigation header that appears at the top of every page.
 * It provides:
 * 
 * FEATURES:
 * - Logo and branding
 * - Main navigation menu with active link highlighting
 * - User authentication status (login/logout buttons or user profile)
 * - Responsive mobile menu toggle
 * - Sticky header behavior on scroll
 * - Role-based navigation (different profile links for trainers vs clients)
 * 
 * BEHAVIOR:
 * - Becomes sticky when user scrolls down 80px
 * - Shows different navigation options based on user authentication status
 * - Displays user profile picture and quick access to profile page
 * - Mobile-responsive with hamburger menu on smaller screens
 */

import {useEffect, useRef, useContext} from "react";
import logo from "../../assets/images/trainerhub-logo.png"; 
import { NavLink, Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi"
import { authContext } from "../../context/AuthContext";

/**
 * Navigation Links Configuration
 * 
 * Defines the main navigation items that appear in the header menu.
 * Each item has a path (URL route) and display text.
 * This array makes it easy to add/remove/modify navigation items.
 */
const navLinks = [
  {
    path: '/home',
    display: 'Home'
  },
  {
    path: '/trainers',
    display: 'Find a Trainer'
  },
  {
    path: '/services',
    display: 'Services'
  },
  {
    path: '/contact',
    display: 'Contact'
  },
]

const Header = () => {
  // Refs for DOM manipulation
  const headerRef = useRef(null)  // Reference to header element for sticky behavior
  const menuRef = useRef(null)    // Reference to mobile menu for toggle functionality

  // Get user authentication data from context
  const { user, role, token } = useContext(authContext);

  /**
   * Sticky Header Handler
   * 
   * Adds/removes sticky header styling based on scroll position.
   * When user scrolls down 80px or more, the header becomes sticky
   * with different styling (defined in CSS as 'sticky_header' class).
   * 
   * This creates a professional floating header effect that improves
   * navigation accessibility when scrolling through long pages.
   */
  const handleStickyHeader = () => {
    window.addEventListener('scroll', () => {
      // Check if page has been scrolled down 80px or more
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add('sticky_header');
      } else {
        headerRef.current.classList.remove('sticky_header');
      }
    });
  };

  /**
   * Setup Effect for Scroll Listener
   * 
   * Initializes the sticky header functionality when component mounts
   * and cleans up the event listener when component unmounts to prevent
   * memory leaks.
   */
  useEffect(() => {
    handleStickyHeader();

    // Cleanup function to remove event listener
    return () => window.removeEventListener('scroll', handleStickyHeader);
  });

  /**
   * Mobile Menu Toggle Function
   * 
   * Toggles the visibility of the mobile navigation menu by adding/removing
   * the 'show_menu' CSS class. This creates a slide-in/slide-out effect
   * for the mobile menu on smaller screen sizes.
   */
  const toggleMenu = () => menuRef.current.classList.toggle('show_menu')

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          
          {/* LOGO SECTION */}
          {/* Company logo that links back to home page */}
          <div>
            <Link to="/">
              <img src={logo} alt="TrainerHub" className="w-56 h-auto" />
            </Link>
          </div>

          {/* MAIN NAVIGATION MENU */}
          {/* Desktop navigation menu with active link highlighting */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[1.5rem] lg:gap-[2.7rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={navClass => 
                      navClass.isActive 
                      ? "text-primaryColor text-[14px] lg:text-[16px] leading-7 font-[600] whitespace-nowrap"
                      : "text-textColor text-[14px] lg:text-[16px] leading-7 font-[500] hover:text-primaryColor whitespace-nowrap"
                    }
                  >
                    {/* Show shorter text on smaller screens */}
                    <span className="hidden lg:inline">{link.display}</span>
                    <span className="lg:hidden">
                      {link.display === 'Find a Trainer' ? 'Trainers' : 
                       link.display === 'Services' ? 'Services' :
                       link.display === 'Contact' ? 'Contact' : 
                       link.display}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT SIDE NAVIGATION (Authentication & User Actions) */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* AUTHENTICATED USER SECTION */}
            {/* Show user profile and logout when user is logged in */}
            {token && user ? (
              <>
                {/* User Profile Picture - Acts as My Profile button on mobile */}
                {/* Clickable profile image that links to user's profile page */}
                <div>
                  <Link to={`${role === 'trainer' ? '/trainers/profile/me' : '/users/profile/me'}`}>
                    <figure className="w-[35px] h-[35px] rounded-full cursor-pointer">
                      <img 
                        src={user?.photo} 
                        className="w-full rounded-full object-cover" 
                        alt="" 
                      />
                    </figure>
                  </Link>
                </div>

                {/* My Profile Button - Hidden on mobile (< 640px) */}
                <Link to={`${role === 'trainer' ? '/trainers/profile/me' : '/users/profile/me'}`} className="hidden sm:block">
                  <button className="bg-blue-200 hover:bg-blue-300 py-2 px-4 lg:px-6 text-primaryColor font-[600] h-[44px] flex items-center justify-center rounded-[50px] text-sm lg:text-base whitespace-nowrap">
                    My Profile
                  </button>
                </Link>

                {/* Logout Button - Always shows "Logout" text */}
                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                  }}
                  className="bg-red-500 hover:bg-red-600 py-2 px-2 sm:px-4 lg:px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px] text-xs sm:text-sm lg:text-base"
                >
                  Logout
                </button>
              </>
            ) : (
              /* UNAUTHENTICATED USER SECTION */
              <>
                {/* Login Button - Responsive */}
                <Link to='/login'>
                  <button className="bg-primaryColor py-2 px-3 sm:px-4 lg:px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px] text-xs sm:text-sm lg:text-base">
                    Login
                  </button>
                </Link>
                
                {/* Sign Up Button - Responsive */}
                <Link to='/register'>
                  <button className="bg-orange-400 py-2 px-2 sm:px-4 lg:px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px] text-xs sm:text-sm lg:text-base">
                    <span className="hidden sm:inline">Sign Up</span>
                    <span className="sm:hidden">Join</span>
                  </button>
                </Link>
              </>
            )}
            
            {/* MOBILE MENU TOGGLE */}
            <span className="md:hidden ml-2" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
          </div>
          
        </div>
      </div>   
    </header>
  );
};

export default Header;
