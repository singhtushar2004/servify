import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, CheckCircle, ArrowLeft, Zap } from 'lucide-react';
import DashboardSidebar from '../../components/DashboardSidebar';
import BookingModal from '../../components/BookingModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import GradientButton from '../../components/GradientButton';
import api from '../../utils/axios';
import { Service } from '../../types';
import { formatCurrency, getCategoryLabel } from '../../utils/helpers';

const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await api.get(`/services/${id}`);
        setService(data.service);
      } catch {
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchService();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0f]">
        <DashboardSidebar />
        <main className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" /></main>
      </div>
    );
  }

  if (!service) return null;

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <DashboardSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/50 hover:text-white mb-6 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/800x300/1e1b4b/818cf8?text=${service.name}`; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <span className="px-3 py-1 rounded-lg bg-indigo-600/80 backdrop-blur-sm text-xs font-semibold text-white">
                  {getCategoryLabel(service.category)}
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl font-black text-white mb-3">{service.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-white/40">
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-medium">{service.rating.toFixed(1)}</span>
                      ({service.reviewCount.toLocaleString()} reviews)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> {service.duration}
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <h2 className="text-base font-bold text-white mb-3">About This Service</h2>
                  <p className="text-sm text-white/60 leading-relaxed">{service.description}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <h2 className="text-base font-bold text-white mb-4">What's Included</h2>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-sm text-white/70">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-sm text-white/40 mb-1">Starting from</p>
                  <p className="text-4xl font-black text-white mb-1">{formatCurrency(service.price)}</p>
                  <p className="text-xs text-white/30 mb-6">Inclusive of all charges</p>

                  <GradientButton fullWidth size="lg" onClick={() => setIsModalOpen(true)} leftIcon={<Zap className="w-4 h-4" />}>
                    Book Now
                  </GradientButton>

                  <div className="mt-4 space-y-2.5">
                    {[
                      'Verified professionals only',
                      '100% satisfaction guaranteed',
                      'Free rescheduling',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-white/40">
                        <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <BookingModal
        service={service}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => navigate('/bookings')}
      />
    </div>
  );
};

export default ServiceDetails;
