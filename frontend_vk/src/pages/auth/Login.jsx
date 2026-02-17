import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Code2, Mail, Lock, ArrowRight, Loader2, Sparkles, Video, Map, FileCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, googleLogin } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user) {
        if (user.isOnboardingComplete === false) {
          navigate("/onboarding");
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const user = await googleLogin(credentialResponse);
      if (user) {
        if (user.isOnboardingComplete === false) {
          navigate("/onboarding");
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0a0e1a]">

      {/* Left Side - Brand */}
      <div className="hidden lg:flex w-1/2 bg-[#0d1117] relative overflow-hidden items-center justify-center p-12 border-r border-gray-800">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-white max-w-lg">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Code2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">StudySphere</span>
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Welcome back to your
            <span className="block text-orange-500">learning hub</span>
          </h1>

          <p className="text-lg text-gray-400 mb-12 leading-relaxed">
            Continue your academic journey with AI-powered insights, collaborative study rooms, and personalized roadmaps.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/30 backdrop-blur border border-gray-700 rounded-xl p-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3">
                <Video className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Study Rooms</h3>
              <p className="text-sm text-gray-400">Collaborate live</p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur border border-gray-700 rounded-xl p-4">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-3">
                <Map className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">AI Roadmaps</h3>
              <p className="text-sm text-gray-400">Personalized paths</p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur border border-gray-700 rounded-xl p-4">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">AI Quizzes</h3>
              <p className="text-sm text-gray-400">Instant feedback</p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur border border-gray-700 rounded-xl p-4">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-3">
                <FileCheck className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Resume AI</h3>
              <p className="text-sm text-gray-400">Career-ready</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">

          {/* Header */}
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">StudySphere</span>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
            <p className="text-gray-400">
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Google Sign In */}
          <div className="w-full flex justify-center py-2">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.log('Login Failed');
              }}
              useOneTap
              theme="filled_blue"
              shape="pill"
              size="large"
              width="100%"
              text="continue_with"
            />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0e1a] px-3 text-gray-500">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-800 bg-[#111827] text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-orange-500 hover:text-orange-400 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-800 bg-[#111827] text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-orange-500 hover:text-orange-400 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
