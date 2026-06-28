import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Camera, Save, Shield } from 'lucide-react';
import DashboardSidebar from '../../components/DashboardSidebar';
import GradientButton from '../../components/GradientButton';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getInitials, formatDate } from '../../utils/helpers';

interface ProfileFormData {
  name: string;
  phone: string;
}

const CustomerProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const { data: res } = await api.put('/auth/profile', data);
      updateUser(res.user);
      toast.success('Profile updated successfully!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <DashboardSidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-black text-white">Profile Settings</h1>
            <p className="text-white/40 text-sm mt-1">Manage your account information</p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6"
          >
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-black text-white">
                  {getInitials(user?.name || 'U')}
                </div>
                <button className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-indigo-600 border-2 border-[#0a0a0f] flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <p className="text-sm text-white/40">{user?.email}</p>
                <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium">
                  <Shield className="w-3 h-3" />
                  {user?.role}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Edit Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6"
          >
            <h3 className="text-base font-bold text-white mb-5">Personal Information</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
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
                    value={user?.email}
                    disabled
                    className="input-field pl-11 opacity-40 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-white/30">Email cannot be changed</p>
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

              <GradientButton
                type="submit"
                isLoading={isLoading}
                disabled={!isDirty}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </GradientButton>
            </form>
          </motion.div>

          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-base font-bold text-white mb-4">Account Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2.5 border-b border-white/10">
                <span className="text-sm text-white/50">Account Type</span>
                <span className="text-sm font-medium text-white capitalize">{user?.role}</span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-white/10">
                <span className="text-sm text-white/50">Member Since</span>
                <span className="text-sm font-medium text-white">{user?.createdAt ? formatDate(user.createdAt) : '—'}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-sm text-white/50">User ID</span>
                <span className="text-xs font-mono text-white/40">{user?._id?.slice(-10)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CustomerProfile;
