'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, ArrowRight, Bot, Droplets, Bug, CheckCircle2 } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function TodaysPriorities() {
  const { openFieldPassportFor, setSelectedRobot, setIsRobotModalOpen, agroBots } = useFarm();

  const priorities = [
    {
      id: 'PRI-1',
      severity: 'HIGH',
      badgeClass: 'bg-red-50 text-[#EF4444] border-red-200',
      title: 'Disease risk increasing',
      location: 'Field C / Zone C4',
      metric: 'Risk: 78%',
      confidence: 'Confidence: 92%',
      actionText: 'Inspect with AgroBot',
      icon: Bot,
      onClick: () => {
        // Inspect with AGB-02
        setSelectedRobot(agroBots[1]);
        setIsRobotModalOpen(true);
      },
    },
    {
      id: 'PRI-2',
      severity: 'MEDIUM',
      badgeClass: 'bg-amber-50 text-[#F59E0B] border-amber-200',
      title: 'Soil moisture low',
      location: 'Field B / Zone B2',
      metric: 'Current: 24%',
      confidence: 'Optimal: 35–45%',
      actionText: 'Review irrigation',
      icon: Droplets,
      onClick: () => {
        openFieldPassportFor('FIELD-B');
      },
    },
    {
      id: 'PRI-3',
      severity: 'MEDIUM',
      badgeClass: 'bg-amber-50 text-[#F59E0B] border-amber-200',
      title: 'Whitefly activity increasing',
      location: 'Field A',
      metric: 'Trend: +18%',
      confidence: 'Density: 14/m²',
      actionText: 'Inspect crop',
      icon: Bug,
      onClick: () => {
        openFieldPassportFor('FIELD-A');
      },
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
        <div>
          <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-[#EF4444]" />
            Today&apos;s Priorities
          </h3>
          <p className="text-[11px] text-[#6B7280]">Needs immediate farmer intervention</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#EF4444] border border-red-200">
          3 Items
        </span>
      </div>

      <div className="py-3 space-y-3">
        {priorities.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={item.onClick}
              className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#16A34A] hover:bg-[#F0FDF4]/30 cursor-pointer transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${item.badgeClass}`}
                  >
                    {item.severity}
                  </span>
                  <span className="text-xs font-semibold text-[#111827] group-hover:text-[#16A34A] transition-colors">
                    {item.title}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#16A34A] group-hover:translate-x-0.5 transition-all" />
              </div>

              <div className="mt-1 flex items-center justify-between text-xs text-[#6B7280]">
                <span className="font-medium text-[#4B5563]">{item.location}</span>
                <span className="font-semibold text-[#111827]">{item.metric}</span>
              </div>

              <div className="mt-2 pt-2 border-t border-[#F3F4F6] flex items-center justify-between text-[11px]">
                <span className="text-[#9CA3AF]">{item.confidence}</span>
                <div className="flex items-center gap-1 text-[#166534] font-semibold">
                  <Icon className="w-3 h-3 text-[#16A34A]" />
                  <span>Action: {item.actionText}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-[11px] text-[#9CA3AF] text-center">
        Click any priority to open field inspection or mission controls
      </div>
    </div>
  );
}
