const Passenger = require('../models/Passenger');
const { processMobileMoneyPayment } = require('../services/paymentService');

// Get wallet balance
const getWalletBalance = async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.user.id);
    
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    
    res.json({ balance: passenger.walletBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Top up wallet
const topUpWallet = async (req, res) => {
  try {
    const { amount, paymentMethod, paymentDetails } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    if (!paymentMethod || !paymentDetails) {
      return res.status(400).json({ message: 'Payment method and details are required' });
    }
    
    // Process mobile money payment
    const paymentResult = await processMobileMoneyPayment(
      paymentMethod,
      paymentDetails,
      amount
    );
    
    if (!paymentResult.success) {
      return res.status(400).json({ message: paymentResult.message });
    }
    
    // Update wallet balance
    const passenger = await Passenger.findByIdAndUpdate(
      req.user.id,
      { $inc: { walletBalance: amount } },
      { new: true }
    );
    
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    
    res.json({ 
      message: 'Wallet topped up successfully', 
      balance: passenger.walletBalance 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add payment method
const addPaymentMethod = async (req, res) => {
  try {
    const { type, identifier } = req.body;
    
    if (!type || !identifier) {
      return res.status(400).json({ message: 'Payment type and identifier are required' });
    }
    
    const passenger = await Passenger.findByIdAndUpdate(
      req.user.id,
      { $push: { paymentMethods: { type, identifier } } },
      { new: true }
    );
    
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    
    res.json({ 
      message: 'Payment method added successfully', 
      paymentMethods: passenger.paymentMethods 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment methods
const getPaymentMethods = async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.user.id);
    
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    
    res.json({ paymentMethods: passenger.paymentMethods });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWalletBalance,
  topUpWallet,
  addPaymentMethod,
  getPaymentMethods
};