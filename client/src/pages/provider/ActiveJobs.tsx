import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar, User, CheckCircle, XCircle } from 'lucide-react';
import DashboardSidebar from '../../components/DashboardSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import api from '../../utils/axios';
import { useToast } from '../../context/ToastContext';
import { Booking, Service, User as UserType } from '../../types';
import { formatCurrency, formatDateTime, getStatusColor, getStatusLabel } from '../../utils/helpers';

const ActiveJobs: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      // No status filter — backend returns own bookings (all statuses) +
      // unassigned pending bookings matching provider's specialization
      const [pendingRes, acceptedRes] = await Promise.all([
        api.get('/providers/bookings?status=pending'),
        api.get('/providers/bookings?status=accepted'),
      ]);
      setBookings([...pendingRes.data.bookings, ...acceptedRes.data.bookings]);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleAction = async (bookingId: string, action: 'accept' | 'reject' | 'complete') => {
    setActionLoading(`${bookingId}-${action}`);
    try {
      await api.patch(`/providers/bookings/${bookingId}/${action}`);
      toast.success(`Job ${action === 'complete' ? 'completed' : action + 'ed'} successfully!`);
      fetchBookings();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || `Failed to ${action} job.`);
    } finally {
      setActionLoading(null);
    }
  };

  const pending = bookings.filter((b) => b.status === 'pending');
  const accepted = bookings.filter((b) => b.status === 'accepted');

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <DashboardSidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-black text-white">Active Jobs</h1>
            <p className="text-white/40 text-sm mt-1">Manage your pending and accepted bookings</p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="space-y-8">
              {/* Pending */}
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  Pending Requests
                  <span className="ml-1 px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold">{pending.length}</span>
                </h2>

                {pending.length === 0 ? (
                  <EmptyState icon={<Briefcase className="w-7 h-7" />} title="No pending requests" description="New booking requests will appear here for you to accept or reject." />
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {pending.map((booking, i) => {
                      const service = booking.serviceId as Service;
                      const customer = booking.customerId as UserType;
                      return (
                        <motion.div
                          key={booking._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 hover:border-yellow-500/40 transition-all"
                        >
                          <div className="flex gap-3 mb-4">
                            <img src={service?.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/1e1b4b/818cf8?text=S'; }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-white">{service?.name}</p>
                              <p className="text-lg font-black text-indigo-400">{formatCurrency(booking.totalAmount)}</p>
                            </div>
                          </div>
                          <div className="space-y-1.5 mb-4 text-xs text-white/50">
                            <p className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{customer?.name}</p>
                            <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{booking.address}</p>
                            <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{formatDateTime(booking.scheduledAt)}</p>
                          </div>
                          {booking.notes && (
                            <p className="text-xs text-white/40 bg-white/5 rounded-lg p-2 mb-4 italic">"{booking.notes}"</p>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAction(booking._id, 'accept')}
                              disabled={!!actionLoading}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-500/20 text-green-400 text-sm font-bold hover:bg-green-500/30 transition-all disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                              {actionLoading === `${booking._id}-accept` ? '...' : 'Accept'}
                            </button>
                            <button
                              onClick={() => handleAction(booking._id, 'reject')}
                              disabled={!!actionLoading}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/30 transition-all disabled:opacity-50"
                            >
                              <XCircle className="w-4 h-4" />
                              {actionLoading === `${booking._id}-reject` ? '...' : 'Reject'}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accepted / In Progress */}
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  In Progress
                  <span className="ml-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold">{accepted.length}</span>
                </h2>

                {accepted.length === 0 ? (
                  <EmptyState icon={<CheckCircle className="w-7 h-7" />} title="No active jobs" description="Accepted bookings will appear here." />
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {accepted.map((booking, i) => {
                      const service = booking.serviceId as Service;
                      const customer = booking.customerId as UserType;
                      return (
                        <motion.div
                          key={booking._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-all"
                        >
                          <div className="flex gap-3 mb-4">
                            <img src={service?.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/1e1b4b/818cf8?text=S'; }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-white">{service?.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`status-badge border ${getStatusColor(booking.status)}`}>{getStatusLabel(booking.status)}</span>
                              </div>
                            </div>
                            <p className="text-lg font-black text-indigo-400">{formatCurrency(booking.totalAmount)}</p>
                          </div>
                          <div className="space-y-1.5 mb-4 text-xs text-white/50">
                            <p className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{customer?.name} · {customer?.phone}</p>
                            <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{booking.address}</p>
                            <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{formatDateTime(booking.scheduledAt)}</p>
                          </div>
                          <button
                            onClick={() => handleAction(booking._id, 'complete')}
                            disabled={!!actionLoading}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600/30 text-indigo-300 text-sm font-bold hover:bg-indigo-600/50 transition-all disabled:opacity-50 border border-indigo-500/30"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {actionLoading === `${booking._id}-complete` ? 'Completing...' : 'Mark as Completed'}
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ActiveJobs;
