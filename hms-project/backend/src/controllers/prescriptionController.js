import Prescription from "../models/Prescription.js";

// Doctor creates prescription
export const createPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.create({
      patient: req.body.patient,
      doctor: req.user.id,
      appointment: req.body.appointment,
      medicines: req.body.medicines,
      notes: req.body.notes,
    });

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get prescriptions (patient/doctor/admin)
export const getPrescriptions = async (req, res) => {
  try {
    const data = await Prescription.find()
      .populate("patient", "name email")
      .populate("doctor", "name");

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};