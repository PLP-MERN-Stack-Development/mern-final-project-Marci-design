const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Passenger',
    required: true
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  origin: {
    name: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  destination: {
    name: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  fare: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Mobile Money', 'In-App Wallet', 'Cash'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  status: {
    type: String,
    enum: ['Active', 'Used', 'Expired'],
    default: 'Active'
  },
  validUntil: {
    type: Date,
    required: true
  },
  qrCode: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);