'use client';

import React from 'react';
import { Clock, Bot, AlertTriangle, Droplets, Sparkles, CloudRain, CheckCircle2 } from 'lucide-react';
import { recentActivitiesTimeline } from '@/data/farmData';

export function DashboardActivityTimeline() {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Robot':
        return <Bot className="w-3.5 h-3.5 text-[#3B82F6]" />;
      case 'Disease':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />;
      case 'Irrigation':
        return <Droplets className="w-3.5 h-3.5 text-[#0EA5E9]" />;
      case 'Nutrients':
        return <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />;
      case 'Weather':
        return <CloudRain className="w-3.5 h-3.5 text-[#6366F1]" />;
      case 'Treatment':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-[#6B7280]" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
        <div>
          <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#16A34A]" />
            Recent Farm Activity
          </h3>
          <p className="text-[11px] text-[#6B7280]">Chronological log of today&apos;s field telemetry</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]">
          Live Feed
        </span>
      </div>

      {/* Timeline items */}
      <div className="py-3 relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#F3F4F6]">
        {recentActivitiesTimeline.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline marker */}
            <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#16A34A] ring-4 ring-white" />
            <div className="p-2.5 rounded-xl border border-[#E5E7EB] bg-white group-hover:border-[#16A34A]/50 transition-colors shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#F7F9F7] flex items-center justify-center shrink-0">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#111827]">{item.title}</p>
                  <span className="text-[10px] text-[#6B7280]">{item.category} Event</span>
                </div>
              </div>
              <span className="text-[11px] font-medium text-[#9CA3AF] shrink-0 ml-2">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 text-[11px] text-[#9CA3AF] text-center">
        Synchronized with AgroBot RTK telemetry and on-farm gateway
      </div>
    </div>
  );
}
