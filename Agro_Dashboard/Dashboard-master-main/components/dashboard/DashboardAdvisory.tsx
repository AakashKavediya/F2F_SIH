'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle, ChevronRight, HelpCircle, ArrowRight } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function DashboardAdvisory() {
  const { advisories, setIsAiDrawerOpen } = useFarm();

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#111827]">Today&apos;s Farm Advisory</h3>
            <p className="text-[11px] text-[#6B7280]">AI-synthesized agromet & robotics recommendations</p>
          </div>
        </div>
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="text-xs font-semibold text-[#16A34A] hover:text-[#15803D] hover:underline flex items-center gap-1"
        >
          <span>Ask AI Assistant</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Advisory Cards */}
      <div className="py-3 space-y-3">
        {advisories.map((item, idx) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#16A34A]/50 transition-all shadow-xs space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7] text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <h4 className="text-xs font-bold text-[#111827]">{item.title}</h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534]">
                {item.confidence}% Conf.
              </span>
            </div>

            <div className="text-[11px] text-[#4B5563] pl-7 space-y-1.5">
              <p>
                <strong className="text-[#111827]">Why: </strong>
                {item.why}
              </p>

              <div className="flex flex-wrap items-center gap-1 text-[10px] text-[#6B7280]">
                <span>Data sources:</span>
                {item.dataSources.map((ds) => (
                  <span key={ds} className="bg-[#F7F9F7] border border-[#E5E7EB] px-1.5 py-0.5 rounded text-[#374151]">
                    {ds}
                  </span>
                ))}
              </div>

              <div className="p-2 rounded-lg bg-[#F0FDF4] border border-[#DCFCE7] text-[#166534] font-medium flex items-center justify-between">
                <span>Action: {item.action}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 text-[11px] text-[#9CA3AF] text-center">
        Predict-Verify-Update cycle active • Ground validated by AgroBot
      </div>
    </div>
  );
}
