// controllers/appointmentController.js

import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

// Patient books
export const createAppointment = async (req, res) => {
  try {
    const { date, reason } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Appointment date is required" });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      date,
      reason,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all (Admin / Doctor)
export const getAppointments = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "patient") {
      query.patient = req.user._id;
    }

    if (req.user.role === "doctor") {
      query.doctor = req.user._id;
    }

    const appointments = await Appointment.find(query)
      .populate("patient", "name email role")
      .populate("doctor", "name email role");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin assigns doctor
export const assignDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(400).json({ message: "doctorId is required" });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const doctor = await User.findById(doctorId);

    if (!doctor || doctor.role !== "doctor") {
      return res.status(400).json({ message: "Valid doctor account not found" });
    }

    appointment.doctor = doctorId;
    appointment.status = "approved";

    await appointment.save();

    const updatedAppointment = await appointment.populate("patient doctor", "name email role");
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Doctor completes
export const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (
      req.user.role === "doctor" &&
      appointment.doctor?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied for this appointment" });
    }

    appointment.status = "completed";
    await appointment.save();

    const updatedAppointment = await appointment.populate("patient doctor", "name email role");
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
