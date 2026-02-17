import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, Flame, Target, Map,
  ChevronRight, Video, FileText,
  Calendar, MoreHorizontal, CheckCircle2,
  Briefcase, ArrowRight, Zap, Sparkles
} from 'lucide-react';
import { attendanceApi } from '../../api/attendance.api';
import { applicationApi } from '../../api/placement.api';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    attendancePercentage: 0,
    streak: 0,
    subjects: 0,
    activeApplications: 0
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const promises = [attendanceApi.getHistory()];

      if (user?.educationLevel === 'College') {
        promises.push(applicationApi.getMyApplications());
      }

      const results = await Promise.allSettled(promises);
      const attendanceRes = results[0].status === 'fulfilled' ? results[0].value : null;
      const placementRes = results[1]?.status === 'fulfilled' ? results[1].value : null;

      let newStats = { ...stats };

      if (attendanceRes && attendanceRes.found) {
        if (attendanceRes.type === 'college') {
          const subjects = attendanceRes.subjects || [];
          const avgPercentage = subjects.length > 0
            ? Math.round(subjects.reduce((acc, s) => acc + s.percentage, 0) / subjects.length)
            : 0;

          newStats.attendancePercentage = avgPercentage;
          newStats.streak = Math.max(...subjects.map(s => s.streak || 0), 0);
          newStats.subjects = subjects.length;

        } else {
          const history = attendanceRes.data || [];
          const presentDays = history.filter(h => h.status === 'Present').length;
          const percentage = history.length > 0 ? Math.round((presentDays / history.length) * 100) : 0;

          newStats.attendancePercentage = percentage;
          newStats.streak = attendanceRes.streak || 0;
          newStats.subjects = history.length;
        }
      }

      if (placementRes && placementRes.success) {
        const activeApps = placementRes.data.filter(app =>
          !['Rejected', 'Selected'].includes(app.status)
        ).length;
        newStats.activeApplications = activeApps;
      }

      setStats(newStats);

    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  // Calendar Helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Simplified Mock Data for Graph (Professional Look)
  const weeklyData = [
    { day: 'Mon', value: 35 },
    { day: 'Tue', value: 65 },
    { day: 'Wed', value: 45 },
    { day: 'Thu', value: 80 },
    { day: 'Fri', value: 55 },
    { day: 'Sat', value: 30 },
    { day: 'Sun', value: 20 },
  ];

  const FeatureCard = ({ title, subtitle, icon: Icon, to, stat, color = "orange" }) => {
    const colorClasses = {
      orange: "group-hover:text-orange-500 group-hover:border-orange-500/30",
      blue: "group-hover:text-blue-500 group-hover:border-blue-500/30",
      green: "group-hover:text-emerald-500 group-hover:border-emerald-500/30",
      purple: "group-hover:text-purple-500 group-hover:border-purple-500/30"
    };

    return (
      <Link to={to} className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 rounded-2xl group hover:border-[#333] transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
        <div className={`absolute -bottom-4 -right-4 p-4 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rotate-12`}>
          <Icon className={`w-32 h-32 text-${color}-500`} />
        </div>

        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className={`p-3 rounded-xl bg-[#141414] text-gray-400 border border-[#1F1F1F] transition-colors ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          {stat && (
            <span className="px-2 py-1 rounded-md bg-[#141414] border border-[#1F1F1F] text-xs font-medium text-white shadow-sm">
              {stat}
            </span>
          )}
        </div>

        <div className="relative z-10">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">{title}</h3>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{subtitle}</p>

          <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-gray-600 group-hover:text-white transition-colors gap-2">
            Open <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans overflow-x-hidden">

      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-1">
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Welcome back, {user?.name?.split(' ')[0]}
          </p>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* Left Column: Stats & Feature Hub (8 columns) */}
        <div className="lg:col-span-8 space-y-8">

          {/* Quick Stats Row - Minimal Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Attendance */}
            <motion.div variants={itemVariants} className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 relative overflow-hidden group hover:border-[#333] transition-all hover:shadow-lg hover:shadow-orange-900/10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[#141414] rounded-lg border border-[#1F1F1F] group-hover:border-orange-500/30 transition-colors">
                  <TrendingUp className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
                </div>
                <span className="text-xs text-gray-500 font-medium bg-[#141414] px-2 py-1 rounded-md border border-[#1F1F1F]">
                  {user?.educationLevel === 'College' ? 'Sem Avg' : 'Yearly'}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{stats.attendancePercentage}<span className="text-xl text-gray-600 font-normal">%</span></h3>
              <p className="text-sm text-gray-500">Attendance Rate</p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#141414]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.attendancePercentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-orange-600"
                />
              </div>
            </motion.div>

            {/* Streak */}
            <motion.div variants={itemVariants} className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 relative overflow-hidden group hover:border-[#333] transition-all hover:shadow-lg hover:shadow-orange-900/10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[#141414] rounded-lg border border-[#1F1F1F] group-hover:border-orange-500/30 transition-colors">
                  <Flame className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{stats.streak} <span className="text-xl text-gray-600 font-normal">days</span></h3>
              <p className="text-sm text-gray-500">Current Streak</p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#141414]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(stats.streak, 100)}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-orange-600"
                />
              </div>
            </motion.div>

            {/* Placement / Subjects */}
            {user?.educationLevel === 'College' ? (
              <motion.div variants={itemVariants} className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 relative overflow-hidden group hover:border-[#333] transition-all hover:shadow-lg hover:shadow-blue-900/10">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-[#141414] rounded-lg border border-[#1F1F1F] group-hover:border-blue-500/30 transition-colors">
                    <Briefcase className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{stats.activeApplications}</h3>
                <p className="text-sm text-gray-500">Active Applications</p>
              </motion.div>
            ) : (
              <motion.div variants={itemVariants} className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 relative overflow-hidden group hover:border-[#333] transition-all hover:shadow-lg hover:shadow-orange-900/10">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-[#141414] rounded-lg border border-[#1F1F1F] group-hover:border-orange-500/30 transition-colors">
                    <Target className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{stats.subjects}</h3>
                <p className="text-sm text-gray-500">Tracked Items</p>
              </motion.div>
            )}

          </div>

          {/* Activity Chart Section */}
          <motion.div variants={itemVariants} className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-8 hover:border-[#333] transition-colors">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-lg font-semibold text-white">Study Activity</h2>
                <p className="text-sm text-gray-500 mt-1">Weekly engagement overview</p>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-4">
              {weeklyData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group cursor-pointer relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#222] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#333] z-10">
                    {item.value} hrs
                  </div>
                  <div className="w-full bg-[#141414] rounded-t-sm relative h-full flex items-end overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${item.value}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + (index * 0.1) }}
                      className="w-full bg-orange-600/80 group-hover:bg-orange-500 ease-out"
                    />
                  </div>
                  <span className="text-xs text-gray-600 font-medium group-hover:text-gray-400 transition-colors uppercase tracking-wider">{item.day}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FEATURE HUB - Unified Grid */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-orange-500 fill-current" />
              <h2 className="text-lg font-semibold text-white">Feature Hub</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.educationLevel === 'College' && (
                <motion.div variants={itemVariants} className="h-full">
                  <FeatureCard
                    title="Placement Cell"
                    subtitle="Track applications & resume score"
                    icon={Briefcase}
                    to="/placement"
                    stat={stats.activeApplications > 0 ? `${stats.activeApplications} Active` : undefined}
                    color="blue"
                  />
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="h-full">
                <FeatureCard
                  title="Study Rooms"
                  subtitle="Join live sessions with peers"
                  icon={Video}
                  to="/study-rooms"
                  color="purple"
                  stat="Live Now"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="h-full">
                <FeatureCard
                  title="My Roadmap"
                  subtitle="Your personalized learning path"
                  icon={Map}
                  to="/roadmap"
                  color="green"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="h-full">
                <FeatureCard
                  title="Quiz Center"
                  subtitle="Test your knowledge & skills"
                  icon={CheckCircle2}
                  to="/quiz"
                  color="orange"
                />
              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Calendar */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-8">

          {/* Calendar Widget */}
          <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 hover:border-[#333] transition-colors sticky top-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-medium">{monthName}</h3>
              <div className="flex gap-2 text-gray-500">
                <Calendar className="w-4 h-4" />
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} className="text-xs text-gray-600 font-medium py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} className="py-2"></div>)}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const isToday = day === currentDate.getDate();
                const isSelected = day === selectedDay;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`
                      py-2 rounded-lg cursor-pointer transition-all duration-200 text-xs font-medium w-full
                      ${isToday
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20 hover:bg-orange-500'
                        : isSelected
                          ? 'bg-[#222] text-white border border-[#333]'
                          : 'text-gray-400 hover:bg-[#141414] hover:text-white hover:scale-105'
                      }
                    `}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
            {/* Selected Day Event Placeholder */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              key={selectedDay}
              className="mt-6 pt-6 border-t border-[#1F1F1F]"
            >
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {selectedDay === currentDate.getDate() ? 'Today' : `${monthName.split(' ')[0]} ${selectedDay}`}
              </h4>
              <div className="p-3 bg-[#141414] rounded-lg border border-[#1F1F1F]">
                <p className="text-sm text-gray-400">No events scheduled</p>
              </div>
            </motion.div>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
