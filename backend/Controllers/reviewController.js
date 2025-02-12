import Review from "../models/ReviewSchema.js";
import Trainer from "../models/TrainerSchema.js";

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}); // Fetch all reviews from the database

    res.status(200).json({ success: true, message: "Successful", data: reviews });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

// Create a new review
export const createReview = async (req, res) => {
  // If trainer ID is missing from the request body, set it from the request parameters
  if (!req.body.trainer) req.body.trainer = req.params.trainerId;
  
  // If user ID is missing from the request body, set it from the authenticated user's ID
  if (!req.body.user) req.body.user = req.userId;

  try {
     // ✅ Create a new review instance
     const newReview = new Review(req.body);
     
    // Save the new review to the database
    const savedReview = await newReview.save();
  
    // Update the trainer's document by adding the new review ID to the reviews array
    await Trainer.findByIdAndUpdate(req.body.trainer, {
      $push: { reviews: savedReview._id }
    });
  
    // Send a success response with the saved review data
    res.status(200).json({
      success: true,
      message: "Review submitted",
      data: savedReview
    });
  
  } catch (err) {
    // Handle errors and return a 500 status with the error message
    res.status(500).json({
      success: false,
      message: err.message
    });
  }  
};
