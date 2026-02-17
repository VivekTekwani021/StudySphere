import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import CollegeAttendance from './CollegeAttendance';
import SchoolAttendance from './SchoolAttendance';
import { CalendarCheck, GraduationCap, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

const Attendance = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const isCollege = user?.educationLevel === 'College';

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-[#1F1F1F] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#1F1F1F] text-xs font-medium text-orange-500 mb-4">
              <CalendarCheck className="w-3 h-3" />
              <span>Daily Tracker</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">My Attendance</h1>
            <p className="text-gray-400">Track your daily progress and maintain your streaks.</p>
          </div>

          <div className="flex items-center gap-3 bg-[#141414] border border-[#1F1F1F] p-2 rounded-xl">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <GraduationCap className="w-5 h-5 text-orange-500" />
            </div>
            <div className="pr-4">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Current Mode</p>
              <p className="text-sm font-bold text-white">{isCollege ? 'College' : 'School'} Student</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {isCollege ? <CollegeAttendance /> : <SchoolAttendance />}
      </div>
    </div>
  );
};

export default Attendance;
