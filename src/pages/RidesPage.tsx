import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Waves, Filter, Search } from 'lucide-react';
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
}

const RidesPage: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        const response = await api.get('/rides');
        setRides(response.data);
        setFilteredRides(response.data);
      } catch (error) {
        console.error('Error fetching rides:', error);
        toast.error('Failed to load rides');
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = rides;

    // Apply thrill level filter
    if (filter !== 'All') {
      result = result.filter(ride => ride.thrillLevel === filter);
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        ride => 
          ride.name.toLowerCase().includes(term) ||
          ride.description.toLowerCase().includes(term)
      );
    }

    setFilteredRides(result);
  }, [filter, searchTerm, rides]);

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
            Rides & Attractions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our thrilling rides and attractions suitable for all ages. From heart-pounding water slides to relaxing pools, we have something for everyone.
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
                placeholder="Search rides..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-primary-600" />
            <span className="text-gray-700 font-medium">Filter by Thrill Level:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="All">All Levels</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
              <option value="Extreme">Extreme</option>
            </select>
          </div>
        </div>

        {/* Rides Grid */}
        {filteredRides.length === 0 ? (
          <div className="text-center py-10">
            <Waves size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No rides found</h3>
            <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRides.map((ride, index) => (
              <motion.div
                key={ride._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="h-56 overflow-hidden">
                  <img 
                    src={ride.image} 
                    alt={ride.name} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-900">{ride.name}</h2>
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ride.thrillLevel === 'Mild' ? 'bg-green-100 text-green-800' :
                        ride.thrillLevel === 'Moderate' ? 'bg-blue-100 text-blue-800' :
                        ride.thrillLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {ride.thrillLevel}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{ride.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Duration: {ride.duration} min</p>
                      <p className="text-sm text-gray-500">Min Height: {ride.minHeight} cm</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary-600">${ride.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <Link
                    to={`/rides/${ride._id}`}
                    className="mt-4 block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RidesPage;