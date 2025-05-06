/**
 * Handles operations related to reviews.
 *
 * Endpoints:
 * - GET /:     Fetches all reviews.
 * - POST /:    Creates a new review (clients only).
 */

import express from "express";
import { 
  getAllReviews, 
  createReview 
} from "../Controllers/reviewController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router({mergeParams: true});

// Define routes for handling reviews
router
  .route("/")
  // GET request to fetch all reviews
  .get(getAllReviews)
  // POST request to create a review (Only authenticated clients can create)
  .post(authenticate, restrict(["client"]), createReview);

export default router;
