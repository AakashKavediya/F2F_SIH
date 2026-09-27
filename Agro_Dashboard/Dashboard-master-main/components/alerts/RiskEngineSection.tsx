'use client';

import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function RiskEngineSection() {
  const { risks, openFieldPassportFor } = useFarm();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[#111827]">
          Predictive Agronomic & Environmental Risk Engine
        </h3>
        <p className="text-xs text-[#6B7280]">
          Multi-factor probability models evaluated every 15 minutes against weather, sensor arrays, and robot vision
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map((risk) => (
          <div
            key={risk.id}
            className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between space-y-4"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                    {risk.affectedField} • {risk.affectedZone}
                  </span>
                  <h4 className="text-sm font-bold text-[#111827] mt-0.5">{risk.riskType}</h4>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-lg font-extrabold text-[#059669] font-mono leading-none">
                      {risk.probability}%
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        risk.probability > 70
                          ? 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]'
                          : risk.probability > 50
                          ? 'bg-amber-50 text-[#B45309] border-amber-200'
                          : 'bg-[#F0FDF4] text-[#166534] border-[#DCFCE7]'
                      }`}
                    >
                      {risk.probability > 70 ? 'High Risk' : risk.probability > 50 ? 'Moderate' : 'Low Risk'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#6B7280] mt-1">{risk.confidence}% Model Confidence</p>
                </div>
              </div>

              {/* Factor Contribution Bars */}
              <div className="pt-3 space-y-2.5">
                <span className="text-[11px] font-semibold text-[#4B5563] block">
                  Contributing Factor Attribution:
                </span>
                {risk.factors.map((f) => (
                  <div key={f.name} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#6B7280]">{f.name}</span>
                      <span className="font-semibold text-[#166534]">+{f.contributionPct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#F3F4F6] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#34D399] to-[#10B981]"
                        style={{ width: `${Math.min(100, f.contributionPct * 2.5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescribed Action */}
            <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] text-xs space-y-1">
              <span className="font-bold text-[#166534]">Mitigation Protocol:</span>
              <p className="text-[#4B5563]">{risk.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
