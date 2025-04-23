import express from 'express';
import Booking from '../models/Booking.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get all bookings for the logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('rides.ride', 'name image')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error getting bookings' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('rides.ride', 'name description image price thrillLevel duration')
      .populate('user', 'name email');
    
    // Check if booking exists
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Make sure the logged in user is the owner of the booking
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error getting booking' });
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { rides, totalAmount, paymentMethod, paymentId } = req.body;
    
    if (!rides || rides.length === 0) {
      return res.status(400).json({ message: 'No rides selected for booking' });
    }
    
    const booking = new Booking({
      user: req.user._id,
      rides,
      totalAmount,
      paymentMethod,
      paymentId,
      paymentStatus: paymentId ? 'Completed' : 'Pending'
    });
    
    const createdBooking = await booking.save();
    
    res.status(201).json(createdBooking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking status
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    
    const updatedBooking = await booking.save();
    
    res.json(updatedBooking);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error updating booking' });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel a booking
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Make sure the logged in user is the owner of the booking
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }
    
    // Check if booking is already completed
    if (booking.status === 'Completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed booking' });
    }
    
    booking.status = 'Cancelled';
    await booking.save();
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error cancelling booking' });
  }
});

// @route   GET /api/bookings/admin/all
// @desc    Get all bookings (admin only)
// @access  Private/Admin
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('rides.ride', 'name')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Admin get all bookings error:', error);
    res.status(500).json({ message: 'Server error getting all bookings' });
  }
});

export default router;