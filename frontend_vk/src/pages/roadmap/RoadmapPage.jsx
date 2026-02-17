import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Map, Plus, Calendar, Target, Flame, Clock,
    CheckCircle2, Circle, ChevronDown, ChevronUp,
    Sparkles, Loader2, BookOpen, GraduationCap,
    AlertCircle, Trophy, Zap, ArrowRight, Shield
} from "lucide-react";
import { roadmapApi } from "../../api/roadmapApi";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";
import { clsx } from "clsx";

const levels = [
    { id: "beginner", label: "Beginner", icon: "🌱", desc: "Start from scratch" },
    { id: "intermediate", label: "Intermediate", icon: "📚", desc: "Know the basics" },
    { id: "advanced", label: "Advanced", icon: "🚀", desc: "Deep dive mastery" },
];

const durations = [3, 5, 7, 14, 21, 30];

const RoadmapPage = () => {
    const { isDark } = useTheme();
    const [view, setView] = useState("loading"); // loading, create, roadmap
    const [roadmapData, setRoadmapData] = useState(null);
    const [todayData, setTodayData] = useState(null);
    const [expandedDays, setExpandedDays] = useState({});

    // Form state
    const [topic, setTopic] = useState("");
    const [duration, setDuration] = useState(7);
    const [level, setLevel] = useState("beginner");
    const [generating, setGenerating] = useState(false);

    // Load existing roadmap on mount
    useEffect(() => {
        loadRoadmap();
    }, []);

    const loadRoadmap = async () => {
        try {
            // Fetch full roadmap from database
            const roadmap = await roadmapApi.getActiveRoadmap();

            if (roadmap) {
                setRoadmapData(roadmap);

                // Find today's day and backlog
                const todayStr = new Date().toDateString();
                const todayDay = roadmap.days.find(d => new Date(d.date).toDateString() === todayStr);
                setTodayData({
                    roadmapId: roadmap._id,
                    today: todayDay,
                    backlog: roadmap.days.filter(d => d.backlog)
                });

                setView("roadmap");
            } else {
                setView("create");
            }
        } catch (err) {
            console.error("Failed to load roadmap:", err);
            setView("create");
        }
    };

    const handleGenerateRoadmap = async () => {
        if (!topic.trim()) {
            return toast.error("Please enter a topic");
        }

        try {
            setGenerating(true);
            const data = await roadmapApi.generateRoadmap(topic, duration, level);
            localStorage.setItem("currentRoadmap", JSON.stringify(data));
            setRoadmapData(data);

            const todayStr = new Date().toDateString();
            const todayDay = data.days.find(d => new Date(d.date).toDateString() === todayStr);
            setTodayData({
                roadmapId: data._id,
                today: todayDay,
                backlog: data.days.filter(d => d.backlog)
            });

            setView("roadmap");
            toast.success("Roadmap generated successfully!");
        } catch (err) {
            toast.error("Failed to generate roadmap");
        } finally {
            setGenerating(false);
        }
    };

    const handleCompleteTask = async (dayId, taskId, taskTitle) => {
        try {
            const updated = await roadmapApi.completeTask(todayData.roadmapId, dayId, taskId);
            localStorage.setItem("currentRoadmap", JSON.stringify(updated));
            setRoadmapData(updated);

            const todayStr = new Date().toDateString();
            const todayDay = updated.days.find(d => new Date(d.date).toDateString() === todayStr);
            setTodayData(prev => ({
                ...prev,
                today: todayDay,
                backlog: updated.days.filter(d => d.backlog)
            }));

            toast.success(`Completed: ${taskTitle}`);
        } catch (err) {
            toast.error("Failed to complete task");
        }
    };

    const toggleDayExpansion = (dayIndex) => {
        setExpandedDays(prev => ({
            ...prev,
            [dayIndex]: !prev[dayIndex]
        }));
    };

    const isToday = (dateStr) => {
        return new Date(dateStr).toDateString() === new Date().toDateString();
    };

    const isPast = (dateStr) => {
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const getProgress = () => {
        if (!roadmapData?.days) return 0;
        const total = roadmapData.days.reduce((acc, d) => acc + d.tasks.length, 0);
        const completed = roadmapData.days.reduce((acc, d) =>
            acc + d.tasks.filter(t => t.completed).length, 0);
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    // Loading State
    if (view === "loading") {
        return (
            <div className="flex items-center justify-center py-20 bg-black min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-500" />
                    <p className="text-gray-400">Loading your roadmap...</p>
                </div>
            </div>
        );
    }

    // Create Roadmap View
    if (view === "create") {
        return (
            <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-12 border-b border-[#1F1F1F] pb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#1F1F1F] text-xs font-medium text-orange-500 mb-4">
                            <Map className="w-3 h-3" />
                            <span>AI Learning Path</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Create Your Roadmap</h1>
                        <p className="text-gray-400 max-w-2xl">
                            Generate a personalized study roadmap with daily tasks. AI will create a structured learning path based on your topic.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {[
                            { icon: Target, title: "Goal-Oriented", desc: "Clear daily objectives" },
                            { icon: Calendar, title: "Structured", desc: "Day-by-day schedule" },
                            { icon: Flame, title: "Track Progress", desc: "Mark tasks complete" },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-[#141414] border border-[#1F1F1F] rounded-xl p-6 hover:border-orange-500/30 transition-all group"
                            >
                                <div className="p-3 bg-[#0A0A0A] rounded-lg w-fit mb-4 border border-[#1F1F1F] group-hover:border-orange-500/20 group-hover:bg-orange-500/10 transition-colors">
                                    <feature.icon className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                </div>
                                <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                                <p className="text-xs text-gray-500">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Form Card */}
                    <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                        {/* Topic Input */}
                        <div className="mb-8 relative z-10">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                What do you want to learn? <span className="text-orange-500">*</span>
                            </label>
                            <div className="relative">
                                <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                                <input
                                    type="text"
                                    placeholder="e.g., React.js, Data Structures, Machine Learning..."
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-[#141414] border border-[#1F1F1F] focus:border-orange-500 rounded-xl text-white placeholder-gray-600 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Duration Selection */}
                        <div className="mb-8 relative z-10">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                Duration (days)
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {durations.map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setDuration(d)}
                                        className={clsx(
                                            "px-4 py-2 rounded-xl font-bold text-sm transition-all border",
                                            duration === d
                                                ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-900/20"
                                                : "bg-[#141414] border-[#1F1F1F] text-gray-400 hover:text-white hover:border-gray-700"
                                        )}
                                    >
                                        {d} days
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Level Selection */}
                        <div className="mb-10 relative z-10">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                Your Level
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {levels.map((l) => (
                                    <button
                                        key={l.id}
                                        onClick={() => setLevel(l.id)}
                                        className={clsx(
                                            "relative p-4 rounded-xl border transition-all text-left group",
                                            level === l.id
                                                ? "bg-orange-600/10 border-orange-600/50"
                                                : "bg-[#141414] border-[#1F1F1F] hover:border-gray-700"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl filter grayscale group-hover:grayscale-0 transition-all">{l.icon}</span>
                                            <div>
                                                <h4 className={clsx("font-bold text-sm transition-colors", level === l.id ? "text-orange-500" : "text-white")}>{l.label}</h4>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">{l.desc}</p>
                                            </div>
                                        </div>
                                        {level === l.id && (
                                            <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-orange-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerateRoadmap}
                            disabled={generating}
                            className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative z-10"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating Roadmap...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Generate Roadmap
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Roadmap View
    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12 border-b border-[#1F1F1F] pb-8 flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#1F1F1F] text-xs font-medium text-orange-500 mb-4">
                            <Map className="w-3 h-3" />
                            <span>Active Roadmap</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">{roadmapData?.topic || "Your Roadmap"}</h1>
                        <p className="text-gray-400">{roadmapData?.duration || 0} day journey</p>
                    </div>

                    <button
                        onClick={() => {
                            if (window.confirm("Start a new roadmap? Current progress will be lost.")) {
                                localStorage.removeItem("currentRoadmap");
                                setRoadmapData(null);
                                setTodayData(null);
                                setView("create");
                            }
                        }}
                        className="px-4 py-2 bg-[#141414] hover:bg-[#1F1F1F] border border-[#1F1F1F] rounded-xl flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        New Roadmap
                    </button>
                </div>

                {/* Progress & Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Progress', value: `${getProgress()}%`, icon: Target, color: 'text-emerald-500' },
                        { label: 'Streak', value: `${roadmapData?.streak || 0} days`, icon: Flame, color: 'text-orange-500' },
                        { label: 'Days Left', value: roadmapData?.days ? roadmapData.days.filter(d => !isPast(d.date) || isToday(d.date)).length : 0, icon: Clock, color: 'text-blue-500' },
                        { label: 'Completed', value: `${roadmapData?.days?.filter(d => d.isCompleted).length || 0} days`, icon: Trophy, color: 'text-amber-500' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#141414] border border-[#1F1F1F] p-5 rounded-2xl hover:border-[#333] transition-colors">
                            <div className="flex items-center gap-2 mb-4">
                                <stat.icon className={clsx("w-4 h-4", stat.color)} />
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{stat.label}</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="h-2 rounded-full bg-[#1F1F1F] overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${getProgress()}%` }}
                            className="h-full bg-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.5)] rounded-full"
                        />
                    </div>
                </div>

                {/* Today's Tasks Highlight */}
                {todayData?.today && (
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-2xl p-6 md:p-8 mb-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-orange-500/10 transition-colors duration-500"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                                        <Zap className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Today's Focus</h2>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Day {todayData.today.day}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {todayData.today.tasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className={clsx(
                                            "flex items-center gap-4 p-4 rounded-xl border transition-all",
                                            task.completed
                                                ? "bg-[#0A0A0A] border-emerald-500/20 opacity-60"
                                                : "bg-[#0A0A0A] border-[#1F1F1F] hover:border-orange-500/30"
                                        )}
                                    >
                                        <button
                                            onClick={() => !task.completed && handleCompleteTask(todayData.today._id, task._id, task.title)}
                                            disabled={task.completed}
                                            className="flex-shrink-0"
                                        >
                                            {task.completed ? (
                                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                            ) : (
                                                <Circle className="w-6 h-6 text-gray-600 hover:text-orange-500 transition-colors" />
                                            )}
                                        </button>
                                        <span className={clsx("font-medium", task.completed ? "text-gray-500 line-through" : "text-gray-200")}>
                                            {task.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Backlog Warning */}
                {todayData?.backlog?.length > 0 && (
                    <div className="bg-amber-900/10 border border-amber-900/30 rounded-xl p-4 mb-8 flex items-start gap-4">
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-amber-500 text-sm">You have backlog tasks!</p>
                            <p className="text-xs text-amber-400 mt-1">
                                {todayData.backlog.reduce((acc, d) => acc + d.tasks.filter(t => !t.completed).length, 0)} incomplete tasks from previous days.
                            </p>
                        </div>
                    </div>
                )}

                {/* All Days Timeline */}
                <div>
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        Full Roadmap
                    </h2>

                    <div className="space-y-4">
                        {roadmapData?.days?.map((day, index) => {
                            const isTodayDay = isToday(day.date);
                            const isPastDay = isPast(day.date) && !isTodayDay;
                            const isExpanded = expandedDays[index] ?? isTodayDay;
                            const completedTasks = day.tasks.filter(t => t.completed).length;
                            const totalTasks = day.tasks.length;

                            return (
                                <div
                                    key={day._id || index}
                                    className={clsx(
                                        "rounded-2xl border overflow-hidden transition-all bg-[#0A0A0A]",
                                        isTodayDay ? "border-orange-500/50 shadow-lg shadow-orange-900/10" : "border-[#1F1F1F]",
                                        isExpanded && !isTodayDay ? "bg-[#141414]" : ""
                                    )}
                                >
                                    {/* Day Header */}
                                    <button
                                        onClick={() => toggleDayExpansion(index)}
                                        className="w-full p-5 flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={clsx(
                                                "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm border transition-all",
                                                day.isCompleted
                                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                                    : isTodayDay
                                                        ? "bg-orange-500 text-black border-orange-500"
                                                        : isPastDay
                                                            ? "bg-red-500/5 border-red-500/10 text-red-500"
                                                            : "bg-[#1F1F1F] border-[#2A2A2A] text-gray-500"
                                            )}>
                                                {day.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : `Day ${day.day}`}
                                            </div>
                                            <div className="text-left">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className={clsx("font-bold text-base", isTodayDay ? "text-orange-500" : "text-white")}>
                                                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                    </span>
                                                    {isTodayDay && <span className="px-2 py-0.5 bg-orange-500/20 text-orange-500 text-[10px] uppercase font-bold rounded-md">Today</span>}
                                                    {isPastDay && !day.isCompleted && <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-[10px] uppercase font-bold rounded-md">Overdue</span>}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500 font-medium">
                                                        {completedTasks}/{totalTasks} Tasks
                                                    </span>
                                                    {completedTasks === totalTasks && totalTasks > 0 && <span className="text-xs text-emerald-500 font-bold">Completed</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-2 rounded-lg group-hover:bg-[#1F1F1F] text-gray-500 transition-colors">
                                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </div>
                                    </button>

                                    {/* Tasks */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-[#1F1F1F]"
                                            >
                                                <div className="p-4 space-y-2">
                                                    {day.tasks.map((task) => (
                                                        <div
                                                            key={task._id}
                                                            className={clsx(
                                                                "flex items-center gap-3 p-3 rounded-xl transition-all border",
                                                                task.completed
                                                                    ? "bg-[#0A0A0A] border-emerald-500/10 opacity-60"
                                                                    : "bg-[#141414] border-[#1F1F1F] hover:border-orange-500/20"
                                                            )}
                                                        >
                                                            <button
                                                                onClick={() => !task.completed && handleCompleteTask(day._id, task._id, task.title)}
                                                                disabled={task.completed}
                                                                className="flex-shrink-0"
                                                            >
                                                                {task.completed ? (
                                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                                ) : (
                                                                    <Circle className="w-5 h-5 text-gray-600 hover:text-orange-500 transition-colors" />
                                                                )}
                                                            </button>
                                                            <span className={clsx("text-sm font-medium", task.completed ? "text-gray-500 line-through" : "text-gray-300")}>
                                                                {task.title}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoadmapPage;
