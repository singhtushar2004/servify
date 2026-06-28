import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  gradient?: string;
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  gradient = 'from-indigo-600/20 to-purple-600/10',
  delay = 0,
}) => {
  const isPositive = trend && trend.value >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} border border-white/10 p-6 backdrop-blur-sm`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.08),transparent_70%)]" />

      <div className="relative flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-white/50 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-white/40 mt-1">{subtitle}</p>}
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white/80 flex-shrink-0">
          {icon}
        </div>
      </div>

      {trend && (
        <div className="relative flex items-center gap-1.5">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'text-green-400 bg-green-400/10'
                : 'text-red-400 bg-red-400/10'
            }`}
          >
            {isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-xs text-white/30">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;
