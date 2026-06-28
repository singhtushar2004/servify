import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, ArrowRight } from 'lucide-react';
import { Service } from '../types';
import { formatCurrency, getCategoryLabel } from '../utils/helpers';

interface ServiceCardProps {
  service: Service;
  onBook?: (service: Service) => void;
  onViewDetails?: (service: Service) => void;
  delay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook, onViewDetails, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-indigo-500/30 backdrop-blur-sm transition-all duration-300 hover:shadow-glow"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x240/1e1b4b/818cf8?text=${encodeURIComponent(service.name)}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-600/80 backdrop-blur-sm text-xs font-semibold text-white">
            {getCategoryLabel(service.category)}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-semibold text-white">{service.rating.toFixed(1)}</span>
          <span className="text-xs text-white/50">({(service.reviewCount / 1000).toFixed(1)}k)</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-indigo-300 transition-colors">
          {service.name}
        </h3>
        <p className="text-sm text-white/50 line-clamp-2 mb-4 leading-relaxed">{service.description}</p>

        <div className="flex items-center gap-3 mb-4 text-xs text-white/40">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {service.duration}
          </span>
          <span>•</span>
          <span>{service.reviewCount.toLocaleString()} reviews</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40">Starting at</p>
            <p className="text-xl font-bold text-white">{formatCurrency(service.price)}</p>
          </div>
          <div className="flex gap-2">
            {onViewDetails && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewDetails(service)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all duration-200"
              >
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
            {onBook && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onBook(service)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-200"
              >
                Book Now
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
