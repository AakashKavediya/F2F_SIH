'use client';

import React from 'react';
import {
  Sparkles,
  Bot,
  Camera,
  GitCompare,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { predictVerifyUpdateData } from '@/data/farmData';

export function PredictVerifyUpdateWorkflow() {
  const { stage1Predict, stage2Dispatch, stage3Verify, stage4Compare, stage5Update } =
    predictVerifyUpdateData;

  const stages = [
    {
      num: 1,
      title: stage1Predict.title,
      sub: stage1Predict.subtitle,
      metric: stage1Predict.metric,
      details: stage1Predict.details,
      icon: Sparkles,
      color: 'text-[#8B5CF6]',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
    },
    {
      num: 2,
      title: stage2Dispatch.title,
      sub: stage2Dispatch.subtitle,
      metric: stage2Dispatch.metric,
      details: stage2Dispatch.details,
      icon: Bot,
      color: 'text-[#3B82F6]',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      num: 3,
      title: stage3Verify.title,
      sub: stage3Verify.subtitle,
      metric: stage3Verify.metric,
      details: stage3Verify.details,
      icon: Camera,
      color: 'text-[#F59E0B]',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      num: 4,
      title: stage4Compare.title,
      sub: stage4Compare.subtitle,
      metric: `Δ ${stage4Compare.difference} (Obs: ${stage4Compare.observedValue})`,
      details: `Comparison: Predicted ${stage4Compare.predictedValue} vs Ground Observed ${stage4Compare.observedValue}. High concordance.`,
      icon: GitCompare,
      color: 'text-[#10B981]',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
    {
      num: 5,
      title: stage5Update.title,
      sub: stage5Update.subtitle,
      metric: stage5Update.metric,
      details: stage5Update.details,
      icon: RefreshCw,
      color: 'text-[#166534]',
      bg: 'bg-[#F0FDF4]',
      border: 'border-[#DCFCE7]',
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
        <div>
          <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-ping" />
            Predict → Verify → Update Ground Truth Feedback Loop
          </h3>
          <p className="text-[11px] text-[#6B7280]">
            Autonomous robotics pipeline that replaces speculative satellite imagery with verified ground data
          </p>
        </div>
        <span className="text-[10px] font-bold text-[#166534] bg-[#DCFCE7] px-2.5 py-1 rounded-full">
          Verified Concordance
        </span>
      </div>

      {/* 5-Stage Horizontal Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {stages.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div
              key={st.title}
              className={`p-3.5 rounded-xl border ${st.border} ${st.bg} flex flex-col justify-between space-y-3 relative`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#6B7280]">STAGE 0{st.num}</span>
                  <Icon className={`w-4 h-4 ${st.color}`} />
                </div>
                <h4 className="text-xs font-bold text-[#111827] mt-1">{st.title}</h4>
                <p className="text-[10px] text-[#6B7280]">{st.sub}</p>
                <div className="mt-2 text-xs font-bold text-[#111827]">{st.metric}</div>
              </div>
              <p className="text-[11px] text-[#4B5563] leading-relaxed pt-2 border-t border-black/5">
                {st.details}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
