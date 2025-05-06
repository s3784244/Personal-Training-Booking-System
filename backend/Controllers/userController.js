/**
 * Controllers folder contains the logic for handling API requests. 
 * Each controller function corresponds to an endpoint in the Routes/ 
 * folder.
 * 
 * Handles client-related operations.
 *
 * Functions:
 * - updateUser: Updates a user's details.
 * - deleteUser: Deletes a user.
 * - getAllUser: Fetches all users (admin-only).
 * - getSingleUser: Fetches a single user's details.
 * - getUserProfile: Fetches the logged-in user's profile.
 * - getMyBookings: Fetches the logged-in user's bookings.
 */

import User from "../models/UserSchema.js";
import BookingSchema from "../models/BookingSchema.js";
import TrainerSchema from "../models/TrainerSchema.js";

// Update a user's details by their ID
export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    // Find user by ID and update with request body data
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true } // Return the updated user document
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    // Delete the user document by ID
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

// Retrieve a single user by ID (excluding password)
export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password"); // Exclude password field

    res.status(200).json({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "No user found" });
  }
};

// Retrieve all users (excluding passwords)
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({
      success: true,
      message: "Users found",
      data: users,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

// Retrieve the profile info of the currently logged-in user
export const getUserProfile = async (req, res) => {
  const userId = req.userId; // Provided by auth middleware

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Exclude password from response
    const { password, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: 'Profile info retrieved',
      data: { ...rest }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong, cannot get"
    });
  }
};

// Retrieve all trainers booked by the currently logged-in user
export const getMyBookings = async (req, res) => {
  try {
    // Step 1: Retrieve bookings where user ID matches
    const bookings = await BookingSchema.find({ user: req.userId });

    // Step 2: Extract trainer IDs from each booking
    const trainerIds = bookings.map(el => el.trainer);

    // Step 3: Fetch trainer details using those IDs
    const trainers = await TrainerSchema.find({ _id: { $in: trainerIds } }).select("-password");

    res.status(200).json({
      success: true,
      message: "Bookings found",
      data: trainers
    });

  } catch {
    res.status(500).json({
      success: false,
      message: "Something went wrong, cannot get"
    });
  }
};