import express from "express";
import Prescription from "../models/Prescription.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE
router.post("/", protect, async (req, res) => {
  try {
    const prescription = await Prescription.create({
      patient: req.body.patient,
      doctor: req.user.id,
      medicines: req.body.medicines,
      notes: req.body.notes,
    });

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL
router.get("/", protect, async (req, res) => {
  const data = await Prescription.find()
    .populate("patient", "name email")
    .populate("doctor", "name");

  res.json(data);
});

export default router;