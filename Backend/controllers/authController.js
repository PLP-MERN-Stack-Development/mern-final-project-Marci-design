const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Passenger = require('../models/Passenger');
const Driver = require('../models/Driver');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new passenger
// @route   POST /api/auth/register
// @access  Public
const registerPassenger = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check if passenger exists
    const passengerExists = await Passenger.findOne({ email });
    if (passengerExists) {
      return res.status(400).json({ message: 'Passenger already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create passenger
    const passenger = await Passenger.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    if (passenger) {
      res.status(201).json({
        _id: passenger._id,
        name: passenger.name,
        email: passenger.email,
        token: generateToken(passenger._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid passenger data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth passenger & get token
// @route   POST /api/auth/login
// @access  Public
const loginPassenger = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check for passenger email
    const passenger = await Passenger.findOne({ email });

    if (passenger && (await bcrypt.compare(password, passenger.password))) {
      res.json({
        _id: passenger._id,
        name: passenger.name,
        email: passenger.email,
        token: generateToken(passenger._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new driver
// @route   POST /api/auth/register/driver
// @access  Public
const registerDriver = async (req, res) => {
  try {
    const { name, email, phone, password, vehicleInfo } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check if driver exists
    const driverExists = await Driver.findOne({ email });
    if (driverExists) {
      return res.status(400).json({ message: 'Driver already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create driver
    const driver = await Driver.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    if (driver) {
      res.status(201).json({
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        token: generateToken(driver._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid driver data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth driver & get token
// @route   POST /api/auth/login/driver
// @access  Public
const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check for driver email
    const driver = await Driver.findOne({ email });

    if (driver && (await bcrypt.compare(password, driver.password))) {
      res.json({
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        token: generateToken(driver._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerPassenger,
  loginPassenger,
  registerDriver,
  loginDriver,
};