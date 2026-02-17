import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // Although isDark is always true now
import {
  User, Shield, Mail, GraduationCap, Calendar,
  TrendingUp, Award, LogOut, Settings, Edit3,
  BookOpen, CheckCircle, Flame, Target, ChevronRight,
  Sparkles
} from 'lucide-react';
import { attendanceApi } from '../../api/attendance.api';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, logout } = useAuth();
  // Enforce dark mode
  const isDark = true;

  const [stats, setStats] = useState({
    attendancePercentage: 0,
    totalSubjects: 0,
    streak: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await attendanceApi.getHistory();
      if (response && response.found) {
        if (response.type === 'college') {
          const subjects = response.subjects || [];
          const avgPercentage = subjects.length > 0
            ? Math.round(subjects.reduce((acc, s) => acc + s.percentage, 0) / subjects.length)
            : 0;
          setStats({
            attendancePercentage: avgPercentage,
            totalSubjects: subjects.length,
            streak: 0
          });
        } else {
          const history = response.data || [];
          const presentDays = history.filter(h => h.status === 'Present').length;
          const percentage = history.length > 0 ? Math.round((presentDays / history.length) * 100) : 0;
          setStats({
            attendancePercentage: percentage,
            totalSubjects: history.length,
            streak: response.streak || 0
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
      toast.success('Signed out successfully');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">
      <motion.div
        className="max-w-5xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">My Profile</h1>
            <p className="text-gray-500">Manage your account settings and preferences</p>
          </div>
        </motion.div>

        {/* Main Profile Card */}
        <motion.div
          variants={itemVariants}
          className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-8 relative overflow-hidden group"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group/avatar">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-5xl font-bold text-white shadow-2xl shadow-orange-900/20 ring-4 ring-black">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <button className="absolute -bottom-3 -right-3 p-2.5 rounded-xl bg-[#141414] border border-[#1F1F1F] text-gray-400 hover:text-white hover:border-orange-500/50 hover:bg-[#1F1F1F] transition-all shadow-lg">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                Active
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6 w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1F1F1F] pb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{user?.name}</h2>
                  <p className="text-gray-500 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="px-4 py-2 rounded-xl bg-[#141414] border border-[#1F1F1F] flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-300">{user?.educationLevel} Student</span>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-[#141414] border border-[#1F1F1F] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-300">Joined {new Date().getFullYear()}</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#141414] border border-[#1F1F1F] hover:border-orange-500/30 transition-colors group/stat">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Attendance</span>
                  </div>
                  <div className="text-2xl font-bold text-white group-hover/stat:text-orange-500 transition-colors">
                    {stats.attendancePercentage}%
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#141414] border border-[#1F1F1F] hover:border-orange-500/30 transition-colors group/stat">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                      <Flame className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Streak</span>
                  </div>
                  <div className="text-2xl font-bold text-white group-hover/stat:text-orange-500 transition-colors">
                    {stats.streak} <span className="text-sm font-normal text-gray-600">days</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#141414] border border-[#1F1F1F] hover:border-orange-500/30 transition-colors group/stat">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                      <Target className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tracked</span>
                  </div>
                  <div className="text-2xl font-bold text-white group-hover/stat:text-orange-500 transition-colors">
                    {stats.totalSubjects} <span className="text-sm font-normal text-gray-600">items</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Secondary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Account Settings */}
          <motion.div variants={itemVariants} className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 hover:border-[#333] transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-[#141414] border border-[#1F1F1F] text-gray-400">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Account Settings</h3>
                <p className="text-sm text-gray-500">Personal information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#141414] border border-[#1F1F1F]">
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <span className="text-sm text-white font-mono">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#141414] border border-[#1F1F1F]">
                <div className="flex items-center gap-3 text-gray-400">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Name</span>
                </div>
                <span className="text-sm text-white font-medium">{user?.name}</span>
              </div>
            </div>
          </motion.div>

          {/* Learning Progress */}
          <motion.div variants={itemVariants} className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 hover:border-[#333] transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-[#141414] border border-[#1F1F1F] text-orange-500">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Learning Progress</h3>
                <p className="text-sm text-gray-500">Your study journey</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Overall Completion</span>
                  <span className="text-white font-bold">{stats.attendancePercentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#141414] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.attendancePercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-orange-600 to-red-600 rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#141414] border border-[#1F1F1F] text-center">
                  <Award className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">Keep it up!</p>
                  <p className="text-xs text-gray-500 mt-1">Consistent effort</p>
                </div>
                <div className="p-4 rounded-xl bg-[#141414] border border-[#1F1F1F] text-center">
                  <Sparkles className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">Top 10%</p>
                  <p className="text-xs text-gray-500 mt-1">In your class</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Placement (Conditional) */}
          {user?.isPlacementEnabled && (
            <motion.div variants={itemVariants} className="md:col-span-2 bg-gradient-to-r from-slate-900 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Placement Access</h3>
                    <p className="text-sm text-gray-400">Exclusive opportunities unlocked</p>
                  </div>
                </div>

                <button
                  onClick={() => window.location.href = '/placement'}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
                >
                  View Portal
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Sign Out */}
          <motion.div variants={itemVariants} className="md:col-span-2 mt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-[#141414] border border-[#1F1F1F] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 text-gray-500 transition-all group"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-bold">Sign Out of Account</span>
            </button>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
