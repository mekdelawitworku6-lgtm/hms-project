import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// CREATE DOCTOR
const createDoctor = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password || 'doctor123', 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'doctor',
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL DOCTORS
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE DOCTOR
const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE DOCTOR
const updateDoctor = async (req, res) => {
  try {
    const doctor = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// DELETE DOCTOR
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await User.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
