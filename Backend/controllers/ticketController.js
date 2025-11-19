const Ticket = require('../models/Ticket');
const Route = require('../models/Route');
const Vehicle = require('../models/Vehicle');
const Passenger = require('../models/Passenger');
const { processPayment } = require('../services/paymentService');
const { generateQRCode } = require('../utils/qrCode');

// Purchase a ticket
const purchaseTicket = async (req, res) => {
  try {
    const { routeId, vehicleId, origin, destination, paymentMethod } = req.body;
    
    if (!routeId || !vehicleId || !origin || !destination || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Get route details
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    
    // Get vehicle details
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Calculate fare (in a real app, this might be more complex based on distance)
    const fare = route.fare;
    
    // Process payment
    const paymentResult = await processPayment(
      req.user.id,
      fare,
      paymentMethod
    );
    
    if (!paymentResult.success) {
      return res.status(400).json({ message: paymentResult.message });
    }
    
    // Create ticket
    const ticket = new Ticket({
      passenger: req.user.id,
      route: routeId,
      vehicle: vehicleId,
      origin,
      destination,
      fare,
      paymentMethod,
      paymentStatus: 'Completed',
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // Valid for 24 hours
    });
    
    // Generate QR code for the ticket
    ticket.qrCode = await generateQRCode(ticket._id.toString());
    
    const savedTicket = await ticket.save();
    
    // Update passenger trip history
    await Passenger.findByIdAndUpdate(
      req.user.id,
      { $push: { tripHistory: savedTicket._id } }
    );
    
    res.status(201).json(savedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user tickets
const getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ passenger: req.user.id })
      .populate('route')
      .populate('vehicle')
      .sort({ createdAt: -1 });
    
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ticket by ID
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = await Ticket.findById(id)
      .populate('route')
      .populate('vehicle');
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Check if the ticket belongs to the current user
    if (ticket.passenger.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this ticket' });
    }
    
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Validate ticket
const validateTicket = async (req, res) => {
  try {
    const { qrCode } = req.body;
    
    if (!qrCode) {
      return res.status(400).json({ message: 'QR code is required' });
    }
    
    const ticket = await Ticket.findOne({ qrCode })
      .populate('route')
      .populate('vehicle');
    
    if (!ticket) {
      return res.status(404).json({ message: 'Invalid ticket' });
    }
    
    // Check if ticket is still valid
    if (ticket.status !== 'Active' || new Date() > ticket.validUntil) {
      return res.status(400).json({ message: 'Ticket is no longer valid' });
    }
    
    // Mark ticket as used
    ticket.status = 'Used';
    await ticket.save();
    
    res.json({ message: 'Ticket validated successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  purchaseTicket,
  getUserTickets,
  getTicketById,
  validateTicket
};