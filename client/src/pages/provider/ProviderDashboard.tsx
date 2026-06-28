import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DollarSign, Star, CheckSquare, Clock, ArrowRight, MapPin, Calendar,
  TrendingUp, Briefcase, AlertCircle,
} from 'lucide-react';
import DashboardSidebar from '../../components/DashboardSidebar';
import StatsCard from '../../components/StatsCard';
import AnalyticsChart from '../../components/AnalyticsChart';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Booking, MonthlyAnalytics, ProviderProfile, ProviderStats, Service } from '../../types';
import { formatCurrency, formatDateTime, getStatusColor, getStatusLabel } from '../../utils/helpers';

const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<MonthlyAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [dashboardRes, analyticsRes] = await Promise.all([
        api.get('/providers/dashboard'),
        api.get('/providers/analytics'),
      ]);
      setStats(dashboardRes.data.stats);
      setProfile(dashboardRes.data.profile);
      setRecentBookings(dashboardRes.data.recentBookings);
      setAnalytics(analyticsRes.data.analytics);
    } catch {
      // handle silently
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (bookingId: string, action: 'accept' | 'reject' | 'complete') => {
    setActionLoading(`${bookingId}-${action}`);
    try {
      await api.patch(`/providers/bookings/${bookingId}/${action}`);
      const label = action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : 'completed';
      toast.success(`Booking ${label} successfully!`);
      fetchData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || `Failed to ${action} booking.`);
    } finally {
      setActionLoading(null);
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

  const pendingBookings = recentBookings.filter((b) => b.status === 'pending');
  const activeBookings = recentBookings.filter((b) => b.status === 'accepted');

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <DashboardSidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">
                  Welcome, {user?.name?.split(' ')[0]}! 🔧
                </h1>
                <p className="text-white/40 text-sm mt-1">Your provider dashboard</p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium ${
                profile?.isAvailable
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${profile?.isAvailable ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                {profile?.isAvailable ? 'Available' : 'Unavailable'}
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Earnings"
              value={formatCurrency(stats?.totalEarnings || 0)}
              icon={<DollarSign className="w-5 h-5" />}
              gradient="from-green-600/20 to-green-600/5"
              delay={0}
            />
            <StatsCard
              title="Avg. Rating"
              value={`${(profile?.rating || 0).toFixed(1)} ★`}
              icon={<Star className="w-5 h-5" />}
              gradient="from-yellow-600/20 to-yellow-600/5"
              delay={0.05}
            />
            <StatsCard
              title="Jobs Completed"
              value={stats?.completedJobs || 0}
              icon={<CheckSquare className="w-5 h-5" />}
              gradient="from-indigo-600/20 to-indigo-600/5"
              delay={0.1}
            />
            <StatsCard
              title="Pending Jobs"
              value={stats?.pendingJobs || 0}
              icon={<Clock className="w-5 h-5" />}
              gradient="from-orange-600/20 to-orange-600/5"
              delay={0.15}
            />
          </div>

          {/* Chart */}
          {analytics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Revenue Overview</h2>
                  <p className="text-sm text-white/40">Last 6 months earnings</p>
                </div>
                <Link to="/provider/earnings" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <AnalyticsChart data={analytics} type="area" dataKey="revenue" height={220} />
            </motion.div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pending Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  Pending Jobs
                  {pendingBookings.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold">
                      {pendingBookings.length}
                    </span>
                  )}
                </h2>
                <Link to="/provider/jobs/active" className="text-sm text-indigo-400 hover:text-indigo-300">View all</Link>
              </div>

              {pendingBookings.length === 0 ? (
                <div className="rounded-2xl bg-white/5 border border-white/10">
                  <EmptyState icon={<Briefcase className="w-7 h-7" />} title="No pending jobs" description="New bookings will appear here." />
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingBookings.slice(0, 3).map((booking) => {
                    const service = booking.serviceId as Service;
                    return (
                      <div key={booking._id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-500/20 transition-all">
                        <div className="flex items-start gap-3 mb-3">
                          <img src={service?.image} alt="" className="w-10 h-10 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/1e1b4b/818cf8?text=S'; }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{service?.name}</p>
                            <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {booking.address}
                            </p>
                            <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              {formatDateTime(booking.scheduledAt)}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-indigo-400">{formatCurrency(booking.totalAmount)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(booking._id, 'accept')}
                            disabled={!!actionLoading}
                            className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500/30 transition-all disabled:opacity-50"
                          >
                            {actionLoading === `${booking._id}-accept` ? '...' : '✓ Accept'}
                          </button>
                          <button
                            onClick={() => handleAction(booking._id, 'reject')}
                            disabled={!!actionLoading}
                            className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-all disabled:opacity-50"
                          >
                            {actionLoading === `${booking._id}-reject` ? '...' : '✗ Reject'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Active Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Active Jobs
                </h2>
                <Link to="/provider/jobs/active" className="text-sm text-indigo-400 hover:text-indigo-300">View all</Link>
              </div>

              {activeBookings.length === 0 ? (
                <div className="rounded-2xl bg-white/5 border border-white/10">
                  <EmptyState icon={<CheckSquare className="w-7 h-7" />} title="No active jobs" description="Accepted bookings will appear here." />
                </div>
              ) : (
                <div className="space-y-3">
                  {activeBookings.slice(0, 3).map((booking) => {
                    const service = booking.serviceId as Service;
                    return (
                      <div key={booking._id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/20 transition-all">
                        <div className="flex items-start gap-3 mb-3">
                          <img src={service?.image} alt="" className="w-10 h-10 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/1e1b4b/818cf8?text=S'; }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{service?.name}</p>
                            <p className="text-xs text-white/40 mt-0.5">{booking.address}</p>
                            <p className="text-xs text-white/40">{formatDateTime(booking.scheduledAt)}</p>
                          </div>
                          <span className={`status-badge border ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleAction(booking._id, 'complete')}
                          disabled={!!actionLoading}
                          className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold hover:bg-indigo-500/30 transition-all disabled:opacity-50"
                        >
                          {actionLoading === `${booking._id}-complete` ? 'Completing...' : '✓ Mark as Completed'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;
