'use client';

import React from 'react';
import {
  Activity,
  Sprout,
  Droplets,
  AlertTriangle,
  Bot,
  TrendingUp,
  Scale,
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function DashboardKpis() {
  const { farm } = useFarm();

  const kpis = [
    {
      title: 'Farm Health',
      value: `${farm.farmHealth}`,
      unit: '/100',
      trend: '+4.8%',
      trendPositive: true,
      comparison: 'vs last week',
      icon: Activity,
      iconColor: 'text-[#16A34A]',
      iconBg: 'bg-[#DCFCE7]',
      sparkline: [78, 80, 81, 83, 84, 85, 86],
      status: 'Optimal Condition',
    },
    {
      title: 'Crop Health',
      value: `${farm.cropHealth}`,
      unit: '%',
      trend: '+3.2%',
      trendPositive: true,
      comparison: 'canopy index',
      icon: Sprout,
      iconColor: 'text-[#16A34A]',
      iconBg: 'bg-[#DCFCE7]',
      sparkline: [82, 84, 85, 86, 88, 88, 89],
      status: 'Vegetative Vigor',
    },
    {
      title: 'Water Efficiency',
      value: `${farm.waterEfficiency}`,
      unit: '%',
      trend: '+5.4%',
      trendPositive: true,
      comparison: 'ETc optimized',
      icon: Droplets,
      iconColor: 'text-[#3B82F6]',
      iconBg: 'bg-blue-50',
      sparkline: [75, 78, 80, 82, 85, 86, 87],
      status: '8,240 L Saved',
    },
    {
      title: 'Active Issues',
      value: `${farm.activeIssuesCount.total}`,
      unit: 'items',
      trend: `${farm.activeIssuesCount.critical} crit`,
      trendPositive: false,
      comparison: `${farm.activeIssuesCount.warning} warn`,
      icon: AlertTriangle,
      iconColor: 'text-[#F59E0B]',
      iconBg: 'bg-amber-50',
      sparkline: [9, 8, 8, 7, 7, 8, 7],
      status: '2 Need Action',
    },
    {
      title: 'Robot Coverage',
      value: `${farm.robotCoverage}`,
      unit: '%',
      trend: '+8.0%',
      trendPositive: true,
      comparison: 'autonomous scout',
      icon: Bot,
      iconColor: 'text-[#8B5CF6]',
      iconBg: 'bg-purple-50',
      sparkline: [58, 62, 65, 68, 70, 72, 74],
      status: 'AGB-01 & AGB-02',
    },
    {
      title: 'Expected Yield',
      value: `${farm.expectedYield.tonnes}`,
      unit: 't',
      trend: `${farm.expectedYield.confidence}%`,
      trendPositive: true,
      comparison: 'model confidence',
      icon: Scale,
      iconColor: 'text-[#166534]',
      iconBg: 'bg-[#F0FDF4]',
      sparkline: [4.1, 4.2, 4.3, 4.4, 4.5, 4.5, 4.6],
      status: 'Target 5.1 t',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.title}
            className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle hover:border-[#16A34A]/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6B7280]">{kpi.title}</span>
                <div className={`w-7 h-7 rounded-lg ${kpi.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${kpi.iconColor}`} />
                </div>
              </div>

              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-[#111827]">{kpi.value}</span>
                <span className="text-xs text-[#6B7280] font-medium">{kpi.unit}</span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#F3F4F6] flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1 font-semibold text-[#16A34A]">
                <TrendingUp className="w-3 h-3" />
                <span>{kpi.trend}</span>
              </div>
              <span className="text-[#9CA3AF] truncate max-w-[80px]">{kpi.status}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
