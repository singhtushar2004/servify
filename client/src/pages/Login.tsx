import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import GradientButton from '../components/GradientButton';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back! Redirecting to your dashboard...');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl" />

        <div className="relative text-center px-12">
          <Link to="/" className="flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-glow">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-black text-white">Servify</span>
          </Link>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Welcome Back<br />
            <span className="gradient-text">to Servify</span>
          </h2>
          <p className="text-white/50 text-lg mb-10">
            Book home services in minutes. Your trusted professionals are just a tap away.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: '5L+', sub: 'Happy Customers' },
              { label: '4.9★', sub: 'Average Rating' },
              { label: '2400+', sub: 'Verified Pros' },
              { label: '30+', sub: 'Cities' },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xl font-black text-white">{item.label}</p>
                <p className="text-xs text-white/40">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white">Servify</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-white mb-2">Sign In</h1>
            <p className="text-white/50">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                  })}
                  placeholder="you@example.com"
                  className="input-field pl-11"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white/70">Password</label>
                <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                  placeholder="Enter your password"
                  className="input-field pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <GradientButton type="submit" isLoading={isLoading} fullWidth size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Sign In
            </GradientButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/40 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Create one free
              </Link>
            </p>
          </div>

          {/* Demo accounts */}
          <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/40 text-center mb-3 font-medium">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
                  const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
                  if (emailInput) emailInput.value = 'customer@demo.com';
                  if (passwordInput) passwordInput.value = 'demo123';
                }}
                className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 hover:bg-indigo-500/20 transition-all text-center"
              >
                👤 Customer Demo
              </button>
              <button
                type="button"
                onClick={() => {
                  const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
                  const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
                  if (emailInput) emailInput.value = 'provider@demo.com';
                  if (passwordInput) passwordInput.value = 'demo123';
                }}
                className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 hover:bg-purple-500/20 transition-all text-center"
              >
                🔧 Provider Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
