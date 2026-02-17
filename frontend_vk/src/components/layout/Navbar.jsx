import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { clsx } from 'clsx';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  // Always dark
  const isDark = true;

  return (
    <header className="h-16 border-b border-[#1F1F1F] shadow-sm flex items-center justify-between px-4 lg:px-8 z-10 transition-colors duration-200 bg-black">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md transition-colors text-gray-400 hover:text-white hover:bg-[#141414]"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-white">
              {user?.name}
            </p>
            <p className="text-xs capitalize text-gray-500">
              {user?.educationLevel || 'Student'}
            </p>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold shadow-md shadow-orange-900/20 border border-orange-500/20">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
