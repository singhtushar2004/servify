import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, CheckCircle, Clock, XCircle, TrendingUp, ArrowRight,
  Car, Wrench, HardHat, Sparkles, ChefHat, Plus,
} from 'lucide-react';
import DashboardSidebar from '../../components/DashboardSidebar';
import StatsCard from '../../components/StatsCard';
import BookingModal from '../../components/BookingModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { Booking, DashboardStats, Service } from '../../types';
import { formatCurrency, formatDateTime, getStatusColor, getStatusLabel } from '../../utils/helpers';

const categoryCards = [
  { icon: Car, label: 'Car Wash', category: 'carwash', color: 'from-blue-500/20 to-blue-600/5', border: 'hover:border-blue-500/40' },
  { icon: Wrench, label: 'Plumbing', category: 'plumber', color: 'from-orange-500/20 to-orange-600/5', border: 'hover:border-orange-500/40' },
  { icon: HardHat, label: 'Carpentry', category: 'carpenter', color: 'from-amber-500/20 to-amber-600/5', border: 'hover:border-amber-500/40' },
  { icon: Sparkles, label: 'Cleaning', category: 'maid', color: 'from-emerald-500/20 to-emerald-600/5', border: 'hover:border-emerald-500/40' },
  { icon: ChefHat, label: 'Cook', category: 'cook', color: 'from-pink-500/20 to-pink-600/5', border: 'hover:border-pink-500/40' },
];

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [dashboardRes, servicesRes] = await Promise.all([
        api.get('/bookings/dashboard'),
        api.get('/services'),
      ]);
      setStats(dashboardRes.data.stats);
      setRecentBookings(dashboardRes.data.recentBookings);
      setServices(servicesRes.data.services);
    } catch {
      // handle silently
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCategoryClick = (category: string) => {
    const service = services.find((s) => s.category === category);
    if (service) {
      setSelectedService(service);
      setIsModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0f]">
        <DashboardSidebar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <DashboardSidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">
                  Good morning, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-white/40 text-sm mt-1">Here's your service dashboard</p>
              </div>
              <Link
                to="/services"
                className="btn-primary !py-2.5 !px-5 !text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Book a Service
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Bookings"
              value={stats?.totalBookings || 0}
              icon={<Calendar className="w-5 h-5" />}
              gradient="from-indigo-600/20 to-indigo-600/5"
              delay={0}
            />
            <StatsCard
              title="Completed"
              value={stats?.completedBookings || 0}
              icon={<CheckCircle className="w-5 h-5" />}
              gradient="from-green-600/20 to-green-600/5"
              delay={0.05}
            />
            <StatsCard
              title="Pending"
              value={stats?.pendingBookings || 0}
              icon={<Clock className="w-5 h-5" />}
              gradient="from-yellow-600/20 to-yellow-600/5"
              delay={0.1}
            />
            <StatsCard
              title="Total Spent"
              value={formatCurrency(stats?.totalSpent || 0)}
              icon={<TrendingUp className="w-5 h-5" />}
              gradient="from-purple-600/20 to-purple-600/5"
              delay={0.15}
            />
          </div>

          {/* Quick Book */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Quick Book</h2>
              <Link to="/services" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                All services <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {categoryCards.map((cat, i) => (
                <motion.button
                  key={cat.category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleCategoryClick(cat.category)}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-gradient-to-br ${cat.color} border border-white/10 ${cat.border} transition-all duration-200`}
                >
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                    <cat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-white">{cat.label}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Recent Bookings</h2>
              <Link to="/bookings" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="rounded-2xl bg-white/5 border border-white/10">
                <EmptyState
                  icon={<Calendar className="w-9 h-9" />}
                  title="No bookings yet"
                  description="Book your first home service and it will appear here."
                  action={
                    <Link to="/services" className="btn-primary !py-2 !px-5 !text-sm">
                      Browse Services
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking, i) => {
                  const service = booking.serviceId as Service;
                  return (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <img
                        src={service?.image || ''}
                        alt={service?.name || 'Service'}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/1e1b4b/818cf8?text=S'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{service?.name}</p>
                        <p className="text-xs text-white/40">{formatDateTime(booking.scheduledAt)}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <p className="text-sm font-bold text-white">{formatCurrency(booking.totalAmount)}</p>
                        <span className={`status-badge border ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <BookingModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedService(null); }}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default CustomerDashboard;
