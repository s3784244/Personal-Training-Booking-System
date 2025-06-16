/**
 * Trainer Controller
 * 
 * Handles all trainer-related backend operations including:
 * - CRUD operations for trainer profiles
 * - Fetching trainer data with associated bookings
 * - Managing trainer search and filtering
 * 
 * This controller manages both public trainer data (for clients browsing)
 * and private trainer data (for trainer dashboard).
 */

import BookingSchema from "../models/BookingSchema.js";
import Trainer from "../models/TrainerSchema.js";

/**
 * Update Trainer Profile
 * 
 * Allows trainers to update their profile information including
 * qualifications, experiences, time slots, and personal details.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateTrainer = async (req, res) => {
  const id = req.params.id; // Trainer ID from URL parameter

  try {
    // Update trainer document with new data from request body
    // $set operator ensures only provided fields are updated
    const updatedTrainer = await Trainer.findByIdAndUpdate(
      id,
      { $set: req.body }, // Update with data from request body
      { new: true } // Return the updated document instead of the old one
    );

    // Send success response with updated trainer data
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedTrainer,
    });
  } catch (err) {
    // Handle database or validation errors
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

/**
 * Delete Trainer Profile
 * 
 * Removes a trainer from the system. This should be used carefully
 * as it will also affect any existing bookings with this trainer.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteTrainer = async (req, res) => {
  const id = req.params.id; // Trainer ID from URL parameter

  try {
    // Remove trainer document from database
    await Trainer.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    // Handle database errors
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

/**
 * Get Single Trainer (Public View)
 * 
 * Fetches detailed information about a specific trainer for public viewing.
 * Includes reviews and ratings but excludes sensitive information like passwords.
 * Used when clients view trainer detail pages.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getSingleTrainer = async (req, res) => {
  const id = req.params.id; // Trainer ID from URL parameter

  try {
    // Find trainer and populate their reviews for display
    // .select("-password") excludes password field from response
    const trainer = await Trainer.findById(id).populate('reviews').select("-password");

    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }

    res.status(200).json({
      success: true,
      message: "Trainer found",
      data: trainer,
    });
  } catch (err) {
    console.error('❌ Error in getSingleTrainer:', err);
    res.status(500).json({ success: false, message: "Error fetching trainer" });
  }
};

/**
 * Get All Trainers (Public Listing)
 * 
 * Fetches all trainers for the public trainer listing page.
 * Supports search functionality by name or specialization.
 * Note: Approval filtering is currently disabled for development.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllTrainer = async (req, res) => {
  try {
    console.log('🔍 getAllTrainer called')
    console.log('Query params:', req.query)
    
    const { query } = req.query
    let trainers

    if (query && query.trim() !== '' && query !== 'undefined') {
      console.log('🔎 Searching with query:', query)
      trainers = await Trainer.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { specialization: { $regex: query, $options: 'i' } }
        ],
      }).select("-password")
    } else {
      console.log('📋 Getting all trainers')
      trainers = await Trainer.find({}).select("-password")
    }

    console.log('✅ Found trainers:', trainers.length)

    res.status(200).json({
      success: true,
      message: "Trainers found",
      data: trainers,
      count: trainers.length
    })
  } catch (err) {
    console.error('❌ Error in getAllTrainer:', err)
    res.status(500).json({ 
      success: false, 
      message: "Error fetching trainers",
      error: err.message 
    })
  }
}

/**
 * Get Trainer Profile (Private Dashboard View)
 * 
 * Fetches complete trainer profile information including their bookings.
 * This is used for the trainer's private dashboard where they can see
 * their profile data and manage their bookings.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getTrainerProfile = async (req, res) => {
  const trainerId = req.userId; // Get trainer ID from JWT token (set by auth middleware)

  try {
    // Find the trainer's profile
    const trainer = await Trainer.findById(trainerId);

    // Check if trainer exists
    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }

    // Fetch all bookings for this trainer with populated user data
    const bookings = await BookingSchema.find({ trainer: trainerId })
      .populate('user', 'name email photo gender') // Include client details
      .sort({ createdAt: -1 }); // Sort by newest bookings first

    // Remove password from trainer data before sending response
    const { password, ...rest } = trainer._doc;

    // Send trainer profile data along with their bookings
    res.status(200).json({
      success: true,
      message: 'Profile info retrieved',
      data: { ...rest, bookings } // Merge trainer data with bookings array
    });

  } catch (err) {
    // Handle any database or server errors
    res.status(500).json({
      success: false,
      message: "Something went wrong, cannot get profile"
    });
  }
};