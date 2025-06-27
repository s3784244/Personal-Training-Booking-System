/**
 * Login Component
 * 
 * This component provides the user authentication interface for the personal training booking system.
 * It handles user login for both trainers and clients with form validation and authentication management.
 * 
 * FEATURES:
 * - Email and password authentication
 * - Form validation with required fields
 * - Loading states during authentication process
 * - Integration with global authentication context
 * - Automatic redirection after successful login
 * - Error handling with user-friendly messages
 * - Responsive design for all screen sizes
 * 
 * AUTHENTICATION FLOW:
 * 1. User enters credentials
 * 2. Form submits to backend authentication endpoint
 * 3. Backend validates credentials and returns user data + JWT token
 * 4. Context state updates with user information
 * 5. User redirected to home page
 * 
 * SECURITY:
 * - Password field properly masked
 * - JWT token handling through secure context
 * - Form validation prevents empty submissions
 */

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import { toast } from 'react-toastify';
import { authContext } from '../context/AuthContext.jsx';
import HashLoader from 'react-spinners/HashLoader';

const Login = () => {
  /**
   * Form State Management
   * 
   * Manages login form data with controlled inputs.
   * Both email and password are required for authentication.
   */
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Loading state for form submission and UI feedback
  const [loading, setLoading] = useState(false);
  
  // Navigation hook for post-login redirection
  const navigate = useNavigate();
  
  // Authentication context for global state management
  const { dispatch } = useContext(authContext);

  /**
   * Handle Form Input Changes
   * 
   * Updates form state when user types in email or password fields.
   * Uses dynamic property names to handle multiple input fields with one function.
   * 
   * @param {Event} e - Input change event containing target name and value
   */
  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handle Login Form Submission
   * 
   * Processes user authentication through the backend API and manages the complete login flow.
   * 
   * AUTHENTICATION PROCESS:
   * 1. Prevents default form submission behavior
   * 2. Sets loading state for UI feedback
   * 3. Sends POST request to authentication endpoint with credentials
   * 4. Processes response and extracts user data, token, and role
   * 5. Updates global authentication state via context dispatch
   * 6. Redirects user to home page on success
   * 7. Shows error messages if authentication fails
   * 
   * @param {Event} event - Form submission event
   */
  const submitHandler = async event => {
      event.preventDefault();
      setLoading(true);
  
      try {
        // Send authentication request to backend
        const res = await fetch(`${BASE_URL}auth/login`,{
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
  
        const result = await res.json();
        
        // Handle authentication failure
        if(!res.ok) {
          throw new Error(result.message);
        }

        /**
         * Update Global Authentication State
         * 
         * Dispatches LOGIN_SUCCESS action to AuthContext with complete user data.
         * This updates the global state and triggers localStorage persistence.
         * 
         * PAYLOAD STRUCTURE:
         * - user: Complete user profile object
         * - token: JWT authentication token for API requests
         * - role: User type ('trainer' or 'client') for role-based features
         */
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: {
            user: result.data,
            token: result.token,
            role: result.role,
          },
        });

        console.log(result, "login data");

        // Success flow: stop loading, show success message, redirect
        setLoading(false);
        toast.success(result.message);
        navigate('/home');
  
      } catch (err) {
        // Error handling: show error message and stop loading
        toast.error(err.message);
        setLoading(false);
      }
    }
  

  return (
    <section className="px-5 lg:px-0">
      {/* LOGIN FORM CONTAINER */}
      {/* Centered card layout with shadow and responsive padding */}
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
        
        {/* WELCOME HEADING */}
        {/* Friendly greeting with brand color accent */}
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
          Hello! <span className="text-primaryColor">Welcome</span> Back 🎉
        </h3>

        {/* LOGIN FORM */}
        <form className="py-4 md:py-0" onSubmit={submitHandler}>
          
          {/* EMAIL INPUT FIELD */}
          <div className="mb-5">
            <input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
              focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor 
              rounded-md cursor-pointer"
              required
            />
            {/*
              EMAIL INPUT STYLING:
              - type="email" provides built-in validation and mobile keyboard optimization
              - Bottom border design with focus state color change
              - Large text size (22px) for comfortable reading
              - required attribute prevents empty submission
              - Responsive width (w-full) adapts to container
            */}
          </div>
          
          {/* PASSWORD INPUT FIELD */}
          <div className="mb-5">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
              focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor 
              rounded-md cursor-pointer"
              required
            />
            {/*
              PASSWORD INPUT FEATURES:
              - type="password" automatically masks input for security
              - Same styling as email field for consistency
              - required attribute ensures field is not empty
              - Controlled component updates formData state
            */}
          </div>
          
          {/* SUBMIT BUTTON WITH LOADING STATE */}
          <div className="mt-7">
            <button
              type="submit"
              className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
            >
              {/* Conditional rendering: show spinner during loading, otherwise show "Login" */}
              {loading ? <HashLoader size={25} color='#ffff'/> : 'Login'}
            </button>
            {/*
              BUTTON BEHAVIOR:
              - Full width for prominent call-to-action
              - Primary brand color background
              - Loading spinner prevents multiple submissions
              - White spinner color matches button text
              - Form submission triggers authentication flow
            */}
          </div>
          
          {/* REGISTRATION LINK */}
          {/* Provides path for new users to create accounts */}
          <p className="mt-5 text-textColor text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-primaryColor font-medium ml-1">
              Register
            </Link>
          </p>
          {/*
            REGISTRATION CTA:
            - Centered text with subtle color
            - "Register" link in brand primary color
            - Guides new users to account creation
            - Proper spacing and typography hierarchy
          */}
        </form>
      </div>
    </section>
  );
};

export default Login;
