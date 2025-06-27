/**
 * Feedback Form Component
 * 
 * This component provides an interactive form for users to submit reviews for trainers.
 * It features an interactive star rating system and text feedback submission.
 * 
 * FEATURES:
 * - Interactive 5-star rating system with hover effects
 * - Double-click to reset rating to 0
 * - Text area for detailed feedback
 * - Form validation (rating and text required)
 * - Loading state during submission
 * - API integration with authentication
 * - Success/error feedback via toast notifications
 * 
 * USER INTERACTIONS:
 * - Click stars to set rating
 * - Hover to preview rating selection
 * - Double-click any star to reset rating
 * - Type detailed feedback in text area
 * - Submit form with validation checks
 */

import React from 'react'
import { useState } from 'react';
import { AiFillStar } from "react-icons/ai";
import { useParams } from 'react-router-dom';
import { BASE_URL, token } from '../../config';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';

const FeedbackForm = () => {
  /**
   * Form State Management
   * 
   * Manages the interactive rating system and form submission state.
   */
  const [rating, setRating] = useState(0);        // Selected rating (1-5)
  const [hover, setHover] = useState(0);          // Currently hovered star for preview
  const [reviewText, setReviewText] = useState("");  // Written feedback text
  const [loading, setLoading] = useState(false);    // Form submission loading state

  // Get trainer ID from URL parameters for API submission
  const {id} = useParams();

  /**
   * Handle Review Submission
   * 
   * Processes form submission with validation and API integration.
   * 
   * VALIDATION:
   * - Ensures both rating and review text are provided
   * - Shows error toast if validation fails
   * 
   * API INTEGRATION:
   * - Sends POST request to trainer's review endpoint
   * - Includes authentication token in headers
   * - Handles success/error responses with user feedback
   * 
   * @param {Event} e - Form submission event
   */
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Form validation - both fields are required
      if (!rating || !reviewText) {
        setLoading(false);
        return toast.error('Rating & Review Fields are required');
      }
  
      // Submit review to API
      const res = await fetch(`${BASE_URL}trainers/${id}/reviews`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,  // Authentication required
        },
        body: JSON.stringify({ rating, reviewText }),
      });
  
      const result = await res.json();
  
      if (!res.ok) {
        throw new Error(result.message);
      }
  
      setLoading(false);
      toast.success(result.message);
      
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };
  
  return (
    <form action="">
      
      {/* STAR RATING SECTION */}
      <div>
        <h3 className='text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0'>
          How would you rate the overall experience?
        </h3>
        
        {/* INTERACTIVE STAR RATING SYSTEM */}
        <div>
          {/* Create 5 clickable stars using array mapping */}
          {[...Array(5).keys()].map((_, index) => {
            index += 1; // Convert to 1-based indexing for ratings

            return (
              <button 
                key={index} 
                type="button" // Prevent form submission on star click
                className={`${
                  // Star coloring logic: show yellow if selected or hovered
                  index <= ((rating && hover) || hover)
                    ? "text-yellowColor"  // Active/hovered star color
                    : "text-gray-400"     // Inactive star color
                } bg-transparent border-none outline-none text-[22px] cursor-pointer`}
                
                /* STAR INTERACTION HANDLERS */
                onClick={() => setRating(index)}           // Set rating on click
                onMouseEnter={()=>setHover(index)}         // Preview rating on hover
                onMouseLeave={()=>setHover(rating)}        // Reset to actual rating when not hovering
                onDoubleClick={()=> { 
                  setHover(0); 
                  setRating(0); 
                }}  // Double-click to reset rating to 0
              >
                <span>
                  <AiFillStar />
                </span>
              </button>
            );
          })}
          {/*
            STAR RATING LOGIC EXPLAINED:
            - Creates 5 buttons (stars) using Array(5).keys()
            - Each star shows yellow if its index <= current hover or rating
            - Hover state provides instant visual feedback
            - Click sets permanent rating
            - Double-click resets everything to 0
            - Mouse leave returns to actual rating (removes hover preview)
          */}
        </div>
      </div>

      {/* WRITTEN FEEDBACK SECTION */}
      <div className="mt-[30px]">
        <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
          Share your feedback or suggestions
        </h3>
        
        {/* Feedback Text Area */}
        <textarea
          className="border border-solid border-[#0066ff34] focus:outline-none focus:outline-primaryColor w-full px-4 py-3 rounded-md"
          rows="5"
          placeholder="Write your message"
          onChange={e => setReviewText(e.target.value)}
        />
        {/*
          TEXTAREA STYLING:
          - Light blue border that matches brand colors
          - Focus state changes outline to primary color
          - Responsive width (w-full)
          - Comfortable padding for text input
          - 5 rows provides adequate space for feedback
        */}
      </div>

      {/* SUBMIT BUTTON WITH LOADING STATE */}
      <button type="submit" onClick={handleSubmitReview} className="btn">
        {/* Show spinner during submission, otherwise show submit text */}
        { loading ? <HashLoader size={25} color="#fff" /> : "Submit Feedback" }
      </button>
      {/*
        SUBMIT BUTTON BEHAVIOR:
        - Shows loading spinner when form is being submitted
        - Prevents multiple submissions during loading
        - White spinner color matches button text
        - Uses HashLoader for consistent loading UI
      */}
    </form> 
  );
};

export default FeedbackForm
