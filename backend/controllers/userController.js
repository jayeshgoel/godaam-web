import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Signup function
export const signup = async (req, res) => {
  try {
    const { fullname, username, password, email, phoneNumber, officeAddress } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      fullname,        // Storing the full name
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      officeAddress,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login function with cookies
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and sign JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, // JWT secret from .env
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Set the token as a cookie
    res.cookie('auth_token', token, {
      httpOnly: true,  // Makes the cookie inaccessible to JavaScript (prevents XSS attacks)
      secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production (HTTPS)
      maxAge: 3600000,  // Cookie will expire in 1 hour
    });

    res.status(200).json({ message: 'Login successful' , success: true});
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Logout function
export const logout = (req, res) => {
  res.clearCookie('auth_token');  // Clear the auth_token cookie
  res.status(200).json({ message: 'Logged out successfully' });
};

// Controller to get logged-in user details
export const getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  try {
    // Find the user by ID from req.user
    const loggedInUser = await User.findById(req.user.userId);
    if (!loggedInUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send back the user details
    res.status(200).json(loggedInUser);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
};
