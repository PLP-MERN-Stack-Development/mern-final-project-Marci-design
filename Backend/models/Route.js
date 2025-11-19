const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
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
  waypoints: [{
    name: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  }],
  fare: {
    type: Number,
    required: true
  },
  estimatedDuration: {
    type: Number, // in minutes
    required: true
  },
  vehicles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Route', routeSchema);