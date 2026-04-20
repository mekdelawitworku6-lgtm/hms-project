import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// CREATE
const createPatient = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password || 'patient123', 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'patient',
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
const getPatientById = async (req, res) => {
  try {
    const patient = await User.findOne({ _id: req.params.id, role: 'patient' });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updatePatient = async (req, res) => {
  try {
    const patient = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
const deletePatient = async (req, res) => {
  try {
    const patient = await User.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};