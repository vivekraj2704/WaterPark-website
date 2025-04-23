import express from 'express';
import Ride from '../models/Ride.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/rides
// @desc    Get all rides
// @access  Public
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find({ isAvailable: true });
    res.json(rides);
  } catch (error) {
    console.error('Get rides error:', error);
    res.status(500).json({ message: 'Server error getting rides' });
  }
});

// @route   GET /api/rides/:id
// @desc    Get a single ride by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    res.json(ride);
  } catch (error) {
    console.error('Get ride error:', error);
    res.status(500).json({ message: 'Server error getting ride' });
  }
});

// @route   POST /api/rides
// @desc    Create a new ride
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      image, 
      price, 
      thrillLevel, 
      minHeight, 
      duration, 
      capacity 
    } = req.body;

    const ride = new Ride({
      name,
      description,
      image,
      price,
      thrillLevel,
      minHeight,
      duration,
      capacity
    });

    const createdRide = await ride.save();
    res.status(201).json(createdRide);
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({ message: 'Server error creating ride' });
  }
});

// @route   PUT /api/rides/:id
// @desc    Update a ride
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      image, 
      price, 
      thrillLevel, 
      minHeight, 
      duration, 
      capacity,
      isAvailable 
    } = req.body;

    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Update fields
    ride.name = name || ride.name;
    ride.description = description || ride.description;
    ride.image = image || ride.image;
    ride.price = price || ride.price;
    ride.thrillLevel = thrillLevel || ride.thrillLevel;
    ride.minHeight = minHeight || ride.minHeight;
    ride.duration = duration || ride.duration;
    ride.capacity = capacity || ride.capacity;
    ride.isAvailable = isAvailable !== undefined ? isAvailable : ride.isAvailable;

    const updatedRide = await ride.save();
    res.json(updatedRide);
  } catch (error) {
    console.error('Update ride error:', error);
    res.status(500).json({ message: 'Server error updating ride' });
  }
});

// @route   DELETE /api/rides/:id
// @desc    Delete a ride
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    await ride.deleteOne();
    res.json({ message: 'Ride removed' });
  } catch (error) {
    console.error('Delete ride error:', error);
    res.status(500).json({ message: 'Server error deleting ride' });
  }
});

export default router;