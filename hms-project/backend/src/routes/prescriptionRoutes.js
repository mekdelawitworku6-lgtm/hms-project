import express from "express";
import {
  createPrescription,
  getPrescriptions,
} from "../controllers/prescriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPrescription);
router.get("/", protect, getPrescriptions);

export default router;
