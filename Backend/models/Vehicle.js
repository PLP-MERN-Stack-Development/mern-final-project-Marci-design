const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['Matatu', 'Tro-Tro', 'Danfo', 'Other'],
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  features: [String],
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);