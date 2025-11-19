const express = require('express');
const router = express.Router();
const {
  registerPassenger,
  loginPassenger,
  registerDriver,
  loginDriver,
} = require('../controllers/authController');

// Register a new passenger
router.post('/register', registerPassenger);

// Login passenger
router.post('/login', loginPassenger);

// Register a new driver
router.post('/register/driver', registerDriver);

// Login driver
router.post('/login/driver', loginDriver);

module.exports = router;