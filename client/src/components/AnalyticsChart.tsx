import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { MonthlyAnalytics } from '../types';
import { formatCurrency } from '../utils/helpers';

interface AnalyticsChartProps {
  data: MonthlyAnalytics[];
  type?: 'area' | 'bar';
  dataKey?: 'revenue' | 'jobs';
  title?: string;
  height?: number;
}

const CustomTooltip: React.FC<{ active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-xl shadow-2xl">
        <p className="text-white/60 text-xs mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-white font-semibold text-sm">
            {entry.name === 'revenue' ? formatCurrency(entry.value) : `${entry.value} jobs`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  data,
  type = 'area',
  dataKey = 'revenue',
  title,
  height = 300,
}) => {
  const formattedData = data.map((d) => ({
    ...d,
    name: d.month,
  }));

  const tickFormatter = (value: number) =>
    dataKey === 'revenue' ? `₹${(value / 1000).toFixed(0)}k` : String(value);

  return (
    <div className="w-full">
      {title && <p className="text-sm font-medium text-white/60 mb-4">{title}</p>}
      <ResponsiveContainer width="100%" height={height}>
        {type === 'area' ? (
          <AreaChart data={formattedData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="jobsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={tickFormatter}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={dataKey === 'revenue' ? '#6366f1' : '#a855f7'}
              strokeWidth={2.5}
              fill={`url(#${dataKey === 'revenue' ? 'revenueGradient' : 'jobsGradient'})`}
              dot={{ fill: dataKey === 'revenue' ? '#6366f1' : '#a855f7', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        ) : (
          <BarChart data={formattedData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={tickFormatter}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey={dataKey}
              fill="url(#revenueGradient)"
              radius={[6, 6, 0, 0]}
              style={{ fill: '#6366f1' }}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
