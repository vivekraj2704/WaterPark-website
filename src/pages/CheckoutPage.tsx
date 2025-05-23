import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Calendar, Info } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import StripePaymentForm from '../components/payment/StripePaymentForm';

const CheckoutPage: React.FC = () => {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const rideItems = items.filter(item => item.type === 'ride');
  const foodItems = items.filter(item => item.type === 'food');
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast.success('Item removed from cart');
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      setLoading(true);

      // Process rides if any
      if (rideItems.length > 0) {
        const formattedRides = rideItems.map(item => ({
          ride: item._id,
          date: 'date' in item ? item.date : new Date().toISOString().split('T')[0],
          quantity: item.quantity,
          price: item.price
        }));

        const rideTotal = rideItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await api.post('/bookings', {
          rides: formattedRides,
          totalAmount: rideTotal,
          paymentMethod,
          paymentId
        });
      }

      // Process food items if any
      if (foodItems.length > 0) {
        const formattedFoodItems = foodItems.map(item => ({
          food: item._id,
          quantity: item.quantity,
          price: item.price
        }));

        const foodTotal = foodItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await api.post('/orders', {
          items: formattedFoodItems,
          totalAmount: foodTotal,
          paymentMethod,
          paymentId
        });
      }

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.');
  };

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some exciting rides or delicious food to your cart!</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/rides')}
                className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Browse Rides
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/food')}
                className="px-6 py-3 bg-accent-500 text-white rounded-md hover:bg-accent-600 transition-colors"
              >
                Browse Food
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="mb-4">You need to be signed in to complete your purchase.</p>
          <button
            onClick={() => navigate('/signin')}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-display font-bold text-gray-900 mb-8"
        >
          Your Cart
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                {rideItems.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Calendar size={20} className="mr-2 text-primary-600" />
                      Ride Bookings
                    </h2>
                    <div className="divide-y divide-gray-200">
                      {rideItems.map((item) => (
                        <motion.div 
                          key={item._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="py-4 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-4">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-20 h-20 object-cover rounded-md"
                            />
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-500">
                                {'date' in item ? `Date: ${new Date(item.date).toLocaleDateString()}` : ''}
                              </p>
                              <p className="text-primary-600 font-medium">${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button 
                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-1">{item.quantity}</span>
                              <button 
                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemoveItem(item._id)}
                              className="text-red-500 hover:text-red-700"
                              aria-label="Remove item"
                            >
                              <Trash2 size={20} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {foodItems.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <ShoppingCart size={20} className="mr-2 text-accent-500" />
                      Food & Drinks
                    </h2>
                    <div className="divide-y divide-gray-200">
                      {foodItems.map((item) => (
                        <motion.div 
                          key={item._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="py-4 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-4">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-20 h-20 object-cover rounded-md"
                            />
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                              <p className="text-primary-600 font-medium">${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button 
                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-1">{item.quantity}</span>
                              <button 
                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemoveItem(item._id)}
                              className="text-red-500 hover:text-red-700"
                              aria-label="Remove item"
                            >
                              <Trash2 size={20} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h2>
                <StripePaymentForm
                  amount={totalPrice}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;