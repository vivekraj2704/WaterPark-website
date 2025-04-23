import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Waves } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-50 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mb-8">
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, 0, -5, 0] 
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <Waves size={120} className="mx-auto text-primary-500" />
          </motion.div>
        </div>
        <h1 className="text-6xl font-display font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-display font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Looks like you've drifted into uncharted waters! The page you're looking for might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Home size={18} className="mr-2" />
            Back to Home
          </Link>
          <Link
            to="/rides"
            className="inline-flex items-center px-6 py-3 bg-white border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
          >
            Explore Rides
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;