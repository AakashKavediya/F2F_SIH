'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Check,
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function FarmerAdvisorySection() {
  const { advisories, setIsAiDrawerOpen } = useFarm();
  const [acknowledgedMap, setAcknowledgedMap] = useState<Record<string, boolean>>({});

  const toggleAcknowledge = (id: string) => {
    setAcknowledgedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#111827]">Comprehensive Farmer Decision Support</h3>
          <p className="text-xs text-[#6B7280]">
            Actionable agronomic prescriptions with visible confidence ratings and projected benefits
          </p>
        </div>
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#166534] bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#BBF7D0] rounded-xl transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Consult AI</span>
        </button>
      </div>

      {/* Advisories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {advisories.map((a) => {
          const isAck = acknowledgedMap[a.id] || false;

          return (
            <div
              key={a.id}
              className={`p-4 rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between space-y-3 shadow-subtle ${
                isAck ? 'border-[#86EFAC] bg-[#FAFDFB]' : 'border-[#E5E7EB] hover:border-[#CBD5E1]'
              }`}
            >
              {/* Header: Priority, Field, and Prominent Confidence */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        a.priority === 'HIGH'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : a.priority === 'MEDIUM'
                          ? 'bg-blue-50 text-blue-900 border-blue-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {a.priority}
                    </span>
                    {a.cropStage && (
                      <span className="text-xs font-medium text-[#475569]">
                        {a.cropStage}
                      </span>
                    )}
                  </div>

                  {/* Highly Visible Confidence Percentage */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full text-xs font-bold text-[#065F46]">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-[10px] text-[#065F46] uppercase font-semibold">Confidence</span>
                    <span className="font-mono text-sm font-extrabold text-[#047857]">{a.confidence}%</span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-[#111827] mt-2">
                  {a.title}
                </h4>

                {/* Trigger / Reason */}
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  <span className="font-semibold text-[#334155]">Trigger: </span>
                  {a.why}
                </p>
              </div>

              {/* Action and Expected Benefit Blocks */}
              <div className="space-y-2 pt-1 border-t border-[#F3F4F6]">
                {/* Prescribed Action */}
                <div className="p-2.5 rounded-xl bg-[#F0FDF4] border-l-4 border-l-[#16A34A] border-y border-r border-[#DCFCE7] text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#166534] mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                    <span>Prescribed Action</span>
                  </div>
                  <p className="text-[#1F2937] pl-5 leading-relaxed font-medium">
                    {a.action}
                  </p>
                </div>

                {/* Expected Benefit */}
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border-l-4 border-l-[#0284C7] border-y border-r border-[#E2E8F0] text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#0369A1] mb-0.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                    <span>Expected Benefit</span>
                  </div>
                  <p className="text-[#334155] pl-5 leading-relaxed">
                    {a.expectedOutcome}
                  </p>
                </div>

                {/* Acknowledge Action Footer */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-[#94A3B8]">
                    {a.id} • Precision Protocol
                  </span>
                  <button
                    onClick={() => toggleAcknowledge(a.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isAck
                        ? 'bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]'
                        : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] border border-[#E2E8F0]'
                    }`}
                  >
                    <Check className={`w-3 h-3 ${isAck ? 'text-[#16A34A]' : 'text-[#64748B]'}`} />
                    <span>{isAck ? 'Acknowledged' : 'Acknowledge'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


