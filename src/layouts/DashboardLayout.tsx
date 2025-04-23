import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingBasket, 
  User,
  Menu, 
  X, 
  LogOut,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const navItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: '/dashboard/bookings',
      name: 'My Bookings',
      icon: <Calendar size={20} />,
    },
    {
      path: '/dashboard/orders',
      name: 'My Orders',
      icon: <ShoppingBasket size={20} />,
    },
    {
      path: '/dashboard/profile',
      name: 'Profile',
      icon: <User size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <Link to="/" className="flex items-center space-x-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#0ea5e9" 
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
              <span className="text-primary-600 font-medium">Splash Adventure</span>
            </Link>
            <button 
              onClick={closeSidebar}
              className="lg:hidden focus:outline-none"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* User info */}
          <div className="border-b px-6 py-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center rounded-lg px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 ${
                      location.pathname === item.path
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : ''
                    }`}
                    onClick={closeSidebar}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="border-t px-6 py-4">
            <button
              onClick={signOut}
              className="flex w-full items-center rounded-lg px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={20} className="mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <button
              onClick={toggleSidebar}
              className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
            >
              <Menu size={24} className="text-gray-600" />
            </button>
            <div className="flex items-center">
              <Link 
                to="/"
                className="px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                Back to Website
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;