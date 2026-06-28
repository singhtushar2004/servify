import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Search, Calendar, DollarSign } from 'lucide-react';
import DashboardSidebar from '../../components/DashboardSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import api from '../../utils/axios';
import { Booking, Service, User } from '../../types';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/helpers';

const CompletedJobs: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/providers/bookings?status=completed');
        setBookings(data.bookings);
        setFiltered(data.bookings);
      } catch {
        // handle silently
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!searchQuery) { setFiltered(bookings); return; }
    const q = searchQuery.toLowerCase();
    setFiltered(bookings.filter((b) => {
      const service = b.serviceId as Service;
      const customer = b.customerId as User;
      return service?.name?.toLowerCase().includes(q) || customer?.name?.toLowerCase().includes(q);
    }));
  }, [searchQuery, bookings]);

  const totalEarned = filtered.reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <DashboardSidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-black text-white">Completed Jobs</h1>
            <p className="text-white/40 text-sm mt-1">Your job completion history</p>
          </motion.div>

          {/* Summary */}
          {!isLoading && bookings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-4 mb-6"
            >
              <div className="p-4 rounded-2xl bg-green-600/10 border border-green-500/20">
                <p className="text-sm text-white/50 mb-1">Total Jobs Completed</p>
                <p className="text-3xl font-black text-white">{bookings.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20">
                <p className="text-sm text-white/50 mb-1">Total Earned</p>
                <p className="text-3xl font-black text-white">{formatCurrency(totalEarned)}</p>
              </div>
            </motion.div>
          )}

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative mb-6"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search completed jobs..."
              className="input-field pl-11 w-full"
            />
          </motion.div>

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<CheckSquare className="w-9 h-9" />}
              title="No completed jobs yet"
              description="Jobs you complete will appear here. Start accepting bookings!"
            />
          ) : (
            <div className="space-y-3">
              {filtered.map((booking, i) => {
                const service = booking.serviceId as Service;
                const customer = booking.customerId as User;
                return (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/20 transition-all"
                  >
                    <img
                      src={service?.image}
                      alt={service?.name}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/56x56/1e1b4b/818cf8?text=S'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <p className="text-base font-bold text-white">{service?.name}</p>
                          <p className="text-sm text-white/50">Customer: {customer?.name}</p>
                        </div>
                        <p className="text-xl font-black text-green-400">{formatCurrency(booking.totalAmount)}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-white/40 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Completed: {booking.completedAt ? formatDate(booking.completedAt) : formatDate(booking.updatedAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5" />
                          Payment {booking.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="px-3 py-1.5 rounded-xl bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">
                        ✓ Completed
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompletedJobs;
