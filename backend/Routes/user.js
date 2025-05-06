/**
 * Handles operations related to clients (users).
 *
 * Endpoints:
 * - GET /:id: Fetches a single user's details.
 * - GET /:     Fetches all users (admin-only).
 * - PUT /:id: Updates a user's details.
 * - DELETE /:id: Deletes a user.
 * - GET /profile/me: Fetches the logged-in user's profile.
 * - GET /bookings/my-bookings: Fetches the logged-in user's bookings.
 */

import express from "express";
import {
  updateUser,
  deleteUser,
  getAllUser,
  getSingleUser,
  getUserProfile,
  getMyBookings
} from "../Controllers/userController.js";

import { authenticate, restrict } from "../auth/verifyToken.js";
import { get } from "mongoose";

const router = express.Router();
router.get("/:id", authenticate, restrict(['client']), getSingleUser);
router.get("/", authenticate, restrict(['admin']), getAllUser);
router.put("/:id", authenticate, restrict(['client']), updateUser);
router.delete("/:id", authenticate, restrict(['client']), deleteUser);
router.get("/profile/me", authenticate, restrict(['client']), getUserProfile);
router.get("/bookings/my-bookings", authenticate, restrict(['client']), getMyBookings);


export default router;
