/**
 * Trainer About Component
 * 
 * This component displays comprehensive professional information about a trainer.
 * It's used in the trainer profile page to show detailed background information.
 * 
 * FEATURES:
 * - Personalized "About" section with trainer's detailed bio
 * - Professional certifications with date ranges and institutions
 * - Work experience history with positions and workplaces
 * - Responsive layout that adapts to different screen sizes
 * - Formatted date display for professional timeline
 * 
 * PROPS:
 * - name: Trainer's full name for personalized heading
 * - about: Detailed biography/description text
 * - qualifications: Array of certification objects with dates and institutions
 * - experiences: Array of work experience objects with positions and workplaces
 * 
 * LAYOUT SECTIONS:
 * 1. About section with personalized heading and bio text
 * 2. Certifications list with chronological formatting
 * 3. Experience grid with professional background
 */

import React from 'react';
import { formatDate } from '../../utils/formatDate';

const TrainerAbout = ({ name, about, qualifications, experiences }) => {
  return (
    <div>
      
      {/* PERSONALIZED ABOUT SECTION */}
      {/* Header with trainer's name prominently displayed */}
      <div className="text-[20px] leading-[30px] text-headingColor font-semibold flex items-center gap-2">
        <h3>
          About  
          {/* Highlighted trainer name with brand color */}
          <span className="text-irisBlueColor font-bold text-[24px] leading-9">
            {name}
          </span>
        </h3>
        {/*
          STYLING BREAKDOWN:
          - "About" text in standard heading color and weight
          - Trainer name in brand blue color (irisBlueColor)
          - Larger font size for name (24px vs 20px) for emphasis
          - Bold weight on name for visual hierarchy
        */}
      </div>
      
      {/* Detailed Bio/About Text */}
      <p className="text__para">
        {about}
      </p>

      {/* CERTIFICATIONS SECTION */}
      {/* Professional qualifications and training credentials */}
      <div className="mt-12">
        
        {/* Section Header */}
        <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold">
          Certifications
        </h3>
        
        {/* Certifications List */}
        <ul className="pt-4 md:p-5">
          {/* Map through qualifications array to display each certification */}
          {qualifications?.map((item, index) => (
            <li 
              key={index} 
              className="flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]"
            >
              {/*
                RESPONSIVE CERTIFICATION LAYOUT:
                - Mobile: Stacked vertically (flex-col)
                - Desktop: Horizontal with space-between (sm:flex-row sm:justify-between)
                - Items aligned to bottom on desktop (sm:items-end)
                - Gap between elements on larger screens (md:gap-5)
              */}
              
              {/* Certification Details (Left Side) */}
              <div>
                {/* Date Range - Prominently displayed with brand color */}
                <span className="text-irisBlueColor text-[15px] leading-6 font-semibold">
                  {formatDate(item.startingDate)} - {formatDate(item.endingDate)}
                </span>
                
                {/* Certification Name */}
                <p className="text-[15px] leading-6 font-medium text-textColor">
                  {item.certification}
                </p>
              </div>
              
              {/* Institution Name (Right Side) */}
              <p className="text-[14px] leading-5 font-medium text-textColor">
                {item.university}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* EXPERIENCE SECTION */}
      {/* Professional work history and career background */}
      <div className="mt-12">
        
        {/* Section Header */}
        <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold">
          Experience
        </h3>
        
        {/* Experience Grid */}
        <ul className="grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5">
          {/*
            RESPONSIVE EXPERIENCE GRID:
            - Mobile: Single column (default grid behavior)
            - Desktop: 2-column grid (sm:grid-cols-2)
            - 30px gap between experience cards
            - Padding adjusts for different screen sizes
          */}
          
          {/* Map through experiences array to display each position */}
          {experiences?.map((item, index) => (
            <li key={index} className="p-4 rounded bg-[#fff9ea]">
              {/*
                EXPERIENCE CARD STYLING:
                - Light cream background (#fff9ea) for visual separation
                - Padding (p-4) for comfortable content spacing
                - Rounded corners for modern card appearance
                - Each experience is its own contained card
              */}
              
              {/* Employment Date Range */}
              <span className="text-yellowColor text-[15px] leading-6 font-semibold">
                {formatDate(item.startingDate)} - {formatDate(item.endingDate)}
              </span>
              {/*
                DATE STYLING:
                - Yellow color (yellowColor) to match experience card theme
                - Semi-bold weight for prominence
                - Consistent font sizing with certification dates
              */}
              
              {/* Job Position/Title */}
              <p className="text-[16px] leading-6 font-medium text-textColor">
                {item.position}
              </p>
              
              {/* Workplace/Company Name */}
              <p className="text-[14px] leading-5 font-medium text-textColor">
                {item.workplace}
              </p>
              {/*
                INFORMATION HIERARCHY:
                - Position title is larger (16px) as it's the main identifier
                - Workplace is smaller (14px) as supporting information
                - Both use medium font weight for readability
                - Standard text color for consistency
              */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrainerAbout;
