import User from '../models/User.js';
import Driver from '../models/Driver.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, licenseNumber } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Validate phone number for drivers (exactly 10 digits)
    if (role === 'driver') {
      if (!phone) {
        return res.status(400).json({ message: 'Phone number is required for drivers' });
      }
      const phoneRegex = /^[0-9]{10}$/;
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone: role === 'driver' ? phone.replace(/[^0-9]/g, '') : undefined,
    });

    // If registering as driver, also create driver record
    if (role === 'driver' && phone && licenseNumber) {
      await Driver.create({
        name,
        phone: phone.replace(/[^0-9]/g, ''),
        licenseNumber,
      });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await bcrypt.compare(password, user.password))) {
      // If user is a driver, fetch their driver record to get UID
      let driverUid = null;
      if (user.role === 'driver') {
        const driver = await Driver.findOne({ phone: user.phone });
        if (driver) {
          driverUid = driver.uid;
        }
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        driverUid,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    console.log('Update profile request for user ID:', req.user._id);
    console.log('Request body:', req.body);
    const user = await User.findById(req.user._id);

    if (user) {
      console.log('User found:', user.email);
      // Update phone number if provided
      if (req.body.phone !== undefined) {
        const phoneRegex = /^[0-9]{10}$/;
        const cleanPhone = req.body.phone.replace(/[^0-9]/g, '');
        if (!phoneRegex.test(cleanPhone)) {
          console.log('Invalid phone number format');
          return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
        }
        user.phone = cleanPhone;
        console.log('Phone updated to:', cleanPhone);
      }

      const updatedUser = await user.save();
      console.log('User saved successfully');

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        createdAt: updatedUser.createdAt,
      });
    } else {
      console.log('User not found with ID:', req.user._id);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
