import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, AlertCircle, Check, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface FoodItem {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  isVegetarian: boolean;
}

interface Order {
  _id: string;
  items: Array<{
    food: FoodItem;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders');
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = orders;

    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.items.some(item => 
          item.food.name.toLowerCase().includes(term) ||
          item.food.category.toLowerCase().includes(term)
        ) ||
        order._id.toLowerCase().includes(term)
      );
    }

    setFilteredOrders(result);
  }, [statusFilter, searchTerm, orders]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await api.delete(`/orders/${orderId}`);
      
      // Update orders list after cancel
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status: 'Cancelled' } 
            : order
        )
      );
      
      toast.success('Order cancelled successfully');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-600"></div>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ready for Pickup':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
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
        <h1 className="text-2xl font-bold text-gray-900">My Food Orders</h1>
        <p className="text-gray-600">
          View and manage your food orders
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
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-accent-600" />
          <span className="text-gray-700 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          >
            <option value="All">All</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready for Pickup">Ready for Pickup</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden text-center py-12 px-4"
        >
          <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'All' 
              ? 'Try adjusting your search or filter to find what you\'re looking for.'
              : 'You haven\'t placed any food orders yet. Explore our menu and place your first order!'}
          </p>
          {!searchTerm && statusFilter === 'All' && (
            <button
              onClick={() => window.location.href = '/food'}
              className="inline-flex items-center px-4 py-2 bg-accent-600 text-white rounded-md hover:bg-accent-700"
            >
              Explore Menu
            </button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order, index) => (
            <motion.div 
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">
                      Order #{order._id.substring(order._id.length - 6)}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} • {order.items.reduce((total, item) => total + item.quantity, 0)} items
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="border-t border-b border-gray-200 py-4 my-4">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex flex-col sm:flex-row sm:items-center py-2">
                      <div className="flex items-center flex-1">
                        <img 
                          src={item.food.image} 
                          alt={item.food.name} 
                          className="w-16 h-16 object-cover rounded-md mr-4"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{item.food.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {item.food.category}
                            </span>
                            {item.food.isVegetarian && (
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                Vegetarian
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right mt-2 sm:mt-0">
                        <p className="font-medium text-accent-600">${item.price.toFixed(2)} each</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x ${item.price.toFixed(2)} = ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-32">Payment Method:</span>
                      <span className="font-medium">{order.paymentMethod}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-32">Total Amount:</span>
                      <span className="font-bold text-accent-600">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {(order.status === 'Preparing' || order.status === 'Ready for Pickup') && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XCircle size={18} className="mr-2" />
                      Cancel Order
                    </button>
                  )}

                  {order.status === 'Delivered' && (
                    <div className="mt-4 md:mt-0 flex items-center text-green-600">
                      <Check size={18} className="mr-2" />
                      Delivered
                    </div>
                  )}

                  {order.status === 'Cancelled' && (
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

export default OrdersPage;