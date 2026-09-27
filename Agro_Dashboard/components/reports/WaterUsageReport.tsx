'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Droplets, TrendingDown, Zap, Target } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', actual: 18.4, etc: 16.2, target: 17.0 },
  { day: 'Tue', actual: 15.8, etc: 15.9, target: 17.0 },
  { day: 'Wed', actual: 22.1, etc: 18.5, target: 17.0 },
  { day: 'Thu', actual: 14.2, etc: 14.8, target: 17.0 },
  { day: 'Fri', actual: 16.9, etc: 16.0, target: 17.0 },
  { day: 'Sat', actual: 0.0, etc: 10.2, target: 0.0 },
  { day: 'Sun', actual: 0.0, etc: 9.8, target: 0.0 },
];

const monthlyTrend = [
  { month: 'Apr', usage: 410, rainfall: 45, saved: 55 },
  { month: 'May', usage: 485, rainfall: 28, saved: 40 },
  { month: 'Jun', usage: 320, rainfall: 125, saved: 120 },
  { month: 'Jul', usage: 190, rainfall: 215, saved: 225 },
  { month: 'Aug', usage: 220, rainfall: 185, saved: 180 },
  { month: 'Sep', usage: 310, rainfall: 98, saved: 90 },
  { month: 'Oct', usage: 385, rainfall: 35, saved: 65 },
];

const zoneWater = [
  { zone: 'Zone A – Tomato', usage: 42.3, efficiency: 91, status: 'optimal' },
  { zone: 'Zone B – Cotton', usage: 28.7, efficiency: 78, status: 'moderate' },
  { zone: 'Zone C – Wheat', usage: 19.4, efficiency: 85, status: 'good' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color || p.stroke }} />
            <span className="text-gray-600">{p.name}:</span>
            <span className="font-medium text-gray-800">{p.value} mm</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const kpis = [
  {
    label: 'This Week',
    value: '87.4 mm',
    sub: '↓ 12% vs last week',
    icon: Droplets,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    trend: 'down',
  },
  {
    label: 'Water Saved',
    value: '23.6 mm',
    sub: 'via AI scheduling',
    icon: TrendingDown,
    color: 'text-green-600',
    bg: 'bg-green-50',
    trend: 'up',
  },
  {
    label: 'Avg Efficiency',
    value: '85%',
    sub: 'across all zones',
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    trend: 'up',
  },
  {
    label: 'ETc Deficit',
    value: '−3.2 mm',
    sub: 'soil moisture adequate',
    icon: Target,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    trend: 'neutral',
  },
];

export default function WaterUsageReport() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Water Usage Analytics</h3>
            <p className="text-xs text-gray-500">Actual usage vs ETc vs target — daily & monthly</p>
          </div>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
          Season Total: 2,320 mm
        </span>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <p className="text-xs text-gray-500">{kpi.label}</p>
              </div>
              <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
              <p className={`text-xs mt-0.5 ${kpi.trend === 'down' ? 'text-green-600' : kpi.trend === 'up' ? 'text-blue-600' : 'text-gray-500'}`}>
                {kpi.sub}
              </p>
            </div>
          );
        })}
      </div>

      <div className="p-6 space-y-6">
        {/* Weekly Daily Chart */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">This Week — Daily Usage vs ETc vs Target (mm)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} unit=" mm" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="actual" name="Actual Usage" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="etc" name="ETc Demand" stroke="#10b981" strokeWidth={2} strokeDasharray="5 3" dot={false} />
              <Line type="monotone" dataKey="target" name="Target" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">Monthly Trend — Usage, Rainfall & Water Saved (mm)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rainfallGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="savedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} unit=" mm" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="usage" name="Irrigation" stroke="#3b82f6" strokeWidth={2} fill="url(#usageGrad)" />
              <Area type="monotone" dataKey="rainfall" name="Rainfall" stroke="#06b6d4" strokeWidth={2} fill="url(#rainfallGrad)" />
              <Area type="monotone" dataKey="saved" name="Water Saved" stroke="#10b981" strokeWidth={2} fill="url(#savedGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Zone Breakdown */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Zone-Wise Water Consumption</p>
          <div className="space-y-3">
            {zoneWater.map((z) => {
              const statusColor = z.status === 'optimal' ? 'text-green-700 bg-green-50' : z.status === 'good' ? 'text-blue-700 bg-blue-50' : 'text-amber-700 bg-amber-50';
              const barColor = z.status === 'optimal' ? '#10b981' : z.status === 'good' ? '#3b82f6' : '#f59e0b';
              return (
                <div key={z.zone} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-medium text-gray-800 truncate">{z.zone}</p>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor}`}>{z.status}</span>
                        <span className="text-xs font-semibold text-gray-700">{z.usage} mm</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${z.efficiency}%`, background: barColor }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Efficiency: {z.efficiency}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
