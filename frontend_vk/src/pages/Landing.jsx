import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Video,
  HelpCircle,
  Map,
  Briefcase,
  ArrowRight,
  CheckCircle,
  Code2,
  Zap,
  FileCheck,
  BarChart3,
  Users,
  Clock,
  Trophy,
  Star
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0e1a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const stats = [
    { number: "10,000+", label: "Active Students" },
    { number: "500+", label: "Study Rooms" },
    { number: "1M+", label: "Quiz es Completed" },
    { number: "24/7", label: "AI Support" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white font-sans">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0a0e1a]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">StudySphere</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#stats" className="text-gray-400 hover:text-white transition-colors">Impact</a>
            <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">
              Login
            </Link>
            <Link to="/register" className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Elevate Your Learning
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Master Your Future with
              <span className="block text-orange-500">Intelligent Learning</span>
            </h1>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-xl">
              The all-in-one platform for students to track attendance, collaborate in real-time study rooms,
              and boost career prospects with AI-driven insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all">
                Start Learning Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-gray-700 hover:border-gray-600 text-white font-semibold rounded-lg transition-all">
                Explore Demo
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-blue-500/20 rounded-2xl blur-3xl"></div>
              <div className="relative bg-[#111827] border border-gray-800 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-[#1a2332] border border-gray-700 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-300">Track Attendance</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#1a2332] border border-gray-700 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-300">Join Study Rooms</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#1a2332] border border-gray-700 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-300">AI-Powered Learning</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#1a2332] border border-gray-700 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-300">Career Guidance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="border-y border-gray-800 bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <h3 className="text-4xl font-bold text-white mb-2">{stat.number}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature 1: Study Rooms */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-medium mb-6">
              <Video className="w-3 h-3" />
              Collaboration
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Study together, <span className="text-orange-500">anywhere</span>
            </h2>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Connect with peers in HD video study rooms. Share screens, collaborate on whiteboards,
              and learn together in real-time without switching apps.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-gray-300">HD video & crystal-clear audio</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-gray-300">Screen sharing & whiteboard</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-gray-300">Up to 50 participants per room</span>
              </li>
            </ul>

            <Link to="/register" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-medium transition-colors">
              Explore study rooms <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* MacBook Frame */}
            <div className="relative">
              {/* Screen Glow */}
              <div className="absolute -inset-4 bg-blue-500/20 rounded-[2rem] blur-2xl opacity-50"></div>

              {/* MacBook Screen */}
              <div className="relative bg-gray-900 rounded-t-[1.5rem] border-4 border-gray-900 overflow-hidden shadow-2xl">
                {/* Browser Window */}
                <div className="bg-[#1a1a1a] p-2 border-b border-gray-800">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <div className="bg-[#0d0d0d] px-3 py-1.5 rounded-md text-xs text-gray-500 flex items-center gap-2">
                    <div className="w-3 h-3 text-gray-600">🔒</div>
                    studysphere.com/study-rooms/session
                  </div>
                </div>

                {/* Video Grid */}
                <div className="bg-[#0d0d0d] p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Participant 1 */}
                    <div className="relative bg-gray-800 rounded-lg aspect-video overflow-hidden border border-gray-700">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <span className="text-2xl font-bold text-orange-400">JS</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white">
                        John Smith
                      </div>
                      <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                    </div>

                    {/* Participant 2 */}
                    <div className="relative bg-gray-800 rounded-lg aspect-video overflow-hidden border border-gray-700">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-2xl font-bold text-blue-400">AK</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white">
                        Alex Kumar
                      </div>
                    </div>

                    {/* Participant 3 */}
                    <div className="relative bg-gray-800 rounded-lg aspect-video overflow-hidden border border-gray-700">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <span className="text-2xl font-bold text-purple-400">MD</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white">
                        Maria Davis
                      </div>
                    </div>

                    {/* You */}
                    <div className="relative bg-gray-800 rounded-lg aspect-video overflow-hidden border-2 border-orange-500">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">You</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-orange-500/80 backdrop-blur-sm rounded text-xs text-white font-medium">
                        You (Host)
                      </div>
                    </div>
                  </div>

                  {/* Control Bar */}
                  <div className="flex justify-center gap-3 mt-6">
                    <button className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors border border-gray-700">
                      <Video className="w-5 h-5 text-white" />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors">
                      <span className="text-white text-sm font-bold">End</span>
                    </button>
                    <button className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors border border-gray-700">
                      <Users className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* MacBook Base */}
              <div className="h-2 bg-gray-800 rounded-b-lg"></div>
              <div className="h-3 bg-gray-900 rounded-b-xl mx-8"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature 2: Attendance Tracking */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 border-t border-gray-800">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 relative"
          >
            {/* MacBook Frame */}
            <div className="relative">
              <div className="absolute -inset-4 bg-green-500/20 rounded-[2rem] blur-2xl opacity-50"></div>

              <div className="relative bg-gray-900 rounded-t-[1.5rem] border-4 border-gray-900 overflow-hidden shadow-2xl">
                <div className="bg-[#1a1a1a] p-2 border-b border-gray-800">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <div className="bg-[#0d0d0d] px-3 py-1.5 rounded-md text-xs text-gray-500 flex items-center gap-2">
                    <div className="w-3 h-3 text-gray-600">🔒</div>
                    studysphere.com/attendance
                  </div>
                </div>

                <div className="bg-[#0d0d0d] p-6">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <div className="text-3xl font-bold text-green-400 mb-1">92%</div>
                      <div className="text-xs text-gray-400">Attendance</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <div className="text-3xl font-bold text-orange-400 mb-1">45</div>
                      <div className="text-xs text-gray-400">Days Present</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <div className="text-3xl font-bold text-blue-400 mb-1">12</div>
                      <div className="text-xs text-gray-400">Day Streak</div>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                    <div className="grid grid-cols-7 gap-2">
                      {[...Array(35)].map((_, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded flex items-center justify-center text-xs ${i % 5 === 0
                              ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                              : 'bg-green-500/20 border border-green-500/30 text-green-400'
                            }`}
                        >
                          {i < 5 ? '' : i - 4}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-2 bg-gray-800 rounded-b-lg"></div>
              <div className="h-3 bg-gray-900 rounded-b-xl mx-8"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-medium mb-6">
              <CalendarCheck className="w-3 h-3" />
              Tracking
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Never miss a <span className="text-orange-500">class</span>
            </h2>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Smart attendance tracking with automated analytics. Get insights into your attendance patterns,
              view detailed reports, and stay on top of your academic goals.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-gray-300">Automated tracking for school & college</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-gray-300">Visual calendar & detailed analytics</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-gray-300">Subject-wise attendance breakdown</span>
              </li>
            </ul>

            <Link to="/register" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-medium transition-colors">
              Start tracking <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature 3: AI Quizzes */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 border-t border-gray-800">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-medium mb-6">
              <HelpCircle className="w-3 h-3" />
              AI-Powered
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Test yourself with <span className="text-orange-500">AI quizzes</span>
            </h2>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Generate custom quizzes on any topic using AI. Get instant feedback, track your progress,
              and identify areas for improvement with detailed analytics.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-gray-300">AI-generated questions on any topic</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-gray-300">Instant feedback & explanations</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-gray-300">Performance tracking & insights</span>
              </li>
            </ul>

            <Link to="/register" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-medium transition-colors">
              Try a quiz <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-purple-500/20 rounded-[2rem] blur-2xl opacity-50"></div>

              <div className="relative bg-gray-900 rounded-t-[1.5rem] border-4 border-gray-900 overflow-hidden shadow-2xl">
                <div className="bg-[#1a1a1a] p-2 border-b border-gray-800">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <div className="bg-[#0d0d0d] px-3 py-1.5 rounded-md text-xs text-gray-500 flex items-center gap-2">
                    <div className="w-3 h-3 text-gray-600">🔒</div>
                    studysphere.com/quiz/javascript-basics
                  </div>
                </div>

                <div className="bg-[#0d0d0d] p-6">
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-xs text-gray-400">Question 3 of 10</div>
                    <div className="flex gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400">5:24</span>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      What is the purpose of the 'useState' hook in React?
                    </h3>

                    <div className="space-y-3">
                      {[
                        'To manage component state',
                        'To handle side effects',
                        'To create context',
                        'To memo ize values'
                      ].map((option, i) => (
                        <label
                          key={i}
                          className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${i === 0
                              ? 'bg-orange-500/10 border-orange-500/50'
                              : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                            }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${i === 0 ? 'border-orange-500' : 'border-gray-600'
                            }`}>
                            {i === 0 && <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>}
                          </div>
                          <span className="text-sm text-gray-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors">
                    Next Question
                  </button>
                </div>
              </div>

              <div className="h-2 bg-gray-800 rounded-b-lg"></div>
              <div className="h-3 bg-gray-900 rounded-b-xl mx-8"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature 4: Learning Roadmap */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 border-t border-gray-800">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 relative"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-cyan-500/20 rounded-[2rem] blur-2xl opacity-50"></div>

              <div className="relative bg-gray-900 rounded-t-[1.5rem] border-4 border-gray-900 overflow-hidden shadow-2xl">
                <div className="bg-[#1a1a1a] p-2 border-b border-gray-800">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <div className="bg-[#0d0d0d] px-3 py-1.5 rounded-md text-xs text-gray-500 flex items-center gap-2">
                    <div className="w-3 h-3 text-gray-600">🔒</div>
                    studysphere.com/roadmap/web-development
                  </div>
                </div>

                <div className="bg-[#0d0d0d] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Web Development Roadmap</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <BarChart3 className="w-4 h-4 text-orange-400" />
                      <span className="text-gray-400">45% Complete</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Completed Step */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="w-0.5 h-12 bg-green-500"></div>
                      </div>
                      <div className="flex-1 pb-4">
                        <h4 className="font-semibold text-white mb-1">HTML & CSS Basics</h4>
                        <p className="text-xs text-gray-400 mb-2">Completed 2 weeks ago</p>
                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 w-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Current Step */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center border-2 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                          <span className="text-orange-500 font-bold">2</span>
                        </div>
                        <div className="w-0.5 h-12 bg-gray-700"></div>
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">JavaScript Fundamentals</h4>
                          <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] font-bold rounded-full">IN PROGRESS</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">Est. 3 weeks</p>
                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 w-[65%]"></div>
                        </div>
                      </div>
                    </div>

                    {/* Locked Step */}
                    <div className="flex gap-4 opacity-50">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700">
                          <span className="text-gray-500 font-bold">3</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">React & Modern Frameworks</h4>
                        <p className="text-xs text-gray-400">Locked - Complete step 2</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-2 bg-gray-800 rounded-b-lg"></div>
              <div className="h-3 bg-gray-900 rounded-b-xl mx-8"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-medium mb-6">
              <Map className="w-3 h-3" />
              Personalized
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Your path to <span className="text-orange-500">mastery</span>
            </h2>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Get AI-generated learning roadmaps tailored to your goals. Follow step-by-step paths,
              track progress, and unlock achievements as you learn.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-gray-300">AI-powered personalized paths</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-gray-300">Progress tracking & milestones</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-gray-300">Curated resources for each step</span>
              </li>
            </ul>

            <Link to="/register" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-medium transition-colors">
              Create your roadmap <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature 5: Resume Analyzer */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 border-t border-gray-800">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 text-xs font-medium mb-6">
              <Briefcase className="w-3 h-3" />
              Career Tools
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Career-ready in <span className="text-orange-500">minutes</span>
            </h2>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Get AI-powered resume analysis with actionable insights. Optimize for ATS systems,
              improve your content, and increase your chances of landing interviews.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-gray-300">AI-powered ATS scoring</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-gray-300">Keyword optimization suggestions</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-gray-300">Format & content improvements</span>
              </li>
            </ul>

            <Link to="/register" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-medium transition-colors">
              Analyze your resume <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-pink-500/20 rounded-[2rem] blur-2xl opacity-50"></div>

              <div className="relative bg-gray-900 rounded-t-[1.5rem] border-4 border-gray-900 overflow-hidden shadow-2xl">
                <div className="bg-[#1a1a1a] p-2 border-b border-gray-800">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <div className="bg-[#0d0d0d] px-3 py-1.5 rounded-md text-xs text-gray-500 flex items-center gap-2">
                    <div className="w-3 h-3 text-gray-600">🔒</div>
                    studysphere.com/placement/resume-analyzer
                  </div>
                </div>

                <div className="bg-[#0d0d0d] p-6">
                  {/* Score Overview */}
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-800">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Resume Analysis</h3>
                      <p className="text-xs text-gray-400">Last updated 2 mins ago</p>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-green-400 mb-1">87</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide">ATS Score</div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">Keyword Match</span>
                        <span className="text-xs text-gray-400 font-mono">92%</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[92%] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">Formatting</span>
                        <span className="text-xs text-gray-400 font-mono">88%</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[88%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">Impact Verbs</span>
                        <span className="text-xs text-gray-400 font-mono">65%</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 w-[65%] rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <div className="flex gap-3">
                      <Trophy className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-orange-300 mb-1">Top Suggestion</h4>
                        <p className="text-xs text-orange-200/80 leading-relaxed">
                          Add 3-4 more action verbs like "Developed", "Implemented", or "Optimized" to boost your impact score.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-2 bg-gray-800 rounded-b-lg"></div>
              <div className="h-3 bg-gray-900 rounded-b-xl mx-8"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-32 px-6 text-center border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Start your learning journey <span className="text-orange-500">today</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of students already using StudySphere. Free forever.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all text-lg">
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800 bg-[#0d1117]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">StudySphere</span>
          </div>

          <p className="text-gray-500 text-sm">
            © 2026 StudySphere. All rights reserved. Built with ❤️ for students.
          </p>

          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
