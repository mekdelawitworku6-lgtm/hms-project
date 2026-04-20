import express from "express";
import User from "../models/User.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();


// 👨‍⚕️ GET DOCTORS
router.get("/doctors", protect, async (req, res) => {
  const doctors = await User.find({ role: "doctor" });
  res.json(doctors);
});


// 🗑️ DELETE DOCTOR
router.delete("/doctors/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✏️ UPDATE DOCTOR
router.put("/doctors/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.name = req.body.name || doctor.name;
    doctor.email = req.body.email || doctor.email;

    const updated = await doctor.save();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;