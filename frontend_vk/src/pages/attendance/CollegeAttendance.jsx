import React, { useState, useEffect } from 'react';
import {
  Plus, Trash2, CheckCircle, Loader2, BookOpen,
  TrendingUp, Calendar, ChevronLeft, ChevronRight, X, AlertTriangle
} from 'lucide-react';
import { attendanceApi } from '../../api/attendance.api';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const CollegeAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [markingSubject, setMarkingSubject] = useState(null);
  const [calendarSubject, setCalendarSubject] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const fetchSubjects = async () => {
    try {
      const response = await attendanceApi.getHistory();
      if (response.subjects) {
        setSubjects(response.subjects);
      }
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    try {
      setAdding(true);
      const response = await attendanceApi.addSubject(newSubject.trim());
      if (response.success) {
        toast.success('Subject added!');
        setNewSubject('');
        fetchSubjects();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add subject');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSubject = async (subjectName) => {
    if (!window.confirm(`Delete "${subjectName}"?`)) return;

    try {
      const response = await attendanceApi.deleteSubject(subjectName);
      if (response.success) {
        toast.success('Subject deleted');
        fetchSubjects();
      }
    } catch (error) {
      toast.error('Failed to delete subject');
    }
  };

  const handleMarkAttendance = async (subjectName, status) => {
    try {
      setMarkingSubject(subjectName);
      const response = await attendanceApi.markSubjectAttendance(subjectName, status);
      if (response.success) {
        toast.success(`Marked ${status} for ${subjectName}`);
        fetchSubjects();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setMarkingSubject(null);
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDay: firstDay.getDay() };
  };

  const isPresentDay = (day, presentDates) => {
    if (!presentDates) return false;
    const checkDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    return presentDates.some(d => new Date(d).toDateString() === checkDate.toDateString());
  };

  const prevMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  const nextMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));

  const MiniCalendar = ({ subject }) => {
    const { daysInMonth, startingDay } = getDaysInMonth(calendarMonth);
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    for (let i = 0; i < startingDay; i++) days.push(<div key={`empty-${i}`} className="w-8 h-8" />);

    for (let day = 1; day <= daysInMonth; day++) {
      const isPresent = isPresentDay(day, subject.presentDates);
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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setCalendarSubject(null)}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6 border-b border-[#1F1F1F] pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">{subject.subjectName}</h3>
              <p className="text-gray-400 text-xs">Attendance History</p>
            </div>
            <button onClick={() => setCalendarSubject(null)} className="p-2 bg-[#141414] hover:bg-[#1F1F1F] text-gray-400 hover:text-white rounded-lg transition-colors">
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

  const getPercentageColor = (percentage) => {
    if (percentage >= 75) return 'text-emerald-500';
    if (percentage >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getPercentageBg = (percentage) => {
    if (percentage >= 75) return 'bg-emerald-500 shadow-emerald-500/50';
    if (percentage >= 50) return 'bg-orange-500 shadow-orange-500/50';
    return 'bg-red-500 shadow-red-500/50';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Add Subject Form */}
      <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-1 rounded-xl flex gap-2 max-w-lg">
        <input
          type="text"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          placeholder="New subject (e.g. Operating Systems)"
          className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-600 focus:outline-none text-sm font-medium rounded-lg"
        />
        <button
          onClick={handleAddSubject}
          disabled={adding || !newSubject.trim()}
          className="px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-sm transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-orange-900/20"
        >
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add
        </button>
      </div>

      {/* Subjects Grid */}
      {subjects.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-[#1F1F1F] bg-[#0A0A0A]">
          <div className="w-16 h-16 bg-[#141414] rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No subjects yet</h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">Add your subjects above to start tracking your attendance goals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {subjects.map((subject) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={subject._id}
                className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl overflow-hidden hover:border-orange-500/20 transition-all duration-300 group shadow-lg"
              >
                <div className="p-6 border-b border-[#1F1F1F] flex justify-between items-start bg-[#141414]/30">
                  <div
                    className="cursor-pointer group-hover:text-orange-500 transition-colors"
                    onClick={() => { setCalendarSubject(subject); setCalendarMonth(new Date()); }}
                  >
                    <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">{subject.subjectName}</h3>
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-orange-500/70 transition-colors">
                      <Calendar className="w-3 h-3" /> View Calendar
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteSubject(subject.subjectName)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6">
                  {/* Visual Stats */}
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className={clsx("w-4 h-4", getPercentageColor(subject.percentage))} />
                        <span className="text-xs font-bold text-gray-500 uppercase">Attendance</span>
                      </div>
                      <span className={clsx("text-4xl font-bold tracking-tight", getPercentageColor(subject.percentage))}>
                        {subject.percentage}%
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">
                        {subject.present}<span className="text-gray-600 text-sm font-medium mx-1">/</span>{subject.total}
                      </p>
                      <p className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">Classes Attended</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 rounded-full bg-[#1F1F1F] overflow-hidden mb-6">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.percentage}%` }}
                      className={clsx("h-full rounded-full transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]", getPercentageBg(subject.percentage))}
                    />
                  </div>

                  {/* Warning if low attendance */}
                  {subject.percentage < 75 && (
                    <div className="flex items-center gap-2 mb-6 px-3 py-2 bg-red-500/5 border border-red-500/10 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-xs text-red-400 font-medium">Below Target (75%)</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleMarkAttendance(subject.subjectName, 'Present')}
                      disabled={markingSubject === subject.subjectName}
                      className="flex items-center justify-center gap-2 py-3 bg-[#141414] hover:bg-[#1F1F1F] border border-[#1F1F1F] hover:border-emerald-500/30 hover:text-emerald-500 text-gray-300 rounded-xl font-bold text-sm transition-all disabled:opacity-50 group/btn"
                    >
                      {markingSubject === subject.subjectName ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-gray-500 group-hover/btn:text-emerald-500 transition-colors" />
                      )}
                      Present
                    </button>
                    <button
                      onClick={() => handleMarkAttendance(subject.subjectName, 'Absent')}
                      disabled={markingSubject === subject.subjectName}
                      className="flex items-center justify-center gap-2 py-3 bg-[#141414] hover:bg-[#1F1F1F] border border-[#1F1F1F] hover:border-red-500/30 hover:text-red-500 text-gray-300 rounded-xl font-bold text-sm transition-all disabled:opacity-50 group/btn"
                    >
                      {markingSubject === subject.subjectName ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4 text-gray-500 group-hover/btn:text-red-500 transition-colors" />
                      )}
                      Absent
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {calendarSubject && <MiniCalendar subject={calendarSubject} />}
    </div>
  );
};

export default CollegeAttendance;
