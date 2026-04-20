// routes/appointmentRoutes.js

import express from "express";
import {
  createAppointment,
  getAppointments,
  assignDoctor,
  updateAppointmentStatus,
  completeAppointment,
} from "../controllers/appointmentController.js";

import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("patient", "admin"), createAppointment);
router.get("/", protect, getAppointments);
router.put("/:id/assign", protect, authorizeRoles("admin"), assignDoctor);
router.patch("/:id/status", protect, authorizeRoles("admin"), updateAppointmentStatus);
router.put("/:id/complete", protect, authorizeRoles("doctor", "admin"), completeAppointment);

export default router;
