import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { User, Phone, MapPin, Briefcase, DollarSign, Star, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import DashboardSidebar from '../../components/DashboardSidebar';
import GradientButton from '../../components/GradientButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ProviderProfile as ProviderProfileType } from '../../types';
import { formatCurrency, getCategoryLabel, getInitials } from '../../utils/helpers';

interface ProfileFormData {
  bio: string;
  experience: number;
  baseRate: number;
  serviceArea: string;
  specialization: string;
}

const UserFormData: Record<string, unknown> = {};

const specializations = [
  { value: 'carwash', label: 'Car Wash' },
  { value: 'plumber', label: 'Plumbing' },
  { value: 'carpenter', label: 'Carpentry' },
  { value: 'maid', label: 'Home Cleaning' },
  { value: 'cook', label: 'Personal Cook' },
];

const ProviderProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProviderProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileFormData>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/providers/dashboard');
        setProfile(data.profile);
        if (data.profile) {
          reset({
            bio: data.profile.bio || '',
            experience: data.profile.experience || 0,
            baseRate: data.profile.baseRate || 0,
            serviceArea: data.profile.serviceArea || '',
            specialization: data.profile.specialization || '',
          });
        }
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [reset, toast]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      const { data: res } = await api.put('/providers/profile', data);
      setProfile(res.profile);
      toast.success('Profile updated successfully!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAvailability = async () => {
    if (!profile) return;
    setIsTogglingAvailability(true);
    try {
      const { data: res } = await api.put('/providers/profile', { isAvailable: !profile.isAvailable });
      setProfile(res.profile);
      toast.success(`You are now ${res.profile.isAvailable ? 'available' : 'unavailable'} for bookings.`);
    } catch {
      toast.error('Failed to update availability.');
    } finally {
      setIsTogglingAvailability(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0f]">
        <DashboardSidebar />
        <main className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" /></main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <DashboardSidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-black text-white">Provider Profile</h1>
            <p className="text-white/40 text-sm mt-1">Manage your professional profile and settings</p>
          </motion.div>

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-600/15 to-purple-600/10 border border-indigo-500/20 mb-6 overflow-hidden"
          >
            <div className="absolute inset-0 bg-mesh opacity-30" />
            <div className="relative flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-black text-white flex-shrink-0">
                {getInitials(user?.name || 'P')}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <p className="text-indigo-300 font-medium">{getCategoryLabel(profile?.specialization || 'plumber')}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    {profile?.rating.toFixed(1)} rating
                  </span>
                  <span className="text-white/40 text-sm">{profile?.completedJobs} jobs completed</span>
                  <span className="text-white/40 text-sm">{formatCurrency(profile?.totalEarnings || 0)} earned</span>
                </div>
              </div>
              <button
                onClick={toggleAvailability}
                disabled={isTogglingAvailability}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  profile?.isAvailable
                    ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                    : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                } disabled:opacity-50`}
              >
                {profile?.isAvailable ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                {profile?.isAvailable ? 'Available' : 'Unavailable'}
              </button>
            </div>
          </motion.div>

          {/* Edit Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6"
          >
            <h3 className="text-base font-bold text-white mb-5">Professional Details</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Specialization</label>
                <select
                  {...register('specialization')}
                  className="input-field appearance-none"
                  style={{ colorScheme: 'dark' }}
                >
                  {specializations.map((s) => (
                    <option key={s.value} value={s.value} style={{ background: '#0f0c29' }}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Bio / Introduction</label>
                <textarea
                  {...register('bio', { maxLength: { value: 500, message: 'Max 500 characters' } })}
                  rows={3}
                  placeholder="Tell customers about yourself and your expertise..."
                  className="input-field resize-none"
                />
                {errors.bio && <p className="mt-1 text-xs text-red-400">{errors.bio.message}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Years of Experience</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="number"
                      {...register('experience', { min: { value: 0, message: 'Cannot be negative' } })}
                      placeholder="0"
                      min={0}
                      className="input-field pl-11"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Base Rate (₹/service)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="number"
                      {...register('baseRate', { min: { value: 0, message: 'Cannot be negative' } })}
                      placeholder="0"
                      min={0}
                      className="input-field pl-11"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Service Area</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    {...register('serviceArea')}
                    placeholder="e.g., Koramangala, Indiranagar, HSR Layout"
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <GradientButton
                type="submit"
                isLoading={isSaving}
                disabled={!isDirty}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Profile
              </GradientButton>
            </form>
          </motion.div>

          {/* Personal Info (Read-only) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-base font-bold text-white mb-4">Account Information</h3>
            <div className="space-y-3">
              {[
                { icon: User, label: 'Full Name', value: user?.name },
                { icon: User, label: 'Email', value: user?.email },
                { icon: Phone, label: 'Phone', value: user?.phone || 'Not set' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/10 last:border-0">
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <Icon className="w-4 h-4" />
                    {label}
                  </div>
                  <span className="text-sm text-white/80">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProviderProfile;
