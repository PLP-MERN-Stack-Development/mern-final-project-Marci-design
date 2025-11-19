const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ticketController = require('../controllers/ticketController');

// All ticket routes require authentication
router.use(auth);

// Purchase a ticket
router.post('/', ticketController.purchaseTicket);

// Get user tickets
router.get('/', ticketController.getUserTickets);

// Get ticket by ID
router.get('/:id', ticketController.getTicketById);

// Validate ticket (for drivers)
router.post('/validate', ticketController.validateTicket);

module.exports = router;