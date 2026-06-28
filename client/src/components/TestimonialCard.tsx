import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { getInitials } from '../utils/helpers';

interface TestimonialCardProps {
  name: string;
  role: string;
  avatar?: string;
  rating: number;
  review: string;
  service: string;
  delay?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  avatar,
  rating,
  review,
  service,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-300 hover:shadow-glow"
    >
      <Quote className="absolute top-5 right-5 w-8 h-8 text-indigo-500/20" />

      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
          />
        ))}
      </div>

      <p className="text-sm text-white/70 leading-relaxed mb-5 line-clamp-4">"{review}"</p>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover rounded-xl" />
          ) : (
            getInitials(name)
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-white/40">{role} · {service}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
