import React, { useState, useEffect } from 'react';
import { Utensils, Filter, Search, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface FoodItem {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: 'Main Course' | 'Snacks' | 'Desserts' | 'Beverages';
  isVegetarian: boolean;
  preparationTime: number;
}

const FoodPage: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [dietFilter, setDietFilter] = useState<string>('All');
  
  const { addFood } = useCart();

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        const response = await api.get('/food');
        setFoodItems(response.data);
        setFilteredItems(response.data);
      } catch (error) {
        console.error('Error fetching food items:', error);
        toast.error('Failed to load food menu');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = foodItems;

    // Apply category filter
    if (categoryFilter !== 'All') {
      result = result.filter(item => item.category === categoryFilter);
    }

    // Apply diet filter
    if (dietFilter === 'Vegetarian') {
      result = result.filter(item => item.isVegetarian);
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        item => 
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );
    }

    setFilteredItems(result);
  }, [categoryFilter, dietFilter, searchTerm, foodItems]);

  const handleAddToCart = (food: FoodItem) => {
    addFood({
      _id: food._id,
      name: food.name,
      price: food.price,
      image: food.image,
      type: 'food'
    });
    toast.success(`${food.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Food & Drinks
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Refuel with our delicious selection of foods and beverages. From quick snacks to full meals, we have options to satisfy every craving.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search menu..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-primary-600" />
              <span className="text-gray-700 font-medium">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="All">All Categories</option>
                <option value="Main Course">Main Course</option>
                <option value="Snacks">Snacks</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-700 font-medium">Diet:</span>
              <select
                value={dietFilter}
                onChange={(e) => setDietFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="All">All</option>
                <option value="Vegetarian">Vegetarian</option>
              </select>
            </div>
          </div>
        </div>

        {/* Food Menu */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-10">
            <Utensils size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
                    <div className="flex space-x-2">
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}
                      >
                        {item.category}
                      </span>
                      {item.isVegetarian && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Veg
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-primary-600">${item.price.toFixed(2)}</p>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center space-x-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300"
                    >
                      <ShoppingCart size={16} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodPage;