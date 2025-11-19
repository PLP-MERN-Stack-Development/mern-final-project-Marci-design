const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  walletBalance: {
    type: Number,
    default: 0
  },
  paymentMethods: [{
    type: {
      type: String,
      enum: ['M-Pesa', 'MTN MoMo', 'Other']
    },
    identifier: String
  }],
  tripHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }],
  savedLocations: [{
    name: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Passenger', passengerSchema);