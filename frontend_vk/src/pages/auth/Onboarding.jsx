import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingApi } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { School, BookOpen, CheckCircle, GraduationCap, ChevronRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Onboarding = () => {
  const [educationLevel, setEducationLevel] = useState(''); // 'School' or 'College'
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!educationLevel) {
      toast.error('Please select your education level');
      return;
    }

    setLoading(true);
    try {
      const response = await onboardingApi.complete({ educationLevel });
      if (response.success) {
        toast.success('Setup complete!');
        if (response.data && response.data.user) {
          updateUser(response.data.user);
        } else {
          updateUser({ educationLevel, isOnboarded: true });
        }
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Onboarding failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-900/10 to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10">

        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-medium mb-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Welcome to StudySphere</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            Let's personalize your experience
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Tell us a bit about your current education status so we can tailor the platform for you.
          </motion.p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

          {/* School Option */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.02, borderColor: 'rgba(249, 115, 22, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setEducationLevel('School')}
            className={`cursor-pointer group relative p-8 rounded-3xl border-2 transition-all duration-300 ${educationLevel === 'School'
                ? 'bg-[#141414] border-orange-500 shadow-2xl shadow-orange-900/20'
                : 'bg-[#0A0A0A] border-[#1F1F1F] hover:bg-[#141414]'
              }`}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl transition-colors ${educationLevel === 'School' ? 'bg-orange-500 text-white' : 'bg-[#1F1F1F] text-gray-400 group-hover:text-white'
                  }`}>
                  <School size={32} strokeWidth={1.5} />
                </div>
                {educationLevel === 'School' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-orange-500 rounded-full p-1"
                  >
                    <CheckCircle className="text-white w-5 h-5" />
                  </motion.div>
                )}
              </div>

              <div className="space-y-3 mt-auto">
                <h3 className={`text-2xl font-bold transition-colors ${educationLevel === 'School' ? 'text-white' : 'text-gray-200 group-hover:text-white'
                  }`}>
                  School Student
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  For students in K-12. Track daily attendance, manage homework, and master basic subjects.
                </p>
              </div>
            </div>
          </motion.div>

          {/* College Option */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02, borderColor: 'rgba(249, 115, 22, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setEducationLevel('College')}
            className={`cursor-pointer group relative p-8 rounded-3xl border-2 transition-all duration-300 ${educationLevel === 'College'
                ? 'bg-[#141414] border-orange-500 shadow-2xl shadow-orange-900/20'
                : 'bg-[#0A0A0A] border-[#1F1F1F] hover:bg-[#141414]'
              }`}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl transition-colors ${educationLevel === 'College' ? 'bg-orange-500 text-white' : 'bg-[#1F1F1F] text-gray-400 group-hover:text-white'
                  }`}>
                  <GraduationCap size={32} strokeWidth={1.5} />
                </div>
                {educationLevel === 'College' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-orange-500 rounded-full p-1"
                  >
                    <CheckCircle className="text-white w-5 h-5" />
                  </motion.div>
                )}
              </div>

              <div className="space-y-3 mt-auto">
                <h3 className={`text-2xl font-bold transition-colors ${educationLevel === 'College' ? 'text-white' : 'text-gray-200 group-hover:text-white'
                  }`}>
                  College Student
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  For university students. Track subject-wise attendance, assignments, and advanced topics.
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={handleComplete}
            isLoading={loading}
            className={`
              w-full md:w-auto min-w-[200px] h-14 text-lg font-bold rounded-xl
              bg-orange-600 hover:bg-orange-500 text-white shadow-xl shadow-orange-900/20
              disabled:opacity-50 disabled:cursor-not-allowed transition-all
              flex items-center justify-center gap-2
            `}
            disabled={!educationLevel}
          >
            Get Started
            <ChevronRight className="w-5 h-5" />
          </Button>
        </motion.div>

      </div>
    </div>
  );
};

export default Onboarding;
