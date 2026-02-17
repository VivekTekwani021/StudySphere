import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Youtube, FileText, Sparkles, ArrowRight, Zap, GraduationCap } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const services = [
  {
    id: "content",
    title: "AI Explanations",
    description: "Get instant step-by-step explanations, analogies, and code examples for any topic.",
    icon: BookOpen,
    path: "/learning/content",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    hoverBorder: "hover:border-blue-500/50"
  },
  {
    id: "youtube",
    title: "Video Learning",
    description: "Curated educational videos embedded directly in your workspace without distractions.",
    icon: Youtube,
    path: "/learning/youtube",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    hoverBorder: "hover:border-red-500/50"
  },
  {
    id: "pdf",
    title: "PDF Generator",
    description: "Convert any topic into comprehensive, beautifully formatted study notes in seconds.",
    icon: FileText,
    path: "/learning/pdf",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    hoverBorder: "hover:border-emerald-500/50"
  },
];

export default function LearningRoom() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">

      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#1F1F1F] text-xs font-medium text-orange-500 mb-6">
          <Sparkles className="w-3 h-3" />
          <span>AI-Powered Learning Hub</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
          Master any subject <span className="text-gray-500">faster.</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Choose your preferred way to learn. Whether reading, watching, or revising offline,
          StudySphere adapts to your style.
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(service.path)}
            className={`group relative text-left p-8 rounded-2xl bg-[#0A0A0A] border ${service.borderColor} ${service.hoverBorder} transition-all duration-300 hover:bg-[#141414] hover:shadow-2xl`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${service.bgColor}`}>
              <service.icon className={`w-7 h-7 ${service.color}`} />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-500 transition-colors">
              {service.title}
            </h3>

            <p className="text-gray-400 mb-8 leading-relaxed">
              {service.description}
            </p>

            <div className="flex items-center gap-2 text-sm font-semibold text-white group-hover:translate-x-2 transition-transform">
              Start Learning <ArrowRight className="w-4 h-4" />
            </div>

            {/* Subtle Gradient Glow */}
            <div className={`absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${service.color.replace('text-', 'from-').replace('500', '500/20')} to-transparent -z-10`} />
          </motion.button>
        ))}
      </div>

      {/* Stats / Trust Section */}
      <div className="max-w-6xl mx-auto mt-20 pt-10 border-t border-[#1F1F1F]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold text-white mb-1">100+</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Topics Covered</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold text-white mb-1">AI</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Real-time Analysis</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold text-white mb-1">Instant</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest">PDF Generation</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold text-white mb-1">HD</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Video Content</p>
          </div>
        </div>
      </div>
    </div>
  );
}
