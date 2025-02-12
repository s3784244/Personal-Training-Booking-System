import express from "express";
import {
  updateTrainer,
  deleteTrainer,
  getAllTrainer,
  getSingleTrainer,
} from "../Controllers/trainerController.js";

const router = express.Router();

router.get("/:id", getSingleTrainer);
router.get("/", getAllTrainer);
router.put("/:id", updateTrainer);
router.delete("/:id", deleteTrainer);

export default router;
