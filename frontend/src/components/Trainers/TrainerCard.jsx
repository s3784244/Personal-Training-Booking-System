/**
 * TrainerCard Component
 * 
 * Renders an individual trainer card within the trainer listing grid.
 * Each card displays essential trainer information to help users make booking decisions.
 * 
 * PROPS:
 * - trainer: Object containing all trainer data from API
 */

import React from 'react'
import starIcon from '../../assets/images/Star.png'
import { Link } from "react-router-dom";
import { BsArrowRight, } from "react-icons/bs";

const TrainerCard = ({ trainer }) => {
  const { 
    name, 
    avgRating, 
    totalRating, 
    photo, 
    specialization, 
    experiences
  } = trainer;

  /**
   * Text Capitalization Helper
   * 
   * Ensures consistent text formatting across trainer cards by capitalizing
   * the first letter. Handles cases where API data might have inconsistent capitalization.
   */
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div className="p-3 lg:p-5">
      {/* Profile photo with object-cover to maintain aspect ratio */}
      <div>
        <img 
          src={photo} 
          className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover" 
          alt="" 
        />
      </div>

      <h2 className="text-[18px] leading-[30px] lg:text-[26px] lg:leading-9 text-headingColor font-[700] mt-3 lg:mt-5">
        {name}
      </h2>

      <div className="mt-2 lg:mt-4 flex items-center justify-between">
        {/* Specialization badge with brand colors */}
        <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded">
          {capitalizeFirstLetter(specialization)}
        </span>

        {/* Rating display with star icon and total count */}
        <div className="flex items-center gap-[6px]">
          <span className="flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-semibold text-headingColor">
            <img src={starIcon} alt="" /> {avgRating}
          </span>
          <span className='leading-6 lg:text-[16px] lg:leading-7 font-[400] text-textColor'>
            ({totalRating})
          </span>
        </div>
      </div>

      <div className="mt-[18px] lg:mt-5 flex items-center justify-between">
        <div>
          {/* Shows trainer's current workplace from first experience entry */}
          <p className="text-[14px] leading-6 font-[400] text-textColor">
            At {experiences && experiences[0]?.workplace}
          </p>
        </div>
        
        {/* CTA button with hover effects using Tailwind's group utility */}
        <Link
          to={`/trainers/${trainer._id}`}
          className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-primaryColor hover:border-none"
        >
          <BsArrowRight className="group-hover:text-white w-6 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default TrainerCard;

