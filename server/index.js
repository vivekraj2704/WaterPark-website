import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import rideRoutes from './routes/rides.js';
import foodRoutes from './routes/food.js';
import bookingRoutes from './routes/bookings.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const startServer = async () => {
  try {
    if (process.env.MONGODB_URI) {
      console.log(process.env.MONGODB_URI)
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
      
      // Routes that require MongoDB
      app.use('/api/auth', authRoutes);
      app.use('/api/rides', rideRoutes);
      app.use('/api/food', foodRoutes);
      app.use('/api/bookings', bookingRoutes);
      app.use('/api/orders', orderRoutes);
      app.use('/api/payments', paymentRoutes);
    } else {
      console.log('No MongoDB URI provided, starting server without database connection');
      
      // Fallback routes for when no database is connected
      app.use('/api/*', (req, res) => {
        res.status(503).json({ message: 'Database service unavailable' });
      });
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: err.message || 'Something went wrong on the server',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

startServer();