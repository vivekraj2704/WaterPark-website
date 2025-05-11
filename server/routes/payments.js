import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { protect } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import Order from '../models/Order.js';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key');

// @route   POST /api/payments/create-payment-intent
// @desc    Create a payment intent with Stripe
// @access  Private
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata } = req.body;
    
    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe requires amount in cents
      currency,
      metadata: {
        userId: req.user._id.toString(),
        ...metadata
      }
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ 
      message: 'Error creating payment intent',
      error: error.message 
    });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhook events
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const { userId } = paymentIntent.metadata;
        
        // Update all pending bookings and orders for this user
        await Promise.all([
          Booking.updateMany(
            { 
              user: userId,
              paymentId: paymentIntent.id,
              paymentStatus: 'Pending'
            },
            { 
              $set: { 
                paymentStatus: 'Completed',
                status: 'Confirmed'
              }
            }
          ),
          Order.updateMany(
            { 
              user: userId,
              paymentId: paymentIntent.id,
              paymentStatus: 'Pending'
            },
            { 
              $set: { 
                paymentStatus: 'Completed',
                status: 'Preparing'
              }
            }
          )
        ]);
        
        console.log('Payment succeeded and orders updated:', paymentIntent.id);
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const { userId } = paymentIntent.metadata;
        
        // Update all pending bookings and orders for this user
        await Promise.all([
          Booking.updateMany(
            { 
              user: userId,
              paymentId: paymentIntent.id,
              paymentStatus: 'Pending'
            },
            { 
              $set: { 
                paymentStatus: 'Failed',
                status: 'Cancelled'
              }
            }
          ),
          Order.updateMany(
            { 
              user: userId,
              paymentId: paymentIntent.id,
              paymentStatus: 'Pending'
            },
            { 
              $set: { 
                paymentStatus: 'Failed',
                status: 'Cancelled'
              }
            }
          )
        ]);
        
        console.log('Payment failed and orders updated:', paymentIntent.id);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

export default router;