import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, FileText, CreditCard, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Service } from '../types';
import api from '../utils/axios';
import { useToast } from '../context/ToastContext';
import { formatCurrency, getMinDateTime } from '../utils/helpers';
import GradientButton from './GradientButton';

interface BookingModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface BookingFormData {
  address: string;
  scheduledAt: string;
  notes: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ service, isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>();

  const handleClose = () => {
    reset();
    setIsSuccess(false);
    onClose();
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!service) return;
    setIsLoading(true);
    try {
      await api.post('/bookings', {
        serviceId: service._id,
        address: data.address,
        scheduledAt: new Date(data.scheduledAt).toISOString(),
        notes: data.notes,
      });
      setIsSuccess(true);
      toast.success('Booking confirmed! A provider will be assigned shortly.');
      setTimeout(() => {
        handleClose();
        onSuccess?.();
      }, 2500);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && service && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-lg bg-[#0f0c29] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-white/10">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10" />
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-14 h-14 rounded-xl object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/56x56/1e1b4b/818cf8?text=${service.name[0]}`;
                    }}
                  />
                  <div>
                    <h2 className="text-lg font-bold text-white">{service.name}</h2>
                    <p className="text-2xl font-bold text-indigo-400">{formatCurrency(service.price)}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                      className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4"
                    >
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h3>
                    <p className="text-white/50 text-sm">Your service has been booked. A professional will be assigned shortly.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
                        <MapPin className="w-4 h-4 text-indigo-400" /> Service Address
                      </label>
                      <textarea
                        {...register('address', {
                          required: 'Address is required',
                          minLength: { value: 10, message: 'Please enter a complete address' },
                        })}
                        rows={2}
                        placeholder="Enter your full address with landmark..."
                        className="input-field resize-none"
                      />
                      {errors.address && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.address.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
                        <Calendar className="w-4 h-4 text-indigo-400" /> Preferred Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        {...register('scheduledAt', { required: 'Please select a date and time' })}
                        min={getMinDateTime()}
                        className="input-field"
                        style={{ colorScheme: 'dark' }}
                      />
                      {errors.scheduledAt && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.scheduledAt.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
                        <FileText className="w-4 h-4 text-indigo-400" /> Special Instructions
                        <span className="text-white/30 text-xs">(optional)</span>
                      </label>
                      <textarea
                        {...register('notes')}
                        rows={2}
                        placeholder="Any specific requirements or notes for the service provider..."
                        className="input-field resize-none"
                      />
                    </div>

                    {/* Price summary */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white/60">Service charge</span>
                        <span className="text-sm text-white">{formatCurrency(service.price)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white/60">Platform fee</span>
                        <span className="text-sm text-white">{formatCurrency(0)}</span>
                      </div>
                      <div className="h-px bg-white/10 my-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-white">Total</span>
                        <span className="text-lg font-bold text-indigo-400">{formatCurrency(service.price)}</span>
                      </div>
                    </div>

                    <GradientButton
                      type="submit"
                      isLoading={isLoading}
                      fullWidth
                      size="lg"
                      leftIcon={<CreditCard className="w-5 h-5" />}
                    >
                      Confirm Booking
                    </GradientButton>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
