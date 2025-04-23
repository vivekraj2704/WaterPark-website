import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedRides from '../components/home/FeaturedRides';
import Testimonials from '../components/home/Testimonials';
import { Link } from 'react-router-dom';
import { Clock, CalendarCheck, Ticket, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Ticket size={24} className="text-primary-600" />,
      title: "Unlimited Rides",
      description: "One ticket gives you access to all our attractions for the entire day."
    },
    {
      icon: <Clock size={24} className="text-primary-600" />,
      title: "Extended Hours",
      description: "Enjoy the park from morning until late evening during summer months."
    },
    {
      icon: <Users size={24} className="text-primary-600" />,
      title: "Group Discounts",
      description: "Special rates for families and groups of 5 or more people."
    },
    {
      icon: <CalendarCheck size={24} className="text-primary-600" />,
      title: "Season Passes",
      description: "Unlimited visits all season long with our affordable passes."
    }
  ];

  return (
    <div>
      <Hero />
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <FeaturedRides />
      
      {/* Promo Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Special Summer Discount
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Get 20% off when you book online for any weekday visit. Limited time offer for families looking to beat the heat this summer!
              </p>
              <Link
                to="/rides"
                className="inline-block px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition duration-300"
              >
                Book Now & Save
              </Link>
            </div>
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/1430673/pexels-photo-1430673.jpeg?auto=compress&cs=tinysrgb&w=1600" 
                alt="Family at water park" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      <Testimonials />
      
      {/* CTA Section */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
            Ready for the Adventure?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Dive into a world of excitement and fun. Book your visit today and create memories that will last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/rides"
              className="px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition duration-300"
            >
              View Attractions
            </Link>
            <Link
              to="/signup"
              className="px-8 py-3 bg-white text-primary-700 font-medium rounded-lg border border-primary-600 hover:bg-gray-50 transition duration-300"
            >
              Sign Up & Book
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;