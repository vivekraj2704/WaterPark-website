import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen
          ? 'bg-white shadow-md text-gray-800'
          : 'bg-transparent text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={isScrolled || isOpen ? "#0ea5e9" : "#ffffff"} 
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
              <span className="font-display text-xl font-semibold">Splash Adventure</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium hover:text-primary-500 ${
                location.pathname === '/' ? 'text-primary-500' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/rides" 
              className={`px-3 py-2 rounded-md text-sm font-medium hover:text-primary-500 ${
                location.pathname.includes('/rides') ? 'text-primary-500' : ''
              }`}
            >
              Rides & Attractions
            </Link>
            <Link 
              to="/food" 
              className={`px-3 py-2 rounded-md text-sm font-medium hover:text-primary-500 ${
                location.pathname === '/food' ? 'text-primary-500' : ''
              }`}
            >
              Food & Drinks
            </Link>

            <div className="flex items-center space-x-4">
              <Link to="/checkout" className="relative">
                <ShoppingCart 
                  size={20} 
                  className={`${isScrolled ? 'text-gray-800' : 'text-white'} hover:text-primary-500`}
                />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative group">
                  <button 
                    className="flex items-center focus:outline-none"
                    aria-label="User menu"
                  >
                    <User size={20} className={`${isScrolled ? 'text-gray-800' : 'text-white'} hover:text-primary-500`} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-150 ease-in-out">
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={signOut}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/signin" 
                  className="px-4 py-2 rounded-md text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/checkout" className="relative">
              <ShoppingCart 
                size={20} 
                className={`${isScrolled ? 'text-gray-800' : 'text-white'} hover:text-primary-500`}
              />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
          >
            Home
          </Link>
          <Link
            to="/rides"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
          >
            Rides & Attractions
          </Link>
          <Link
            to="/food"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
          >
            Food & Drinks
          </Link>
          
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/signin"
              className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-gray-100"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;