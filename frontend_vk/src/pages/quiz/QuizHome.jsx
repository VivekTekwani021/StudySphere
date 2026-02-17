import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Sparkles, Trophy, Clock, Zap,
  CircleHelp, ArrowRight, Loader2, Target
} from "lucide-react";
import { quizApi } from "../../api/quizApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const features = [
  { icon: Brain, title: "AI-Generated", desc: "Smart questions tailored to your topic" },
  { icon: Clock, title: "10 Questions", desc: "Complete quiz in under 10 minutes" },
  { icon: Trophy, title: "Track Mastery", desc: "Know your Strong & Weak areas" },
  { icon: Target, title: "Adaptive", desc: "Questions match your skill level" }
];

const difficulties = [
  { id: "easy", label: "Easy", desc: "Fundamentals", icon: "🌱" },
  { id: "medium", label: "Medium", desc: "Intermediate", icon: "⚡" },
  { id: "hard", label: "Hard", desc: "Advanced", icon: "🔥" },
];

const suggestedTopics = [
  "Binary Search", "React Hooks", "SQL Joins", "OOPs",
  "Recursion", "Dynamic Programming", "REST API", "System Design"
];

const QuizHome = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // Assuming we might want user name etc.

  const handleStartQuiz = async () => {
    if (!topic.trim()) {
      return toast.error("Please enter a topic");
    }

    try {
      setLoading(true);
      const data = await quizApi.generateQuiz(topic, difficulty);
      localStorage.setItem("quizData", JSON.stringify({ ...data, topic, difficulty }));
      navigate("/quiz/attempt");
    } catch (err) {
      toast.error("Failed to generate quiz. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) handleStartQuiz();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">

      {/* Header Section */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#141414] border border-[#1F1F1F] rounded-lg">
                <Brain className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-xs font-medium text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                AI Powered
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Quiz Challenge
            </h1>
            <p className="text-gray-400 max-w-xl">
              Test your knowledge with AI-generated quizzes. Select a topic, choose your difficulty, and challenge yourself.
            </p>
          </div>

          <div className="flex gap-3">
            {/* Stats or history button could go here */}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Configuration (8 cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Topic Input Card */}
            <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-8">
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What do you want to learn? <span className="text-orange-500">*</span>
                </label>
                <div className="relative group">
                  <CircleHelp className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Enter topic (e.g., React Hooks, System Design...)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-4 bg-[#141414] border border-[#1F1F1F] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Suggestions */}
              <div className="mb-8">
                <label className="block text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">
                  Popular Topics
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestedTopics.map((t, index) => (
                    <button
                      key={index}
                      onClick={() => setTopic(t)}
                      className={`px-4 py-2 text-sm rounded-lg border transition-all ${topic === t
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-[#141414] text-gray-400 border-[#1F1F1F] hover:border-gray-600 hover:text-white'
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => setDifficulty(diff.id)}
                      className={`relative p-4 rounded-xl border transition-all text-left group ${difficulty === diff.id
                          ? 'bg-[#141414] border-orange-500 ring-1 ring-orange-500/20'
                          : 'bg-[#141414] border-[#1F1F1F] hover:border-gray-600'
                        }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg">{diff.icon}</span>
                        <span className={`font-semibold ${difficulty === diff.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                          {diff.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 pl-8">{diff.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Start Action */}
            <button
              onClick={handleStartQuiz}
              disabled={loading}
              className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Start AI Quiz
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

          </div>

          {/* Right Column: Features Info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Info Card */}
            <div className="bg-[#141414] border border-[#1F1F1F] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-semibold text-white">Why take this quiz?</h3>
              </div>

              <div className="space-y-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1">
                      <feature.icon className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white mb-0.5">{feature.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hint Box */}
            <div className="bg-gradient-to-br from-[#141414] to-black border border-[#1F1F1F] rounded-2xl p-6 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-white font-medium mb-2">Pro Tip</h4>
                <p className="text-sm text-gray-500">
                  Detailed explanations are provided for every wrong answer. Use them to create new study notes!
                </p>
              </div>
              {/* Decorative orb */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizHome;
