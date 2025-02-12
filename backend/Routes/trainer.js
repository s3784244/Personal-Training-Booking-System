import express from "express";
import {
  updateTrainer,
  deleteTrainer,
  getAllTrainer,
  getSingleTrainer,
} from "../Controllers/trainerController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRouter from "./review.js";

const router = express.Router();

// nested route
router.use("/:trainerId/reviews", reviewRouter);

router.get("/:id", getSingleTrainer);
router.get("/", getAllTrainer);
router.put("/:id", authenticate, restrict(['trainer']), updateTrainer);
router.delete("/:id", authenticate, restrict(['trainer']), deleteTrainer);

export default router;
