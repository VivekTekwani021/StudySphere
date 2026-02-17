import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Clock, ArrowRight, ArrowLeft, CheckCircle2,
  Circle, Loader2, Flag, AlertCircle, HelpCircle
} from "lucide-react";
import { quizApi } from "../../api/quizApi";
import toast from "react-hot-toast";

const QuizAttempt = () => {
  const navigate = useNavigate();

  const [quizId, setQuizId] = useState(null);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questions, setQuestions] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const storedQuiz = localStorage.getItem("quizData");

    if (!storedQuiz) {
      navigate("/quiz");
      return;
    }

    try {
      const parsed = JSON.parse(storedQuiz);

      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error("Invalid quiz data");
      }

      setQuizId(parsed.quizId);
      setQuestions(parsed.questions);
      setTopic(parsed.topic || "Quiz");
      setDifficulty(parsed.difficulty || "medium");
      setAnswers(new Array(parsed.questions.length).fill(null));
    } catch (err) {
      console.error("Quiz load failed:", err);
      navigate("/quiz");
    }
  }, [navigate]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!questions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = answers.filter(a => a !== null).length;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelect = (optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const unanswered = answers.filter(a => a === null).length;
    if (unanswered > 0) {
      toast.error(`You have ${unanswered} unanswered question(s)`);
      return;
    }

    try {
      setSubmitting(true);
      const result = await quizApi.submitQuiz(quizId, answers);
      localStorage.setItem("quizResult", JSON.stringify({ ...result, topic, difficulty, timeElapsed }));
      navigate("/quiz/result");
    } catch (error) {
      console.error("Quiz submission failed", error);
      toast.error("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans flex flex-col items-center">

      <div className="w-full max-w-4xl space-y-8">

        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1F1F1F] pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold tracking-tight text-white">{topic}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1F1F1F] text-gray-400 border border-[#333]">
                {difficulty}
              </span>
            </div>
            <p className="text-sm text-gray-500">Question {currentIndex + 1} of {questions.length}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="font-mono text-lg font-medium text-white">{formatTime(timeElapsed)}</span>
            </div>
            {/* Minimal Progress Bar Widget */}
            <div className="w-32 h-1.5 bg-[#1F1F1F] rounded-full overflow-hidden">
              <div className="h-full bg-orange-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Main Question Card */}
        <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-8 md:p-10 relative">

          {/* Question Text */}
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-10 leading-tight">
            {currentQuestion.question}
          </h2>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentIndex] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`group relative text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 ${isSelected
                      ? 'bg-orange-600/10 border-orange-600'
                      : 'bg-[#141414] border-[#1F1F1F] hover:border-gray-600 hover:bg-[#1A1A1A]'
                    }`}
                >
                  {/* Selection Indicator */}
                  <div className={`mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-orange-600 border-orange-600' : 'border-gray-600 group-hover:border-gray-400'
                    }`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>

                  {/* Option Text */}
                  <span className={`text-lg transition-colors ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-6 py-3 rounded-xl flex items-center gap-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex gap-2">
            {/* Question Dots (Optional, for quick nav) */}
            <div className="hidden md:flex gap-1.5 items-center mr-4">
              {questions.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-white' :
                    answers[i] !== null ? 'bg-orange-500' : 'bg-[#333]'
                  }`} />
              ))}
            </div>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                Next Question
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors flex items-center gap-2 shadow-lg shadow-orange-900/20 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Flag className="w-5 h-5" />
                    Submit Results
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuizAttempt;
