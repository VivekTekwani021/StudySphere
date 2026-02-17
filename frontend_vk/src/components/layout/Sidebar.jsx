import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  Map,
  Briefcase,
  User,
  LogOut,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Video
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { clsx } from 'clsx';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme(); // Always true now
  const location = useLocation();

  // Define menu sections
  const mainMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Learning Hub', icon: BookOpen, path: '/learning' },
    { name: 'Quiz', icon: HelpCircle, path: '/quiz' },
    { name: 'Study Rooms', icon: Video, path: '/study-rooms' },
  ];

  const trackingMenuItems = [
    { name: 'Attendance', icon: CalendarCheck, path: '/attendance' },
    { name: 'Roadmap', icon: Map, path: '/roadmap' },
  ];

  const otherMenuItems = [];

  // Show placement links for all college students
  if (user?.educationLevel === 'College') {
    otherMenuItems.push({ name: 'Placement', icon: Briefcase, path: '/placement' });
    otherMenuItems.push({ name: 'Resume Analysis', icon: User, path: '/placement/resume' });
  }

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;

    return (
      <NavLink
        to={item.path}
        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
        className={clsx(
          "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-orange-600/10 text-orange-500 shadow-sm border border-orange-500/10"
            : "text-gray-500 hover:bg-[#141414] hover:text-gray-200"
        )}
      >
        <div className={clsx(
          "p-1.5 rounded-lg transition-colors",
          isActive
            ? "bg-orange-600/10"
            : "bg-transparent group-hover:bg-[#1a1a1a]"
        )}>
          <item.icon className={clsx("w-4 h-4", isActive ? "text-orange-500" : "text-gray-500 group-hover:text-gray-300")} />
        </div>
        <span className="flex-1">{item.name}</span>
        {isActive && <ChevronRight className="w-4 h-4 text-orange-500/50" />}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-20 bg-black/80 backdrop-blur-sm transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-30 w-72 transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:inset-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "bg-black border-r border-[#1F1F1F]"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center gap-3 px-6 border-b border-[#1F1F1F]">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg shadow-orange-900/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              StudySphere
            </span>
          </div>

          {/* User Quick Info */}
          <div className="p-4 border-b border-[#1F1F1F]">
            <NavLink
              to="/profile"
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              className="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer bg-[#0A0A0A] border border-[#1F1F1F] hover:border-[#333] hover:bg-[#111] group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#1F1F1F] to-[#0A0A0A] border border-[#333] rounded-full flex items-center justify-center text-gray-300 font-bold text-lg shadow-inner group-hover:text-orange-500 transition-colors">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-gray-200 group-hover:text-white transition-colors">
                  {user?.name}
                </p>
                <p className="text-xs truncate text-gray-500">
                  {user?.educationLevel} Student
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </NavLink>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
            {/* Main Section */}
            <div>
              <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                Menu
              </p>
              <div className="space-y-1">
                {mainMenuItems.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
              </div>
            </div>

            {/* Tracking Section */}
            <div>
              <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                Tracking
              </p>
              <div className="space-y-1">
                {trackingMenuItems.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
              </div>
            </div>

            {/* Other Section */}
            {otherMenuItems.length > 0 && (
              <div>
                <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  Career
                </p>
                <div className="space-y-1">
                  {otherMenuItems.map((item) => (
                    <NavItem key={item.path} item={item} />
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-[#1F1F1F]">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all group text-gray-500 hover:bg-red-500/10 hover:text-red-400"
            >
              <div className="p-1.5 rounded-lg transition-colors bg-[#141414] group-hover:bg-red-500/20">
                <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
              </div>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
