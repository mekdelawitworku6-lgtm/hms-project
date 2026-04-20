import Appointment from "../models/Appointment.js";

const POPULATE_FIELDS = "name email role";

/* =========================
   CREATE APPOINTMENT
========================= */
export const createAppointment = async (req, res) => {
  try {
    console.log("📥 Appointment request from:", req.user.id);

    const { date, reason, doctor } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const patientId =
      req.user.role === "patient" ? req.user.id : req.body.patient;

    if (!patientId) {
      return res.status(400).json({ message: "Patient is required" });
    }

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctor || null,
      date,
      reason,
      status: doctor ? "approved" : "pending",
    });

    const created = await Appointment.findById(appointment._id).populate(
      "patient doctor",
      POPULATE_FIELDS
    );

    res.status(201).json(created);
  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET APPOINTMENTS
========================= */
export const getAppointments = async (req, res) => {
  try {
    let query = {};

    if (req.user?.role === "patient") {
      query.patient = req.user.id;
    }

    if (req.user?.role === "doctor") {
      query.doctor = req.user.id;
    }

    const appointments = await Appointment.find(query)
      .populate("patient doctor", POPULATE_FIELDS)
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   ASSIGN DOCTOR (ADMIN)
========================= */
export const assignDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor is required" });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.doctor = doctorId;
    appointment.status = "approved";

    await appointment.save();

    const updated = await Appointment.findById(appointment._id).populate(
      "patient doctor",
      POPULATE_FIELDS
    );

    res.json(updated);
  } catch (err) {
    console.log("ASSIGN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE STATUS (ADMIN / DOCTOR)
========================= */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    const updated = await Appointment.findById(appointment._id).populate(
      "patient doctor",
      POPULATE_FIELDS
    );

    res.json(updated);
  } catch (err) {
    console.log("STATUS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   COMPLETE APPOINTMENT (DOCTOR)
========================= */
export const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // doctor safety check
    if (
      req.user?.role === "doctor" &&
      String(appointment.doctor) !== String(req.user.id)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    appointment.status = "completed";
    await appointment.save();

    const updated = await Appointment.findById(appointment._id).populate(
      "patient doctor",
      POPULATE_FIELDS
    );

    res.json(updated);
  } catch (err) {
    console.log("COMPLETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};