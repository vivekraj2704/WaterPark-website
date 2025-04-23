import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
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
  category: {
    type: String,
    enum: ['Main Course', 'Snacks', 'Desserts', 'Beverages'],
    required: true
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,  // in minutes
    required: true,
    min: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Food = mongoose.model('Food', foodSchema);

export default Food;