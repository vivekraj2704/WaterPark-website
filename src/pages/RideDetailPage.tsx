import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Ruler, Users, AlertTriangle, Calendar, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface Ride {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  thrillLevel: 'Mild' | 'Moderate' | 'High' | 'Extreme';
  minHeight: number;
  duration: number;
  capacity: number;
}

const RideDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const { addRide } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRide = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/rides/${id}`);
        setRide(response.data);
      } catch (error) {
        console.error('Error fetching ride details:', error);
        toast.error('Failed to load ride details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRide();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!ride) return;

    addRide(
      {
        _id: ride._id,
        name: ride.name,
        price: ride.price,
        image: ride.image,
        type: 'ride'
      },
      selectedDate
    );

    toast.success(`${ride.name} added to cart!`);
  };

  const handleBookNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Ride Not Found</h1>
            <p className="text-gray-600 mb-8">The ride you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/rides')}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Rides
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format date options to prevent selecting past dates
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate end date (6 months from today)
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 6);
  const maxDate = endDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/rides')}
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Rides
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={ride.image}
              alt={ride.name}
              className="w-full h-80 lg:h-full object-cover"
            />
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">{ride.name}</h1>
              <span
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  ride.thrillLevel === 'Mild' ? 'bg-green-100 text-green-800' :
                  ride.thrillLevel === 'Moderate' ? 'bg-blue-100 text-blue-800' :
                  ride.thrillLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                {ride.thrillLevel}
              </span>
            </div>

            <p className="text-2xl font-semibold text-primary-600 mb-4">${ride.price.toFixed(2)} per person</p>

            <div className="prose prose-lg max-w-none text-gray-600 mb-6">
              <p>{ride.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-700 mb-1">
                  <Clock size={18} className="mr-2 text-primary-500" />
                  <span className="font-medium">Duration</span>
                </div>
                <p>{ride.duration} minutes</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-700 mb-1">
                  <Ruler size={18} className="mr-2 text-primary-500" />
                  <span className="font-medium">Min Height</span>
                </div>
                <p>{ride.minHeight} cm</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-700 mb-1">
                  <Users size={18} className="mr-2 text-primary-500" />
                  <span className="font-medium">Capacity</span>
                </div>
                <p>{ride.capacity} people</p>
              </div>
            </div>

            {ride.thrillLevel === 'High' || ride.thrillLevel === 'Extreme' ? (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">Safety Warning</h3>
                    <div className="text-sm text-amber-700">
                      <p>This is a {ride.thrillLevel.toLowerCase()} thrill level ride and may not be suitable for people with certain health conditions. Please check our safety guidelines before booking.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Booking Section */}
            <div className="border-t border-gray-200 pt-6 mt-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      min={today}
                      max={maxDate}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'ticket' : 'tickets'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBookNow}
                  className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 flex justify-center items-center"
                >
                  Book Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 border border-primary-600 text-primary-600 py-3 px-4 rounded-md font-medium hover:bg-primary-50 flex justify-center items-center"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Add to Cart
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RideDetailPage;