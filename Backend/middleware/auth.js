const jwt = require('jsonwebtoken');
const Passenger = require('../models/Passenger');
const Driver = require('../models/Driver');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the user is a passenger or driver
    let user = await Passenger.findById(decoded.id).select('-password');
    let userType = 'passenger';
    
    if (!user) {
      user = await Driver.findById(decoded.id).select('-password');
      userType = 'driver';
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    req.user = user;
    req.userType = userType;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};