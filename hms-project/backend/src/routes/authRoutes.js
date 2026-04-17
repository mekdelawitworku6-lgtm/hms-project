import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

import {
  registerUser,
  loginUser,
} from '../controllers/authController.js';

const router = express.Router();

router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'Protected data accessed',
    user: req.user,
  });
});

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;