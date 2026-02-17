import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useTheme } from '../../context/ThemeContext';
import { clsx } from 'clsx';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Theme is always dark now
  const isDark = true;

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar toggleSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-black scroll-smooth">
          <Outlet />

          {/* Footer */}
          <footer className="mt-12 py-8 text-center text-sm font-medium border-t border-[#1F1F1F] text-gray-600">
            <p>© {new Date().getFullYear()} StudySphere. Created by <span className="text-orange-500 font-bold hover:text-orange-400 transition-colors cursor-default">Vivek and Aayush</span>. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;
