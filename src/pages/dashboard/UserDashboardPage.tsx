import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ShoppingBag, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { motion } from 'framer-motion';

interface Booking {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  rides: Array<{
    ride: {
      _id: string;
      name: string;
      image: string;
    };
    date: string;
    quantity: number;
  }>;
}

interface Order {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
}

const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalOrders: 0,
    upcomingBookings: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get recent bookings
        const bookingsResponse = await api.get('/bookings');
        setRecentBookings(bookingsResponse.data.slice(0, 3));
        
        // Get recent orders
        const ordersResponse = await api.get('/orders');
        setRecentOrders(ordersResponse.data.slice(0, 3));
        
        // Calculate stats
        setStats({
          totalBookings: bookingsResponse.data.length,
          totalOrders: ordersResponse.data.length,
          upcomingBookings: bookingsResponse.data.filter(
            (booking: Booking) => 
              booking.status !== 'Completed' && 
              booking.status !== 'Cancelled'
          ).length,
          totalSpent: [...bookingsResponse.data, ...ordersResponse.data].reduce(
            (total: number, item: Booking | Order) => total + item.totalAmount, 
            0
          ),
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your activity and upcoming adventures.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
              <Calendar size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Bookings</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
          <p className="text-sm text-gray-500">Total ride bookings</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center mr-3">
              <ShoppingBag size={20} className="text-accent-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
          <p className="text-sm text-gray-500">Total food orders</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <Clock size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Upcoming</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.upcomingBookings}</p>
          <p className="text-sm text-gray-500">Upcoming rides</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Spent</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Total amount spent</p>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          {recentBookings.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      {booking.rides[0]?.ride.name} 
                      {booking.rides.length > 1 ? ` +${booking.rides.length - 1} more` : ''}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                    <span className="font-medium text-primary-600">
                      ${booking.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No bookings found. Ready to book your first ride?
            </div>
          )}
          <div className="px-6 py-3 bg-gray-50">
            <Link 
              to="/dashboard/bookings" 
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View all bookings
            </Link>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Food Orders</h2>
          </div>
          {recentOrders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <div key={order._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      Order #{order._id.substring(order._id.length - 6)}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Ready for Pickup' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="font-medium text-primary-600">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No food orders yet. Hungry for something delicious?
            </div>
          )}
          <div className="px-6 py-3 bg-gray-50">
            <Link 
              to="/dashboard/orders" 
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View all orders
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 bg-primary-50 rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            to="/rides"
            className="bg-white rounded-lg p-4 flex items-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
              <Calendar size={20} className="text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Book a Ride</h3>
              <p className="text-sm text-gray-500">Explore available attractions</p>
            </div>
          </Link>
          
          <Link
            to="/food"
            className="bg-white rounded-lg p-4 flex items-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center mr-3">
              <ShoppingBag size={20} className="text-accent-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Order Food</h3>
              <p className="text-sm text-gray-500">Browse our delicious menu</p>
            </div>
          </Link>
          
          <Link
            to="/dashboard/profile"
            className="bg-white rounded-lg p-4 flex items-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <Calendar size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">My Profile</h3>
              <p className="text-sm text-gray-500">Update your information</p>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboardPage;