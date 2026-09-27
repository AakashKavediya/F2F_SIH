'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Legend,
} from 'recharts';
import { TrendingUp, Target, AlertCircle } from 'lucide-react';

const yieldData = [
  { crop: 'Tomato', expected: 2.8, lastYear: 2.4, target: 3.0, confidence: 84, color: '#ef4444' },
  { crop: 'Cotton', expected: 0.9, lastYear: 0.85, target: 1.0, confidence: 78, color: '#8b5cf6' },
  { crop: 'Wheat', expected: 0.9, lastYear: 1.1, target: 1.2, confidence: 81, color: '#f59e0b' },
];

const monthlyForecast = [
  { month: 'Oct', tomato: 0.4, cotton: 0.0, wheat: 0.0 },
  { month: 'Nov', tomato: 0.8, cotton: 0.2, wheat: 0.0 },
  { month: 'Dec', tomato: 1.2, cotton: 0.4, wheat: 0.1 },
  { month: 'Jan', tomato: 0.4, cotton: 0.3, wheat: 0.4 },
  { month: 'Feb', tomato: 0.0, cotton: 0.0, wheat: 0.4 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-600">{p.name}:</span>
            <span className="font-medium text-gray-800">{p.value}t</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function YieldForecastChart() {
  const totalExpected = yieldData.reduce((s, d) => s + d.expected, 0);
  const totalLastYear = yieldData.reduce((s, d) => s + d.lastYear, 0);
  const avgConfidence = Math.round(yieldData.reduce((s, d) => s + d.confidence, 0) / yieldData.length);
  const yoyChange = (((totalExpected - totalLastYear) / totalLastYear) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Yield Forecast — Kharif 2024</h3>
            <p className="text-xs text-gray-500">AI-predicted harvest volumes with confidence intervals</p>
          </div>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
          Avg Confidence: {avgConfidence}%
        </span>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
        <div className="px-6 py-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{totalExpected.toFixed(1)}t</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Expected Yield</p>
        </div>
        <div className="px-6 py-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{totalLastYear.toFixed(1)}t</p>
          <p className="text-xs text-gray-500 mt-0.5">Last Year Actual</p>
        </div>
        <div className="px-6 py-4 text-center">
          <p className={`text-2xl font-bold ${parseFloat(yoyChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(yoyChange) >= 0 ? '+' : ''}{yoyChange}%
          </p>
          <p className="text-xs text-gray-500 mt-0.5">YoY Change</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Comparison Chart */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">Per-Crop Comparison (tonnes)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={yieldData} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="crop" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} unit="t" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="lastYear" name="Last Year" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expected" name="Expected" radius={[4, 4, 0, 0]}>
                {yieldData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Rollout */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">Monthly Harvest Rollout</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyForecast} barGap={2} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} unit="t" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="tomato" name="Tomato" fill="#ef4444" fillOpacity={0.8} radius={[3, 3, 0, 0]} stackId="a" />
              <Bar dataKey="cotton" name="Cotton" fill="#8b5cf6" fillOpacity={0.8} radius={[0, 0, 0, 0]} stackId="a" />
              <Bar dataKey="wheat" name="Wheat" fill="#f59e0b" fillOpacity={0.8} radius={[3, 3, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Crop Cards */}
      <div className="px-6 pb-6 grid grid-cols-3 gap-4">
        {yieldData.map((crop) => {
          const vsTarget = (((crop.expected - crop.target) / crop.target) * 100).toFixed(1);
          const isOnTrack = crop.expected >= crop.target * 0.9;
          return (
            <div key={crop.crop} className="rounded-xl border border-gray-100 p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: crop.color }} />
                  <span className="text-sm font-semibold text-gray-800">{crop.crop}</span>
                </div>
                {isOnTrack ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">On Track</span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Below Target
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Expected</span>
                  <span className="font-semibold text-gray-800">{crop.expected}t</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Target</span>
                  <span className="text-gray-700">{crop.target}t</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">vs Target</span>
                  <span className={parseFloat(vsTarget) >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {parseFloat(vsTarget) >= 0 ? '+' : ''}{vsTarget}%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">AI Confidence</span>
                    <span className="font-medium text-gray-700">{crop.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${crop.confidence}%`, background: crop.color, opacity: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
