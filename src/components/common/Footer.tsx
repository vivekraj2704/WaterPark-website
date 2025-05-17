import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#ffffff" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M2 4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2z"></path>
                <path d="M14 15v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2"></path>
                <path d="M2 6h18"></path>
                <path d="M22 10c.7 1.2.7 2.8 0 4a5.8 5.8 0 0 1-3 3.5c-1.3.6-2.7.6-4 0a5.8 5.8 0 0 1-3-3.5c-.7-1.2-.7-2.8 0-4 .6-1 1.7-1.8 3-2.2 1.3-.4 2.7-.4 4 0 1.3.4 2.4 1.2 3 2.2Z"></path>
                <circle cx="18" cy="12" r="1"></circle>
              </svg>
              <span className="font-display text-xl font-semibold">AquaSplash</span>
            </Link>
            <p className="text-gray-300">
              The ultimate water park experience for the whole family. Enjoy thrilling rides, delicious food, and create unforgettable memories.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/rides" className="text-gray-300 hover:text-white">Rides & Attractions</Link>
              </li>
              <li>
                <Link to="/food" className="text-gray-300 hover:text-white">Food & Drinks</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-300">Monday - Friday</span>
                <span>10:00 - 21:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">Saturday</span>
                <span>09:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">Sunday</span>
                <span>09:00 - 21:00</span>
              </li>
              <li className="pt-2">
                <div className="text-accent-400 font-medium">
                  Special Holiday Hours May Apply
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0 text-primary-400" />
                <span className="text-gray-300">
                  123 Splash Avenue, Watertown, WP 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0 text-primary-400" />
                <span className="text-gray-300">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0 text-primary-400" />
                <span className="text-gray-300">info@splashadventure.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} AquaSplash Water Park. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link to="/privacy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;