const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// All payment routes require authentication
router.use(auth);

// Get wallet balance
router.get('/balance', paymentController.getWalletBalance);

// Top up wallet
router.post('/topup', paymentController.topUpWallet);

// Add payment method
router.post('/methods', paymentController.addPaymentMethod);

// Get payment methods
router.get('/methods', paymentController.getPaymentMethods);

module.exports = router;