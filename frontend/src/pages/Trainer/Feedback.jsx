/**
 * Trainer Feedback Component
 * 
 * This component displays all reviews for a trainer and provides functionality
 * for users to add new feedback. It shows a complete review system with:
 * 
 * FEATURES:
 * - Display all trainer reviews with user info and ratings
 * - Star rating visualization for each review
 * - Formatted date display for review timestamps
 * - Toggle feedback form for adding new reviews
 * - Review count display in header
 * - User profile photos and names for each review
 * 
 * PROPS:
 * - reviews: Array of review objects containing user data, ratings, and text
 * - totalRating: Total number of reviews for display in header
 * 
 * LAYOUT:
 * - Reviews list with user avatar, name, date, text, and star rating
 * - Conditional feedback form that appears when user clicks "Give Feedback"
 * - Responsive design with proper spacing and typography
 */

import avatar from "../../assets/images/avatar-icon.png";
import { formatDate } from "../../utils/formatDate";
import { AiFillStar } from "react-icons/ai";
import { useState } from "react";
import FeedbackForm from "./FeedbackForm";

const Feedback = ({reviews, totalRating}) => {
  /**
   * Feedback Form Toggle State
   * 
   * Controls whether the feedback form is visible to users.
   * Default is false to show reviews first, then allow feedback submission.
   */
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  return (
    <div>
      {/* REVIEWS SECTION */}
      <div className="mb-[50px]">
        
        {/* Section Header with Review Count */}
        <h4 className="text-[20px] leading-[30px] font-bold text-headingColor mb-[30px]">
          All reviews ({totalRating})
        </h4>
        
        {/* INDIVIDUAL REVIEWS LIST */}
        {/* Maps through reviews array to display each review */}
        { reviews?.map((review, index) => (
         <div key={index} className="flex justify-between gap-10 mb-[30px]">
          
          {/* LEFT SIDE - USER INFO AND REVIEW TEXT */}
          <div className="flex gap-3">
            
            {/* User Profile Photo */}
            <figure className="w-10 h-10 rounded-full">
              <img className="w-full" src={review.user?.photo} alt="" />
            </figure>

            {/* Review Content Column */}
            <div>
              {/* Reviewer Name */}
              <h5 className="text-[16px] leading-6 text-primaryColor font-bold">
                {review?.user?.name}
              </h5>
              
              {/* Review Date - Formatted for readability */}
              <p className="text-[14px] leading-6 text-textColor">
                {formatDate(review?.createdAt)}
              </p>
              
              {/* Review Text Content */}
              <p className="text__para mt-3 font-medium text-[15px]">
                {review.reviewText}
              </p>          
            </div>
          </div>
          
          {/* RIGHT SIDE - STAR RATING DISPLAY */}
          {/* Creates array based on rating number and renders filled stars */}
          <div className="flex gap-1">
            {[...Array(review?.rating).keys()].map((_, index) => (
              <AiFillStar key={index} color="#0067FF" />
            ))}
            {/*
              STAR RATING LOGIC:
              - Creates array with length equal to rating number
              - Maps through array to render that many filled stars
              - Uses brand blue color (#0067FF) for consistency
              - Each star has unique key for React rendering
            */}
          </div>
        </div> 
        )) }
      </div>

      {/* FEEDBACK FORM TOGGLE SECTION */}
      
      {/* Show "Give Feedback" Button When Form is Hidden */}
      {!showFeedbackForm && ( 
        <div className="text-center">
            <button 
              className="btn" 
              onClick={() => setShowFeedbackForm(true)}
            >
              Give Feedback
            </button>
        </div>
      )}
      
      {/* Show Feedback Form When User Clicks "Give Feedback" */}
      {/* Conditionally renders the form component for adding new reviews */}
      {showFeedbackForm && <FeedbackForm /> }
    </div>
  );
};

export default Feedback;
