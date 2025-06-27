/**
 * User Profile Edit Component
 * 
 * This component provides a form for users to edit their personal profile information.
 * It handles basic user data like name, password, photo, and gender settings.
 * 
 * FEATURES:
 * - Basic profile fields (name, email, password, gender)
 * - Photo upload with Cloudinary integration
 * - Form validation and API integration for profile updates
 * - Loading states during form submission
 * - Email field is read-only for security
 * 
 * PROPS:
 * - user: Complete user profile data from parent component
 * 
 * SECURITY:
 * - Email cannot be changed to maintain account integrity
 * - Password field allows updates for security management
 * - File uploads are processed through secure cloud storage
 */

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import uploadImageToCloudinary from '../../utils/uploadCloudinary';
import { BASE_URL, token } from '../../config';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';
import { useEffect } from 'react';

const Profile = ({user}) => {
  // File upload state for photo selection
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Loading state for form submission
  const [loading, setLoading] = useState(false);

  /**
   * Form State Management
   * 
   * Manages all user profile data in a single state object.
   * Simpler than trainer profile as users have fewer editable fields.
   */
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photo: null,
    gender: '',
  });

  const navigate = useNavigate();

  /**
   * Initialize Form with User Data
   * 
   * Populates form fields with existing user data when component mounts
   * or when user prop changes. This ensures form shows current values.
   */
  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      photo: user.photo,
      gender: user.gender,
    });
  }, [user]);
  
  /**
   * Handle Basic Input Changes
   * 
   * Updates form state for text/select inputs using dynamic property names.
   */
  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handle Photo Upload
   * 
   * Uploads image to Cloudinary and updates form state with the returned URL.
   * Also updates selectedFile state for UI feedback.
   */
  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const data = await uploadImageToCloudinary(file);

    setSelectedFile(data.url);
    setFormData({ ...formData, photo: data.url });
  };

  /**
   * Profile Update Handler
   * 
   * Submits the complete form data to the backend API to update user profile.
   * Uses PUT request to user's specific endpoint with authentication.
   * 
   * PROCESS:
   * 1. Prevents default form submission
   * 2. Sets loading state for UI feedback
   * 3. Sends PUT request with updated user data
   * 4. Handles success/error responses
   * 5. Redirects to profile page on success
   */
  const submitHandler = async event => {
    event.preventDefault();
    setLoading(true);

    try {
      // Get fresh token from localStorage for authentication
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${BASE_URL}users/${user._id}`,{
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization:`Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const {message} = await res.json();
      if(!res.ok) {
        throw new Error(message);
      }
      
      setLoading(false);
      toast.success(message);
      // Redirect to profile page to show updated data
      navigate('/users/profile/me');

    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  }
  
  return (
    <div className='mt-10'>
      <form onSubmit={submitHandler}>
        
        {/* USER NAME FIELD */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
          />
        </div>
        
        {/* EMAIL FIELD - READ ONLY */}
        {/* Email cannot be changed for security and account integrity */}
        <div className="mb-5">
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            aria-readonly
            readOnly
          />
        </div>
        
        {/* PASSWORD FIELD */}
        {/* Allows users to update their password for security */}
        <div className="mb-5">
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
          />
        </div>

        {/* GENDER SELECTION */}
        <div className="mb-5 flex items-center justify-between">
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
          </label>
        </div>
        
        {/* PHOTO UPLOAD SECTION */}
        <div className="mb-5 flex items-center gap-3">
          {/* Current Photo Preview */}
          { formData.photo && (
          <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
            <img src={formData.photo} alt="" className="w-full rounded-full" />
          </figure>
          )}

          {/* Custom File Upload Button */}
          <div className="relative w-[130px] h-[50px]">
            {/* Hidden file input */}
            <input
              type="file"
              name="photo"
              id="customFile"
              onChange={handleFileInputChange}
              accept=".jpg, .png"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
            {/* Styled label as button */}
            <label
              htmlFor="customFile"
              className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
            >
              {/* Show file name if selected, otherwise show default text */}
              {selectedFile ? selectedFile.name : 'Upload Photo'}
            </label>
          </div>
        </div>
        
        {/* SUBMIT BUTTON WITH LOADING STATE */}
        <div className="mt-7">
          <button
            disabled={loading && true}
            type="submit"
            className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
          >
            {/* Show spinner during form submission, otherwise show "Update" */}
            {loading ? ( 
              <HashLoader size={25} color="#fffff"/> 
            ) : ( 
              "Update"
            )}
          </button>
        </div>

      </form>
    </div>
  )
}

export default Profile
