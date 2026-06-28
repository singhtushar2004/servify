import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Filter } from 'lucide-react';
import DashboardSidebar from '../../components/DashboardSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import api from '../../utils/axios';
import { useToast } from '../../context/ToastContext';
import { Booking, BookingStatus, Service } from '../../types';
import { formatCurrency, formatDateTime, getStatusColor, getStatusLabel } from '../../utils/helpers';

const statusFilters: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const BookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings?limit=50');
      setBookings(data.bookings);
      setFiltered(data.bookings);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  useEffect(() => {
    let result = bookings;
    if (activeFilter !== 'all') result = result.filter((b) => b.status === activeFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((b) => {
        const service = b.serviceId as Service;
        return service?.name?.toLowerCase().includes(q) || b.address?.toLowerCase().includes(q);
      });
    }
    setFiltered(result);
  }, [activeFilter, searchQuery, bookings]);

  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully.');
      setBookings((prev) => prev.map((b) => b._id === bookingId ? { ...b, status: 'cancelled' as BookingStatus } : b));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <DashboardSidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-black text-white">My Bookings</h1>
            <p className="text-white/40 text-sm mt-1">View and manage all your service bookings</p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bookings..."
                className="input-field pl-11 w-full"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {statusFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeFilter === f.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Calendar className="w-9 h-9" />}
              title="No bookings found"
              description="No bookings match your current filter criteria."
            />
          ) : (
            <div className="space-y-4">
              {filtered.map((booking, i) => {
                const service = booking.serviceId as Service;
                const canCancel = ['pending', 'accepted'].includes(booking.status);

                return (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/15 transition-all"
                  >
                    <div className="flex gap-4">
                      <img
                        src={service?.image || ''}
                        alt={service?.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/1e1b4b/818cf8?text=S'; }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <h3 className="text-base font-bold text-white">{service?.name}</h3>
                            <p className="text-xs text-white/40 mt-0.5">{booking.address}</p>
                          </div>
                          <span className={`status-badge border ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-xs text-white/40 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDateTime(booking.scheduledAt)}
                          </span>
                          <span>Booking #{booking._id.slice(-6).toUpperCase()}</span>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                          <p className="text-lg font-bold text-white">{formatCurrency(booking.totalAmount)}</p>
                          <div className="flex items-center gap-2">
                            {canCancel && (
                              <button
                                onClick={() => handleCancel(booking._id)}
                                disabled={cancellingId === booking._id}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50"
                              >
                                {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                              </button>
                            )}
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              booking.paymentStatus === 'paid'
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              Payment {booking.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
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

export default BookingHistory;
