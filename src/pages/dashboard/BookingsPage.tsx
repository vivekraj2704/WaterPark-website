import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, AlertCircle, Check, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface Ride {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  thrillLevel: string;
  duration: number;
}

interface Booking {
  _id: string;
  rides: Array<{
    ride: Ride;
    date: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/bookings');
        setBookings(response.data);
        setFilteredBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = bookings;

    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(booking => booking.status === statusFilter);
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(booking => 
        booking.rides.some(ride => 
          ride.ride.name.toLowerCase().includes(term)
        ) ||
        booking._id.toLowerCase().includes(term)
      );
    }

    setFilteredBookings(result);
  }, [statusFilter, searchTerm, bookings]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await api.delete(`/bookings/${bookingId}`);
      
      // Update bookings list after cancel
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'Cancelled' } 
            : booking
        )
      );
      
      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600">
          View and manage your ride bookings
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-primary-600" />
          <span className="text-gray-700 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="All">All</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden text-center py-12 px-4"
        >
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'All' 
              ? 'Try adjusting your search or filter to find what you\'re looking for.'
              : 'You haven\'t made any ride bookings yet. Explore our attractions and book your first adventure!'}
          </p>
          {!searchTerm && statusFilter === 'All' && (
            <button
              onClick={() => window.location.href = '/rides'}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Explore Rides
            </button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking, index) => (
            <motion.div 
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">
                      Booking #{booking._id.substring(booking._id.length - 6)}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()} • {booking.rides.reduce((total, r) => total + r.quantity, 0)} tickets
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadgeClass(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="border-t border-b border-gray-200 py-4 my-4">
                  {booking.rides.map((ride, rideIndex) => (
                    <div key={rideIndex} className="flex flex-col sm:flex-row sm:items-center py-2">
                      <div className="flex items-center flex-1">
                        <img 
                          src={ride.ride.image} 
                          alt={ride.ride.name} 
                          className="w-16 h-16 object-cover rounded-md mr-4"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{ride.ride.name}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(ride.date).toLocaleDateString()} • {ride.quantity} {ride.quantity === 1 ? 'ticket' : 'tickets'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right mt-2 sm:mt-0">
                        <p className="font-medium text-primary-600">${ride.price.toFixed(2)} each</p>
                        <p className="text-sm text-gray-600">${(ride.price * ride.quantity).toFixed(2)} total</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-32">Payment Method:</span>
                      <span className="font-medium">{booking.paymentMethod}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-32">Total Amount:</span>
                      <span className="font-bold text-primary-600">${booking.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {booking.status === 'Confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XCircle size={18} className="mr-2" />
                      Cancel Booking
                    </button>
                  )}

                  {booking.status === 'Completed' && (
                    <div className="mt-4 md:mt-0 flex items-center text-green-600">
                      <Check size={18} className="mr-2" />
                      Completed
                    </div>
                  )}

                  {booking.status === 'Cancelled' && (
                    <div className="mt-4 md:mt-0 flex items-center text-red-600">
                      <AlertCircle size={18} className="mr-2" />
                      Cancelled
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;