/**
 * Signup Component
 * 
 * This component provides user registration functionality for the personal training booking system.
 * It handles account creation for both trainers and clients with comprehensive form validation.
 * 
 * FEATURES:
 * - Multi-field registration form (name, email, password, role, gender)
 * - Profile photo upload with Cloudinary integration
 * - Real-time photo preview before upload
 * - Role selection (Client or Trainer accounts)
 * - Form validation with required fields
 * - Loading states during registration process
 * - Responsive two-column layout with visual branding
 * - Automatic redirection to login after successful registration
 * 
 * REGISTRATION FLOW:
 * 1. User fills out registration form
 * 2. Optional photo upload with preview
 * 3. Form submits to backend registration endpoint
 * 4. Backend creates user account and returns confirmation
 * 5. User redirected to login page to authenticate
 * 
 * LAYOUT:
 * - Left column: Branding image (hidden on mobile)
 * - Right column: Registration form
 * - Mobile: Single column with form only
 */

import React from 'react';
import signupImg from "../assets/images/signup.gif";
import avatar from '../assets/images/trainer-img01.png'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import uploadImageToCloudinary from '../utils/uploadCloudinary';
import { BASE_URL } from '../config';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';

const Signup = () => {
  /**
   * File Upload State Management
   * 
   * Manages photo upload functionality with preview capabilities.
   * 
   * STATE VARIABLES:
   * - selectedFile: URL of uploaded file from Cloudinary
   * - previewURL: URL for displaying photo preview to user
   * - loading: Form submission loading state
   */
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Registration Form State Management
   * 
   * Manages all user registration data in a single state object.
   * Default role is 'client' as most users will be fitness clients.
   */
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photo: selectedFile,
    gender: '',
    role: 'client'  // Default to client role for most users
  });

  const navigate = useNavigate();

  /**
   * Handle Basic Input Changes
   * 
   * Updates form state for text inputs and select dropdowns.
   * Uses dynamic property names to handle multiple input types with one function.
   * 
   * @param {Event} e - Input change event containing target name and value
   */
  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handle Photo Upload and Preview
   * 
   * Processes photo upload to Cloudinary and provides immediate preview to user.
   * 
   * UPLOAD PROCESS:
   * 1. Gets selected file from input event
   * 2. Uploads file to Cloudinary via utility function
   * 3. Sets preview URL for immediate user feedback
   * 4. Updates form data with Cloudinary URL
   * 5. User can see photo before completing registration
   * 
   * @param {Event} event - File input change event
   */
  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const data = await uploadImageToCloudinary(file);

    // Set preview for immediate user feedback
    setPreviewURL(data.url);
    setSelectedFile(data.url);
    // Update form data with cloud URL for submission
    setFormData({ ...formData, photo: data.url });
  };

  /**
   * Handle Registration Form Submission
   * 
   * Processes user registration through the backend API and manages the complete signup flow.
   * 
   * REGISTRATION PROCESS:
   * 1. Prevents default form submission behavior
   * 2. Sets loading state for UI feedback
   * 3. Sends POST request to registration endpoint with form data
   * 4. Processes response and handles success/error cases
   * 5. Redirects to login page on successful registration
   * 6. Shows error messages if registration fails
   * 
   * @param {Event} event - Form submission event
   */
  const submitHandler = async event => {
    event.preventDefault();
    setLoading(true);

    try {
      // Send registration request to backend
      const res = await fetch(`${BASE_URL}auth/register`,{
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const {message} = await res.json();
      
      // Handle registration failure
      if(!res.ok) {
        throw new Error(message);
      }
      
      // Success flow: stop loading, show success message, redirect to login
      setLoading(false);
      toast.success(message);
      navigate('/login');

    } catch (err) {
      // Error handling: show error message and stop loading
      toast.error(err.message);
      setLoading(false);
    }
  }

  return (
    <section className="px-5 xl:px-0">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* LEFT COLUMN - BRANDING IMAGE */}
          {/* Hidden on mobile, visible on desktop for visual appeal */}
          <div className="hidden lg:block bg-primaryColor rounded-l-lg">
            <figure className="rounded-l-lg">
              <img src={signupImg} alt="Signup illustration" className="w-full rounded-l-lg" />
            </figure>
            {/*
              BRANDING SECTION:
              - Only visible on large screens (lg:block)
              - Primary color background for brand consistency
              - Rounded left corners to match form design
              - Signup GIF provides visual interest and context
            */}
          </div>

          {/* RIGHT COLUMN - REGISTRATION FORM */}
          <div className="rounded-l-lg lg:pl-16 py-10">
            
            {/* WELCOME HEADING */}
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
              Create an <span className="text-primaryColor">account</span>
            </h3>
            
            {/* REGISTRATION FORM */}
            <form onSubmit={submitHandler}>
              
              {/* FULL NAME INPUT */}
              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>
              
              {/* EMAIL INPUT */}
              <div className="mb-5">
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
                {/*
                  EMAIL INPUT FEATURES:
                  - type="email" provides built-in validation and mobile optimization
                  - Bottom border design with focus state color change
                  - required attribute prevents empty submission
                  - Consistent styling with other form inputs
                */}
              </div>
              
              {/* PASSWORD INPUT */}
              <div className="mb-5">
                <input
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>

              {/* ROLE AND GENDER SELECTION ROW */}
              {/* Two-column layout for dropdown selections */}
              <div className="mb-5 flex items-center justify-between">
                
                {/* Role Selection - Client or Trainer */}
                <label className="text-headingColor font-bold text-[16px] leading-7">
                  Are you a:
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                  >
                    <option value="client">Client</option>
                    <option value="trainer">Trainer</option>
                  </select>
                  {/*
                    ROLE SELECTION IMPORTANCE:
                    - Determines user permissions and interface
                    - Clients can book sessions, trainers can manage profiles
                    - Default to "client" as most users will be fitness clients
                    - Affects dashboard and navigation after registration
                  */}
                </label>
                
                {/* Gender Selection */}
                <label className="text-headingColor font-bold text-[16px] leading-7">
                  Gender:
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {/*
                    GENDER SELECTION FEATURES:
                    - Optional field (not required)
                    - Includes inclusive "Other" option
                    - Used for trainer matching preferences
                    - Respectful and comprehensive options
                  */}
                </label>
              </div>
              
              {/* PHOTO UPLOAD SECTION */}
              <div className="mb-5 flex items-center gap-3">
                
                {/* Photo Preview */}
                {/* Only shows when user has selected a photo */}
                { selectedFile && (
                <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
                  <img src={previewURL} alt="Profile preview" className="w-full rounded-full" />
                </figure>
                )}
                {/*
                  PHOTO PREVIEW FEATURES:
                  - Circular preview matches profile photo styling
                  - Primary color border for brand consistency
                  - Only visible after photo selection
                  - Immediate feedback for user confidence
                */}

                {/* Custom File Upload Button */}
                <div className="relative w-[130px] h-[50px]">
                  {/* Hidden file input for styling purposes */}
                  <input
                    type="file"
                    name="photo"
                    id="customFile"
                    onChange={handleFileInputChange}
                    accept=".jpg, .png"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {/* Styled label acts as custom upload button */}
                  <label
                    htmlFor="customFile"
                    className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                  >
                    Upload Photo
                  </label>
                  {/*
                    CUSTOM FILE UPLOAD STYLING:
                    - Hidden native file input (opacity-0)
                    - Styled label acts as clickable button
                    - Brand-colored background for consistency
                    - Accepts only JPG and PNG files
                    - Responsive design with proper sizing
                  */}
                </div>
              </div>
              
              {/* SUBMIT BUTTON WITH LOADING STATE */}
              <div className="mt-7">
                <button
                disabled={loading && true}
                  type="submit"
                  className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                >
                  {/* Conditional rendering: show spinner during loading, otherwise show "Sign Up" */}
                  {loading ? ( 
                    <HashLoader size={35} color="#fffff"/> 
                  ) : ( 
                    "Sign Up"
                  )}
                </button>
                {/*
                  SUBMIT BUTTON BEHAVIOR:
                  - Full width for prominent call-to-action
                  - Disabled during loading to prevent multiple submissions
                  - Loading spinner provides visual feedback
                  - Primary brand color for consistency
                */}
              </div>
              
              {/* LOGIN REDIRECT LINK */}
              {/* Provides path for existing users to login */}
              <p className="mt-5 text-textColor text-center">
                Already have an account?
                <Link to="/login" className="text-primaryColor font-medium ml-1">
                  Login
                </Link>
              </p>
              {/*
                LOGIN CTA:
                - Guides existing users to login page
                - Primary color link for brand consistency
                - Centered text with proper spacing
                - Helpful for users who navigated to wrong page
              */}

            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
