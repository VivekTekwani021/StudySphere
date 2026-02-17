import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Target, Clock, Brain, CheckCircle2, XCircle,
  ArrowRight, RefreshCw, Lightbulb, TrendingUp, Award, Share2
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const QuizResult = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const storedResult = localStorage.getItem("quizResult");

    if (!storedResult) {
      navigate("/quiz");
      return;
    }

    const parsed = JSON.parse(storedResult);
    setResult(parsed);

    if (parsed.accuracy >= 70) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [navigate]);

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMasteryInfo = (status) => {
    switch (status) {
      case 'Strong':
        return { color: 'text-green-500', icon: Trophy, message: "Excellent Mastery" };
      case 'Average':
        return { color: 'text-orange-500', icon: TrendingUp, message: "Good Progress" };
      default:
        return { color: 'text-gray-400', icon: Target, message: "Needs Review" };
    }
  };

  const handleNewQuiz = () => {
    localStorage.removeItem("quizData");
    localStorage.removeItem("quizResult");
    navigate("/quiz");
  };

  if (!result) return null;

  const masteryInfo = getMasteryInfo(result.masteryStatus);
  const MasteryIcon = masteryInfo.icon;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">

      {/* Subtle Confetti Container */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  y: -20,
                  x: Math.random() * window.innerWidth,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: Math.random() * 2 + 3,
                  ease: "linear"
                }}
                className="absolute w-2 h-2 bg-orange-500/50 rounded-full"
                style={{ left: `${Math.random() * 100}%` }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto space-y-8">

        {/* Value Proposition / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#1F1F1F] text-xs font-medium text-gray-400 mb-4">
            <Brain className="w-3 h-3 text-orange-500" />
            <span>AI Assessment Complete</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Quiz Results
          </h1>
          <p className="text-gray-500">
            {result.topic} • {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Main Score Card */}
        <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-8 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">

            {/* Left: Big Score */}
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-2">Total Score</p>
              <div className="flex items-baseline gap-2 justify-center md:justify-start">
                <span className="text-6xl md:text-7xl font-bold text-white tracking-tighter">
                  {result.score}
                </span>
                <span className="text-xl text-gray-600 font-medium">/ {(result.totalQuestions || 10) * 10}</span>
              </div>
              <div className={`flex items-center gap-2 mt-4 justify-center md:justify-start ${masteryInfo.color}`}>
                <MasteryIcon className="w-5 h-5" />
                <span className="font-semibold">{masteryInfo.message}</span>
              </div>
            </div>

            {/* Right: Detailed Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#141414] border border-[#1F1F1F]">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <Target className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-medium">Accuracy</span>
                </div>
                <p className="text-2xl font-bold text-white">{result.accuracy}%</p>
              </div>
              <div className="p-4 rounded-xl bg-[#141414] border border-[#1F1F1F]">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-medium">Time</span>
                </div>
                <p className="text-2xl font-bold text-white">{formatTime(result.timeElapsed)}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#141414] border border-[#1F1F1F]">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-medium">Correct</span>
                </div>
                <p className="text-2xl font-bold text-white">{Math.round((result.accuracy / 100) * (result.totalQuestions || 10))}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#141414] border border-[#1F1F1F]">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <XCircle className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-medium">Wrong</span>
                </div>
                <p className="text-2xl font-bold text-white">{result.wrongAnswers ? result.wrongAnswers.length : 0}</p>
              </div>
            </div>
          </div>

          {/* Background Gradient Mesh */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleNewQuiz}
            className="px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Another Quiz
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-[#141414] text-white border border-[#1F1F1F] font-semibold rounded-xl hover:bg-[#1F1F1F] transition-colors flex items-center justify-center gap-2"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Wrong Answers Analysis */}
        {result.wrongAnswers?.length > 0 && (
          <div className="pt-8 border-t border-[#1F1F1F]">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Review Mistakes
            </h2>

            <div className="space-y-6">
              {result.wrongAnswers.map((item, idx) => (
                <div key={idx} className="group bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 hover:border-gray-800 transition-colors">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#141414] text-gray-500 text-xs font-bold flex items-center justify-center border border-[#1F1F1F]">
                      {idx + 1}
                    </span>
                    <p className="text-lg font-medium text-white leading-snug">
                      {item.question}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 ml-10">
                    {/* Your Answer (Wrong) */}
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                      <div className="flex items-center gap-2 mb-2 text-red-400 text-xs font-bold uppercase tracking-wider">
                        <XCircle className="w-3 h-3" /> Your Answer
                      </div>
                      <p className="text-gray-300">
                        {item.options?.[item.yourAnswer] || `Option ${item.yourAnswer + 1}`}
                      </p>
                    </div>

                    {/* Correct Answer */}
                    <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-2 text-green-400 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" /> Correct Answer
                      </div>
                      <p className="text-gray-300">
                        {item.options?.[item.correctAnswer] || `Option ${item.correctAnswer + 1}`}
                      </p>
                    </div>
                  </div>

                  {/* Explanation */}
                  {item.explanation && (
                    <div className="mt-4 ml-10 p-4 rounded-xl bg-[#141414] border border-[#1F1F1F]">
                      <div className="flex items-center gap-2 mb-2 text-orange-500 text-xs font-bold uppercase tracking-wider">
                        <Lightbulb className="w-3 h-3" /> Explanation
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResult;
