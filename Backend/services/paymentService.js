const Passenger = require('../models/Passenger');

// Process payment for ticket purchase
const processPayment = async (passengerId, amount, paymentMethod) => {
  try {
    const passenger = await Passenger.findById(passengerId);
    
    if (!passenger) {
      return { success: false, message: 'Passenger not found' };
    }
    
    if (paymentMethod === 'In-App Wallet') {
      if (passenger.walletBalance < amount) {
        return { success: false, message: 'Insufficient wallet balance' };
      }
      
      // Deduct from wallet
      await Passenger.findByIdAndUpdate(
        passengerId,
        { $inc: { walletBalance: -amount } }
      );
      
      return { success: true, message: 'Payment processed successfully' };
    } else if (paymentMethod === 'Mobile Money') {
      
      return { success: true, message: 'Mobile money payment processed successfully' };
    } else if (paymentMethod === 'Cash') {
      // Cash payments are processed on-board
      return { success: true, message: 'Cash payment will be processed on-board' };
    } else {
      return { success: false, message: 'Invalid payment method' };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Process mobile money payment for wallet top-up
const processMobileMoneyPayment = async (paymentMethod, paymentDetails, amount) => {
  try {
    // In a real app, this would integrate with mobile money APIs like M-Pesa, MTN MoMo, etc.
    // For now, we'll simulate a successful payment
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success response
    return { success: true, message: 'Mobile money payment processed successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  processPayment,
  processMobileMoneyPayment
};