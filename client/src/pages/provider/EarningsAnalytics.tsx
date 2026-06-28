import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Briefcase, BarChart2 } from 'lucide-react';
import DashboardSidebar from '../../components/DashboardSidebar';
import StatsCard from '../../components/StatsCard';
import AnalyticsChart from '../../components/AnalyticsChart';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../utils/axios';
import { MonthlyAnalytics } from '../../types';
import { formatCurrency } from '../../utils/helpers';

const EarningsAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<MonthlyAnalytics[]>([]);
  const [summary, setSummary] = useState<{ totalRevenue: number; totalJobsCompleted: number; avgMonthlyRevenue: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [dataKey, setDataKey] = useState<'revenue' | 'jobs'>('revenue');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/providers/analytics');
        setAnalytics(data.analytics);
        setSummary(data.summary);
      } catch {
        // handle silently
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0f]">
        <DashboardSidebar />
        <main className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" /></main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <DashboardSidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-black text-white">Earnings Analytics</h1>
            <p className="text-white/40 text-sm mt-1">Track your income and job performance</p>
          </motion.div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatsCard
              title="Total Revenue (6mo)"
              value={formatCurrency(summary?.totalRevenue || 0)}
              icon={<DollarSign className="w-5 h-5" />}
              gradient="from-green-600/20 to-green-600/5"
              delay={0}
            />
            <StatsCard
              title="Avg Monthly Revenue"
              value={formatCurrency(summary?.avgMonthlyRevenue || 0)}
              icon={<TrendingUp className="w-5 h-5" />}
              gradient="from-indigo-600/20 to-indigo-600/5"
              delay={0.05}
            />
            <StatsCard
              title="Jobs Completed (6mo)"
              value={summary?.totalJobsCompleted || 0}
              icon={<Briefcase className="w-5 h-5" />}
              gradient="from-purple-600/20 to-purple-600/5"
              delay={0.1}
            />
          </div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6"
          >
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-bold text-white">Monthly Performance</h2>
                <p className="text-sm text-white/40">Revenue and jobs over the last 6 months</p>
              </div>
              <div className="flex gap-2">
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                  {(['revenue', 'jobs'] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => setDataKey(key)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${dataKey === key ? 'bg-indigo-600 text-white' : 'text-white/50 hover:text-white'}`}
                    >
                      {key === 'revenue' ? 'Revenue' : 'Jobs'}
                    </button>
                  ))}
                </div>
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                  {(['area', 'bar'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setChartType(type)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${chartType === type ? 'bg-indigo-600 text-white' : 'text-white/50 hover:text-white'}`}
                    >
                      {type === 'area' ? 'Area' : 'Bar'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {analytics.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <BarChart2 className="w-12 h-12 text-white/20 mb-3" />
                <p className="text-white/50 text-sm">No data yet. Complete jobs to see analytics here.</p>
              </div>
            ) : (
              <AnalyticsChart data={analytics} type={chartType} dataKey={dataKey} height={300} />
            )}
          </motion.div>

          {/* Monthly Table */}
          {analytics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <h2 className="text-lg font-bold text-white mb-5">Monthly Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/40 text-left border-b border-white/10">
                      <th className="pb-3 font-medium">Month</th>
                      <th className="pb-3 font-medium text-right">Revenue</th>
                      <th className="pb-3 font-medium text-right">Jobs</th>
                      <th className="pb-3 font-medium text-right">Avg/Job</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {analytics.map((row) => (
                      <tr key={`${row.month}-${row.year}`} className="text-white/70 hover:text-white transition-colors">
                        <td className="py-3 font-medium">{row.month} {row.year}</td>
                        <td className="py-3 text-right text-green-400 font-semibold">{formatCurrency(row.revenue)}</td>
                        <td className="py-3 text-right">{row.jobs}</td>
                        <td className="py-3 text-right text-white/50">
                          {row.jobs > 0 ? formatCurrency(Math.round(row.revenue / row.jobs)) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EarningsAnalytics;
