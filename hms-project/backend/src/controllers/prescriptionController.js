import Prescription from "../models/Prescription.js";
import Appointment from "../models/Appointment.js";

export const createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, notes } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment is required" });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (String(appointment.doctor) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not your appointment" });
    }

    const existingPrescription = await Prescription.findOne({ appointment: appointmentId });

    if (existingPrescription) {
      return res.status(400).json({ message: "Prescription already exists for this appointment" });
    }

    const prescription = await Prescription.create({
      appointment: appointmentId,
      patient: appointment.patient,
      doctor: req.user.id,
      medicines: Array.isArray(medicines) ? medicines : [],
      notes,
    });

    const populated = await Prescription.findById(prescription._id)
      .populate("patient", "name email role")
      .populate("doctor", "name email role")
      .populate({
        path: "appointment",
        populate: [
          { path: "patient", select: "name email role" },
          { path: "doctor", select: "name email role" },
        ],
      });

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPrescriptions = async (req, res) => {
  try {
    const query = {};

    if (req.user.role === "patient") {
      query.patient = req.user.id;
    } else if (req.user.role === "doctor") {
      query.doctor = req.user.id;
    }

    const prescriptions = await Prescription.find(query)
      .populate("patient", "name email role")
      .populate("doctor", "name email role")
      .populate({
        path: "appointment",
        populate: [
          { path: "patient", select: "name email role" },
          { path: "doctor", select: "name email role" },
        ],
      })
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
