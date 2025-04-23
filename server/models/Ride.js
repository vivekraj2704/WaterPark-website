import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  thrillLevel: {
    type: String,
    enum: ['Mild', 'Moderate', 'High', 'Extreme'],
    required: true
  },
  minHeight: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,  // in minutes
    required: true,
    min: 1
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Ride = mongoose.model('Ride', rideSchema);

export default Ride;