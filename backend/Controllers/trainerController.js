/**
 * Controllers folder contains the logic for handling API requests. 
 * Each controller function corresponds to an endpoint in the Routes/ 
 * folder.
 * 
 * Handles trainer-related operations.
 *
 * Functions:
 * - updateTrainer: Updates a trainer's details.
 * - deleteTrainer: Deletes a trainer.
 * - getAllTrainer: Fetches all trainers.
 * - getSingleTrainer: Fetches a single trainer's details.
 * - getTrainerProfile: Fetches the logged-in trainer's profile.
 */

import BookingSchema from "../models/BookingSchema.js";
import Trainer from "../models/TrainerSchema.js";

// Update trainer information by ID
export const updateTrainer = async (req, res) => {
  const id = req.params.id;

  try {
    // Update trainer with data from request body
    const updatedTrainer = await Trainer.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true } // return the updated document
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedTrainer,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

// Delete trainer by ID
export const deleteTrainer = async (req, res) => {
  const id = req.params.id;

  try {
    // Find and delete the trainer
    await Trainer.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

// Get a single trainer by ID, including their reviews (excluding password)
export const getSingleTrainer = async (req, res) => {
  const id = req.params.id;

  try {
    // Populate 'reviews' field and exclude password from response
    const trainer = await Trainer.findById(id).populate('reviews').select("-password");

    res.status(200).json({
      success: true,
      message: "Trainer found",
      data: trainer,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "No trainer found" });
  }
};

// Get all approved trainers, with optional search filtering
export const getAllTrainer = async (req, res) => {
  try {
    const { query } = req.query;
    let trainers;

    // If a search query is provided, filter trainers by name or specialization
    if (query) {
      trainers = await Trainer.find({
        isApproved: 'approved',
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { specialization: { $regex: query, $options: 'i' } }
        ],
      }).select("-password");
    } else {
      // Otherwise, return all approved trainers
      trainers = await Trainer.find({ isApproved: 'approved' }).select("-password");
    }

    res.status(200).json({
      success: true,
      message: "Trainers found",
      data: trainers,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

// Get the profile of the currently logged-in trainer
export const getTrainerProfile = async (req, res) => {
  const trainerId = req.userId; // Set from auth middleware

  try {
    // Find the trainer by ID
    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }

    // Exclude password and fetch bookings for this trainer
    const { password, ...rest } = trainer._doc;
    const bookings = await BookingSchema.find({ trainer: trainerId });

    res.status(200).json({
      success: true,
      message: 'Getting profile info',
      data: { ...rest, bookings }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong, cannot get"
    });
  }
};