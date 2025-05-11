import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-white to-blue-50 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold text-gray-900"
        >
          Make a Splash at <span className="text-blue-600">AquaSplash</span> Waterpark
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 text-lg sm:text-xl text-gray-600"
        >
          Experience the ultimate water adventure with thrilling slides, relaxing pools, and family-friendly attractions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 flex justify-center gap-4 flex-wrap"
        >
          <Link
            to="/rides"
            className="px-6 py-3 rounded-md bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
          >
            Explore Rides
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 rounded-md bg-white border border-gray-300 text-gray-900 font-medium hover:bg-gray-100 transition"
          >
            Book Now
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-12 max-w-5xl mx-auto"
      >
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <img
            src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/a7/24/14/caption.jpg?w=1200&h=-1&s=1"
            alt="Waterpark Slide"
            className="w-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
