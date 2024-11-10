import express from 'express';
import { signup, login, logout, getProfile } from '../controllers/userController.js'; // Import signup and login functions
import { protect } from '../middleware/authMiddleware.js';  // Import protect middleware

const router = express.Router();

// Signup Route
router.post('/signup', signup);  // Use the signup function for the /signup route

// Login Route
router.post('/login', login);    // Use the login function for the /login route

// Protected Route Example

router.post('/logout', logout);

router.get('/profile', protect, getProfile);
export default router;
