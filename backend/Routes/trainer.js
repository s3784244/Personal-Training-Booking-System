/**
 * Handles operations related to trainers.
 *
 * Endpoints:
 * - GET /:id: Fetches a single trainer's details.
 * - GET /:     Fetches all trainers.
 * - PUT /:id: Updates a trainer's details.
 * - DELETE /:id: Deletes a trainer.
 * - GET /profile/me: Fetches the logged-in trainer's profile.
 *
 * Nested Route:
 * - /reviews: Handles reviews related to a specific trainer.
 */

import express from "express";
import {
  updateTrainer,
  deleteTrainer,
  getAllTrainer,
  getSingleTrainer,
  getTrainerProfile
} from "../Controllers/trainerController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRouter from "./review.js";

const router = express.Router();

// IMPORTANT: Put specific routes BEFORE parameterized routes
router.get("/profile/me", authenticate, restrict(['trainer']), getTrainerProfile);

// Nested route for reviews
router.use("/:trainerId/reviews", reviewRouter);

// Public routes - parameterized routes should come AFTER specific ones
router.get("/", getAllTrainer); // This handles /api/v1/trainers
router.get("/:id", getSingleTrainer);

// Protected routes
router.put("/:id", authenticate, restrict(['trainer']), updateTrainer);
router.delete("/:id", authenticate, restrict(['trainer']), deleteTrainer);

export default router;
