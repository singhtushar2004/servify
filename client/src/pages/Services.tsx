import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import BookingModal from '../components/BookingModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import api from '../utils/axios';
import { Service, ServiceCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const categories: { value: string; label: string; emoji: string }[] = [
  { value: 'all', label: 'All Services', emoji: '🏠' },
  { value: 'carwash', label: 'Car Wash', emoji: '🚗' },
  { value: 'plumber', label: 'Plumbing', emoji: '🔧' },
  { value: 'carpenter', label: 'Carpentry', emoji: '🪚' },
  { value: 'maid', label: 'Home Cleaning', emoji: '🧹' },
  { value: 'cook', label: 'Personal Cook', emoji: '👨‍🍳' },
];

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filtered, setFiltered] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(data.services);
        setFiltered(data.services);
      } catch {
        // silently handle
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    let result = services;
    if (activeCategory !== 'all') {
      result = result.filter((s) => s.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [activeCategory, searchQuery, services]);

  const handleBook = (service: Service) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      <div className="pt-24 pb-20">
        {/* Header */}
        <div className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Our Services</p>
              <h1 className="text-5xl font-black text-white mb-4">Find Your Service</h1>
              <p className="text-white/50 text-lg max-w-xl mx-auto">
                Browse our curated list of professional home services and book a verified expert instantly.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search + Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                className="input-field pl-11 w-full"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-2 overflow-x-auto pb-2 mb-10 scrollbar-hide"
          >
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.value
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Results */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No services found"
              description="Try adjusting your search or filter to find what you're looking for."
            />
          ) : (
            <>
              <p className="text-sm text-white/40 mb-6">
                Showing <span className="text-white font-medium">{filtered.length}</span> services
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((service, i) => (
                  <ServiceCard
                    key={service._id}
                    service={service}
                    onBook={handleBook}
                    delay={i * 0.05}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <BookingModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedService(null); }}
      />

      <Footer />
    </div>
  );
};

export default Services;
