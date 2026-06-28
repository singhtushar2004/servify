import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Phone, Eye, EyeOff, Zap, ArrowRight, UserCheck, Wrench } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import GradientButton from '../components/GradientButton';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: 'customer' | 'provider';
  specialization?: string;
}

const specializations = [
  { value: 'carwash', label: '🚗 Car Wash' },
  { value: 'plumber', label: '🔧 Plumbing' },
  { value: 'carpenter', label: '🪚 Carpentry' },
  { value: 'maid', label: '🧹 Home Cleaning' },
  { value: 'cook', label: '👨‍🍳 Personal Cook' },
];

const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'customer' | 'provider'>('customer');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterFormData>({
    defaultValues: { role: 'customer' },
  });

  const password = watch('password');

  const handleRoleChange = (newRole: 'customer' | 'provider') => {
    setRole(newRole);
    setValue('role', newRole);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone,
        specialization: data.specialization,
      });
      toast.success(`Welcome to Servify, ${data.name}! Your account has been created.`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-10">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-white">Servify</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2 text-center">Create Account</h1>
            <p className="text-white/50 text-center">Join 5 lakh+ customers on Servify today</p>
          </div>

          {/* Role Selector */}
          <div className="flex gap-3 mb-7">
            <button
              type="button"
              onClick={() => handleRoleChange('customer')}
              className={`flex-1 flex items-center gap-2.5 px-4 py-3.5 rounded-xl border transition-all duration-200 ${
                role === 'customer'
                  ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white/80'
              }`}
            >
              <UserCheck className={`w-5 h-5 ${role === 'customer' ? 'text-indigo-400' : 'text-white/40'}`} />
              <div className="text-left">
                <p className="text-sm font-bold">Customer</p>
                <p className="text-xs opacity-60">Book services</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('provider')}
              className={`flex-1 flex items-center gap-2.5 px-4 py-3.5 rounded-xl border transition-all duration-200 ${
                role === 'provider'
                  ? 'bg-purple-600/20 border-purple-500/50 text-white'
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white/80'
              }`}
            >
              <Wrench className={`w-5 h-5 ${role === 'provider' ? 'text-purple-400' : 'text-white/40'}`} />
              <div className="text-left">
                <p className="text-sm font-bold">Provider</p>
                <p className="text-xs opacity-60">Earn money</p>
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register('role')} value={role} />

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                  placeholder="Your full name"
                  className="input-field pl-11"
                />
              </div>
              {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>}
            </div>

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
              <label className="block text-sm font-medium text-white/70 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="+91 98765 43210"
                  className="input-field pl-11"
                />
              </div>
            </div>

            {role === 'provider' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-white/70 mb-2">Specialization</label>
                <select
                  {...register('specialization', { required: role === 'provider' ? 'Please select your specialization' : false })}
                  className="input-field appearance-none"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" style={{ background: '#0f0c29' }}>Select your expertise...</option>
                  {specializations.map((s) => (
                    <option key={s.value} value={s.value} style={{ background: '#0f0c29' }}>{s.label}</option>
                  ))}
                </select>
                {errors.specialization && <p className="mt-1.5 text-xs text-red-400">{errors.specialization.message}</p>}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                  placeholder="Min. 6 characters"
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

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === password || 'Passwords do not match',
                  })}
                  placeholder="Confirm your password"
                  className="input-field pl-11"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            <GradientButton
              type="submit"
              isLoading={isLoading}
              fullWidth
              size="lg"
              className="mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </GradientButton>
          </form>

          <p className="mt-6 text-center text-white/40 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-white/25">
            By creating an account, you agree to our{' '}
            <span className="text-white/40">Terms of Service</span> and{' '}
            <span className="text-white/40">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
