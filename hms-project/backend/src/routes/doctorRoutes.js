import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from '../controllers/doctorController.js';

const router = express.Router();

// routes
router.post('/', protect, createDoctor);
router.get('/', protect, getDoctors);
router.get('/:id', protect, getDoctorById);
router.put('/:id', protect, updateDoctor);
router.delete('/:id', protect, deleteDoctor);

export default router;