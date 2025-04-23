import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Calendar, Info } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

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

  const handleProcessPayment = async () => {
    if (!user) {
      toast.error('Please sign in to complete your purchase');
      navigate('/signin');
      return;
    }

    try {
      setIsProcessingPayment(true);
      
      // Here we would typically integrate with Stripe Payment Intent API
      // For demo purposes, we'll just simulate a payment process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // After successful payment, process the order
      await handleCheckout();
      
      setIsProcessingPayment(false);
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Payment processing failed. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

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
          paymentId: 'stripe_simulated_' + Date.now()
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
          paymentId: 'stripe_simulated_' + Date.now()
        });
      }

      toast.success('Your order has been placed successfully!');
      clearCart();
      navigate('/dashboard');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process your order. Please try again.');
    } finally {
      setLoading(false);
    }
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

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {rideItems.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rides Subtotal</span>
                      <span className="font-medium">
                        ${rideItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  {foodItems.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Food Subtotal</span>
                      <span className="font-medium">
                        ${foodItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Method</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer bg-gray-50">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="Credit Card"
                        checked={paymentMethod === 'Credit Card'} 
                        onChange={() => setPaymentMethod('Credit Card')}
                        className="h-4 w-4 text-primary-600"
                      />
                      <CreditCard size={20} className="text-primary-600" />
                      <span>Credit Card</span>
                    </label>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md mb-6 flex items-start">
                  <Info size={20} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    This is a demo implementation. In a real application, this would integrate with Stripe for secure payment processing.
                  </p>
                </div>
                
                {user ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProcessPayment}
                    disabled={loading || isProcessingPayment}
                    className={`w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium transition-colors ${
                      loading || isProcessingPayment ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700'
                    }`}
                  >
                    {isProcessingPayment ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Payment...
                      </span>
                    ) : loading ? (
                      'Processing Order...'
                    ) : (
                      'Complete Purchase'
                    )}
                  </motion.button>
                ) : (
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/signin')}
                      className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 transition-colors"
                    >
                      Sign In to Continue
                    </motion.button>
                    <p className="text-sm text-gray-600 text-center">
                      You need to be signed in to complete your purchase
                    </p>
                  </div>
                )}
                
                <button
                  onClick={() => navigate(-1)}
                  className="w-full mt-4 text-primary-600 py-2 px-4 rounded-md font-medium hover:bg-primary-50 transition-colors text-center"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;