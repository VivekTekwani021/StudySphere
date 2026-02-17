import React, { useState, useEffect } from 'react';
import {
  CheckCircle, Calendar, Loader2,
  TrendingUp, Flame, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { attendanceApi } from '../../api/attendance.api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const SchoolAttendance = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayStatus, setTodayStatus] = useState(null);
  const [marking, setMarking] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const fetchHistory = async () => {
    try {
      const response = await attendanceApi.getHistory();
      if (response.success) {
        setHistory(response.data || []);
        const todayStr = new Date().toISOString().split('T')[0];
        const todayRecord = response.data?.find(r => r.date?.startsWith(todayStr));
        if (todayRecord) {
          setTodayStatus(todayRecord.status);
        }
      }
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleMarkAttendance = async (status) => {
    try {
      setMarking(true);
      const response = await attendanceApi.markSchoolDaily(status);
      if (response.success) {
        toast.success(`Marked ${status}!`);
        setTodayStatus(status);
        fetchHistory();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setMarking(false);
    }
  };

  // Calculate stats
  const totalDays = history.length;
  const presentDays = history.filter(r => r.status === 'Present').length;
  const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const calculateStreak = () => {
    let streak = 0;
    const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
    for (const record of sortedHistory) {
      if (record.status === 'Present') streak++;
      else break;
    }
    return streak;
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDay: firstDay.getDay() };
  };

  const isPresentDay = (day) => {
    const checkDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    return history.some(h => {
      if (h.status !== 'Present') return false;
      const presentDate = new Date(h.date);
      return presentDate.toDateString() === checkDate.toDateString();
    });
  };

  const prevMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  const nextMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));

  const MiniCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(calendarMonth);
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    for (let i = 0; i < startingDay; i++) days.push(<div key={`empty-${i}`} className="w-8 h-8" />);

    for (let day = 1; day <= daysInMonth; day++) {
      const isPresent = isPresentDay(day);
      const isToday = new Date().toDateString() === new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day).toDateString();

      days.push(
        <div
          key={day}
          className={clsx(
            "w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors",
            isPresent && "bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20",
            isToday && !isPresent && "ring-1 ring-orange-500 text-orange-500",
            !isPresent && !isToday && "text-gray-500 hover:text-white"
          )}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowCalendar(false)}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6 border-b border-[#1F1F1F] pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Attendance Calendar</h3>
              <p className="text-gray-400 text-xs">{presentDays} days present this month</p>
            </div>
            <button onClick={() => setShowCalendar(false)} className="p-2 bg-[#141414] hover:bg-[#1F1F1F] text-gray-400 hover:text-white rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-[#141414] text-gray-400 hover:text-white rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-white uppercase tracking-wider text-sm">
              {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
            </span>
            <button onClick={nextMonth} className="p-2 hover:bg-[#141414] text-gray-400 hover:text-white rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="w-8 h-8 flex items-center justify-center text-[10px] font-bold text-gray-600 uppercase tracking-wider">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">{days}</div>

          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-[#1F1F1F]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-gray-400">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full ring-1 ring-orange-500" />
              <span className="text-xs text-gray-400">Today</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Today's Card */}
      <div className="bg-[#141414] border border-[#1F1F1F] rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-500"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Live Status</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">Today's Attendance</h2>
            <p className="text-gray-400 text-sm">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
          </div>

          <div className="flex items-center gap-4">
            {todayStatus ? (
              <div className={clsx("px-6 py-3 rounded-xl border flex items-center gap-3",
                todayStatus === 'Present' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
              )}>
                {todayStatus === 'Present' ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
                <span className="font-bold">Marked {todayStatus}</span>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => handleMarkAttendance('Present')}
                  disabled={marking}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                >
                  {marking ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Present
                </button>
                <button
                  onClick={() => handleMarkAttendance('Absent')}
                  disabled={marking}
                  className="px-6 py-3 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#333] text-gray-300 hover:text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                >
                  {marking ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                  Absent
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Attendance', value: `${percentage}%`, icon: TrendingUp, color: 'text-blue-500' },
          { label: 'Day Streak', value: calculateStreak(), icon: Flame, color: 'text-orange-500' },
          { label: 'Present Days', value: presentDays, icon: CheckCircle, color: 'text-emerald-500', onClick: () => { setShowCalendar(true); setCalendarMonth(new Date()); } },
          { label: 'Absent Days', value: history.length - presentDays, icon: X, color: 'text-red-500', onClick: () => { setShowCalendar(true); setCalendarMonth(new Date()); } },
        ].map((stat, i) => (
          <div
            key={i}
            onClick={stat.onClick}
            className={clsx(
              "bg-[#0A0A0A] border border-[#1F1F1F] p-5 rounded-2xl group transition-all duration-300 hover:border-[#333]",
              stat.onClick && "cursor-pointer hover:bg-[#141414]"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={clsx("w-5 h-5", stat.color)} />
              {stat.onClick && <span className="text-[10px] text-gray-600 uppercase font-bold tracking-wider group-hover:text-gray-400 transition-colors">View</span>}
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent History */}
      <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#1F1F1F] flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            Recent History
          </h3>
          <button
            onClick={() => { setShowCalendar(true); setCalendarMonth(new Date()); }}
            className="text-xs font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-wider"
          >
            View All
          </button>
        </div>

        <div className="divide-y divide-[#1F1F1F]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No attendance records yet.</p>
            </div>
          ) : (
            history
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5)
              .map((record) => (
                <div key={record._id} className="flex justify-between items-center p-4 hover:bg-[#141414] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center border transition-colors",
                      record.status === 'Present'
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                        : "bg-red-500/10 border-red-500/20 text-red-500"
                    )}>
                      {record.status === 'Present' ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{format(new Date(record.date), 'EEEE')}</p>
                      <p className="text-xs text-gray-500">{format(new Date(record.date), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <span className={clsx("px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider",
                    record.status === 'Present'
                      ? "text-emerald-500 bg-emerald-500/5"
                      : "text-red-500 bg-red-500/5"
                  )}>{record.status}</span>
                </div>
              ))
          )}
        </div>
      </div>

      {showCalendar && <MiniCalendar />}
    </div>
  );
};

export default SchoolAttendance;
