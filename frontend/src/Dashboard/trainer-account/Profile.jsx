/**
 * Trainer Profile Edit Component
 * 
 * This component provides a comprehensive form for trainers to edit their profile information.
 * It manages complex form state with nested arrays for qualifications, experiences, and time slots.
 * 
 * FEATURES:
 * - Basic profile fields (name, email, phone, bio, gender, specialization, pricing)
 * - Dynamic qualification management (add/edit/delete certifications)
 * - Work experience tracking (add/edit/delete positions)
 * - Time slot scheduling (add/edit/delete availability)
 * - Photo upload with Cloudinary integration
 * - Form validation and API integration for profile updates
 * 
 * PROPS:
 * - trainerData: Complete trainer profile data from parent component
 */

import { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import uploadImageToCloudinary from "./../../utils/uploadCloudinary";
import { BASE_URL, token } from './../../config';
import { toast } from "react-toastify";

const Profile = ({trainerData}) => {
  /**
   * Form State Management
   * 
   * Manages all trainer profile data in a single state object.
   * Includes arrays for dynamic sections (qualifications, experiences, timeSlots).
   */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password:"",
    phone: "",
    bio: "",
    gender: "",
    specialization: "",
    ticketPrice: 0,
    qualifications: [],  // Array of certification objects
    experiences: [],     // Array of work experience objects
    timeSlots: [],       // Array of availability time slots
    about:"",
    photo: null,
  });

  /**
   * Initialize Form with Trainer Data
   * 
   * Populates form fields with existing trainer data when component mounts
   * or when trainerData prop changes. This ensures form shows current values.
   */
  useEffect(() => {
    console.log("Form Data Qualifications:", formData.qualifications);
    console.log("Form Data Experiences:", formData.experiences);
    console.log("Form Data TimeSlots:", formData.timeSlots);
    console.log("Form Data:", formData);

    setFormData({
      name: trainerData?.name,
      email: trainerData?.email,
      phone: trainerData?.phone,
      bio: trainerData?.bio,
      gender: trainerData?.gender,
      specialization: trainerData?.specialization,
      ticketPrice: trainerData?.ticketPrice,
      qualifications: trainerData?.qualifications,
      experiences: trainerData?.experiences,
      timeSlots: trainerData?.timeSlots,
      about: trainerData?.about,
      photo: trainerData?.photo,
    });
  }, [trainerData]);
  
  /**
   * Handle Basic Input Changes
   * 
   * Updates form state for simple text/select inputs using dynamic property names.
   */
  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handle Photo Upload
   * 
   * Uploads image to Cloudinary and updates form state with the returned URL.
   * This integrates with the cloud storage service for profile photos.
   */
  const handleFileInputChange = async event => {
    const file = event.target.files[0];
    const data = await uploadImageToCloudinary(file);

    console.log(data);
  
    setFormData({ ...formData, photo: data?.url });
  };
  
  /**
   * Profile Update Handler
   * 
   * Submits the complete form data to the backend API to update trainer profile.
   * Uses PUT request to trainer's specific endpoint with authentication.
   */
  const updateProfileHandler = async e => {
    e.preventDefault();
  
  try {
      // Get fresh token from localStorage to ensure authentication
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${BASE_URL}trainers/${trainerData._id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
    
      const result = await res.json();
    
      if (!res.ok) {
        throw Error(result.message);
      }
    
      toast.success(result.message);
    } catch (err) {
      toast.error(err.message);
    }    
  };
  
  /**
   * Generic Add Item Function
   * 
   * Reusable function to add new items to array fields (qualifications, experiences, timeSlots).
   * Uses functional state update to maintain immutability.
   * 
   * @param {string} key - The array field name to add to
   * @param {Object} item - The new item object to add
   */
  const addItem = (key, item) => {
    setFormData(prevFormData => ({
      ...prevFormData, 
      [key]: [...prevFormData[key], item],
    }));
  }

  /**
   * Generic Handle Array Input Changes
   * 
   * Updates specific fields within array items (e.g., editing a qualification's certification name).
   * Maintains immutability by creating new arrays and objects.
   * 
   * @param {string} key - Array field name (qualifications, experiences, timeSlots)
   * @param {number} index - Index of item being edited
   * @param {Event} event - Input change event
   */
  const handleReusableInputChangeFunc = (key, index, event) => {
    const { name, value } = event.target;

    setFormData(prevFormData => {
      const updateItems = [...prevFormData[key]];

      updateItems[index][name] = value;
      return {
        ...prevFormData,
        [key]: updateItems,
      };
    });
  };

  /**
   * Generic Delete Item Function
   * 
   * Removes items from array fields using filter to maintain immutability.
   * 
   * @param {string} key - Array field name
   * @param {number} index - Index of item to delete
   */
  const deleteItem = (key, index) => {
    setFormData(prevFormData => ({...prevFormData, [key]:prevFormData[key].filter((_, i) => i !== index)}));
  }

  // ===========================================
  // QUALIFICATION MANAGEMENT FUNCTIONS
  // ===========================================

  /**
   * Add New Qualification Entry
   * 
   * Adds a blank qualification object with required fields for certifications.
   */
  const addQualification = (e) => {
    e.preventDefault();
    addItem("qualifications", {
      startingDate: "", endingDate: "", certification: "", university: "",
    });
  }

  /**
   * Handle qualification field changes using the reusable function.
   */
  const handleQualificationChange = (event, index) => {
    handleReusableInputChangeFunc("qualifications", index, event);
  }

  /**
   * Delete specific qualification entry.
   */
  const deleteQualification = (e, index) => {
    e.preventDefault();
    deleteItem(`qualifications`, index);
  }

  // ===========================================
  // EXPERIENCE MANAGEMENT FUNCTIONS
  // ===========================================

  /**
   * Add New Experience Entry
   * 
   * Adds a blank experience object with required fields for work history.
   */
  const addExperience = (e) => {
    e.preventDefault();
    addItem("experiences", {
      startingDate: "", endingDate: "", position: "", workplace: "",
    });
  }

  /**
   * Handle experience field changes using the reusable function.
   */
  const handleExperienceChange = (event, index) => {
    handleReusableInputChangeFunc("experiences", index, event);
  }

  /**
   * Delete specific experience entry.
   */
  const deleteExperience = (e, index) => {
    e.preventDefault();
    deleteItem("experiences", index);
  }

  // ===========================================
  // TIME SLOT MANAGEMENT FUNCTIONS
  // ===========================================

  /**
   * Add New Time Slot Entry
   * 
   * Adds a blank time slot object for trainer availability scheduling.
   */
  const addTimeslot = (e) => {
    e.preventDefault();
    addItem("timeSlots", {
      day: "", startingTime: "", endingTime: "",
    });
  }

  /**
   * Handle time slot field changes using the reusable function.
   */
  const handleTimeslotChange = (event, index) => {
    handleReusableInputChangeFunc("timeSlots", index, event);
  }

  /**
   * Delete specific time slot entry.
   */
  const deleteTimeslot = (e, index) => {
    e.preventDefault();
    deleteItem("timeSlots", index);
  }

  return (
    <div>
      <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">
        Profile Information
      </h2>
      <form>
        {/* BASIC PROFILE INFORMATION SECTION */}
        
        {/* Trainer Name Field */}
        <div className="mb-5">
          <p className="form__label">Name*</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="form__input"
          />
        </div>

        {/* Email Field - Read-only for security */}
        <div className="mb-5">
          <p className="form__label">Email*</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="form__input"
            readOnly  // Email cannot be changed for security reasons
            aria-readonly
            disabled='true'
          />
        </div>

        {/* Phone Number Field */}
        <div className="mb-5">
          <p className="form__label">Phone*</p>
          <input
            type="number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone number"
            className="form__input"
          />
        </div>

        {/* Bio Field - Short description with character limit */}
        <div className="mb-5">
          <p className="form__label">Bio*</p>
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Bio"
            className="form__input"
            maxLength={100}  // Limit bio length for consistency
          />
        </div>

        {/* THREE-COLUMN GRID: Gender, Specialization, Pricing */}
        <div className="mb-5">
          <div className="grid grid-cols-3 gap-5 mb-[30px]">
            
            {/* Gender Selection */}
            <div>
              <p className="form__label">Gender*</p>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="form__input"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Training Specialization */}
            <div>
              <p className="form__label">Specialisation*</p>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="form__input py-3.5"
              >
                <option value="">Select</option>
                <option value="pilates">Pilates</option>
                <option value="weightTraining">Weight Training</option>
                <option value="yoga">Yoga</option>
              </select>
            </div>

            {/* Session Pricing */}
            <div>
              <p className="form__label">Ticket Price</p>
                <input
                  type="number"
                  placeholder="100"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  className="form__input"
                  onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* QUALIFICATIONS SECTION - Dynamic Array Management */}
        <div className="mb-5">
          <p className="form__label">Qualification*</p>
          {/* Render each qualification entry */}
          {formData.qualifications?.map((item, index) => (
            <div key={index}>
              <div>
                {/* Date Range for Qualification */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="form__label">Starting Date*</p>
                    <input
                      type="date"
                      name="startingDate"
                      value={item.startingDate || ""}
                      className="form__input"
                      onChange={e => handleQualificationChange(e, index)}
                    />
                  </div>
                  <div>
                    <p className="form__label">Ending Date*</p>
                    <input
                      type="date"
                      name="endingDate"
                      value={item.endingDate || ""}
                      className="form__input"
                      onChange={e => handleQualificationChange(e, index)}
                    />
                  </div>
                </div>

                {/* Certification Details */}
                <div className="grid grid-cols-2 gap-5 mt-5">
                  <div>
                    <p className="form__label">Certification*</p>
                    <input
                      type="text"
                      name="certification"
                      value={item.certification || ""}
                      className="form__input"
                      onChange={e => handleQualificationChange(e, index)}
                    />
                  </div>
                  <div>
                    <p className="form__label">University*</p>
                    <input
                      type="text"
                      name="university"
                      value={item.university || ""}
                      className="form__input"
                      onChange={e => handleQualificationChange(e, index)}
                    />
                  </div>
                </div>

                {/* Delete Qualification Button */}
                <button onClick={e => deleteQualification(e, index)} className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer">
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}
          {/* Add New Qualification Button */}
          <button onClick={addQualification} className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer">
            Add Qualification
          </button>
        </div>

        {/* EXPERIENCES SECTION - Dynamic Array Management */}
        <div className="mb-5">
          <p className="form__label">Experiences*</p>
          {/* Render each experience entry */}
          {formData.experiences?.map((item, index) => (
            <div key={index}>
              <div>
                {/* Employment Date Range */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="form__label">Starting Date*</p>
                    <input
                      type="date"
                      name="startingDate"
                      value={item.startingDate || ""}
                      className="form__input"
                      onChange={e => handleExperienceChange(e, index)}
                    />
                  </div>
                  <div>
                    <p className="form__label">Ending Date*</p>
                    <input
                      type="date"
                      name="endingDate"
                      value={item.endingDate || ""}
                      className="form__input"
                      onChange={e => handleExperienceChange(e, index)}
                    />
                  </div>
                </div>

                {/* Job Details */}
                <div className="grid grid-cols-2 gap-5 mt-5">
                  <div>
                    <p className="form__label">Position*</p>
                    <input
                      type="text"
                      name="position"
                      value={item.position || ""}
                      className="form__input"
                      onChange={e => handleExperienceChange(e, index)}
                    />
                  </div>
                  <div>
                    <p className="form__label">Workplace*</p>
                    <input
                      type="text"
                      name="workplace"
                      value={item.workplace || ""}
                      className="form__input"
                      onChange={e => handleExperienceChange(e, index)}
                    />
                  </div>
                </div>

                {/* Delete Experience Button */}
                <button onClick={e => deleteExperience(e, index)} className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer">
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}
          {/* Add New Experience Button */}
          <button onClick={addExperience} className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer">
            Add Experience
          </button>
        
        {/* TIME SLOTS SECTION - Availability Scheduling */}
        <div className="mb-5">
          <p className="form__label">Timeslots*</p>
          {/* Render each time slot entry */}
          {formData.timeSlots?.map((item, index) => (
            <div key={index}>
              <div>
                {/* Four-column grid for day and time inputs */}
                <div className="grid grid-cols-2 md:grid-cols-4 mb-[30px] gap-5">
                  
                  {/* Day Selection */}
                  <div>
                    <p className="form__label">Day*</p>
                    <select 
                      name="day" 
                      value={item.day} 
                      className="form__input py-3.5"
                      onChange={e => handleTimeslotChange(e, index)}
                    >
                      <option value="">Select</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                    </select>
                  </div>

                  {/* Start Time */}
                  <div>
                    <p className="form__label">Starting Time*</p>
                    <input
                      type="time"
                      name="startingTime"
                      value={item.startingTime}
                      className="form__input"
                      onChange={e => handleTimeslotChange(e, index)}
                    />
                  </div>

                  {/* End Time */}
                  <div>
                    <p className="form__label">Ending Time*</p>
                    <input
                      type="time"
                      name="endingTime"
                      value={item.endingTime}
                      className="form__input"
                      onChange={e => handleTimeslotChange(e, index)}
                    />
                  </div>

                  {/* Delete Time Slot Button */}
                  <div className="flex items-center">
                    <button onClick={e => deleteTimeslot(e, index)} className="bg-red-600 p-2 rounded-full text-white text-[18px] cursor-pointer mt-6">
                      <AiOutlineDelete />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Add New Time Slot Button */}
          <button onClick={addTimeslot} className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer">
            Add TimeSlot
          </button>
        </div>
        </div>

        {/* ABOUT SECTION - Detailed Description */}
        <div className="mb-5">
          <p className="form__label">About*</p>
          <textarea
            name="about"
            rows={5}
            value={formData.about}
            placeholder="Write about you"
            onChange={handleInputChange}
            className="form__input"
          ></textarea>
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
              Upload Photo
            </label>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="mt-7">
          <button
            type="submit"
            onClick={updateProfileHandler}
            className="bg-primaryColor text-white text-[18px] leading-[30px] w-full py-3 px-4 rounded-lg"
          >
            Update Profile
          </button>
        </div>

      </form>
    </div>
  );
};

export default Profile;
