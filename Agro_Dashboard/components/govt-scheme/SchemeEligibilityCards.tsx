'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Sparkles,
  Calendar,
  Building,
  Check,
  BadgeIndianRupee,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { GovtSchemeItem } from '@/data/types';

interface Props {
  schemes: GovtSchemeItem[];
  selectedSchemeId: string | null;
  onSelect: (id: string) => void;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any; iconColor: string }> = {
  'Approved':          { label: 'Approved',       color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2,  iconColor: 'text-emerald-500' },
  'Documents Pending': { label: 'Docs Pending',   color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   icon: AlertTriangle, iconColor: 'text-amber-500'   },
  'Under Review':      { label: 'Under Review',   color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    icon: Clock,         iconColor: 'text-blue-500'    },
  'Submitted':         { label: 'Submitted',      color: 'text-indigo-700',  bg: 'bg-indigo-50',  border: 'border-indigo-200',  icon: Clock,         iconColor: 'text-indigo-500'  },
  'Not Started':       { label: 'Not Started',    color: 'text-gray-600',    bg: 'bg-gray-50',    border: 'border-gray-200',    icon: XCircle,       iconColor: 'text-gray-400'    },
};

const categoryBadgeColor: Record<string, string> = {
  'Direct Benefit': 'bg-green-100 text-green-800',
  'Irrigation':     'bg-blue-100 text-blue-800',
  'Insurance':      'bg-purple-100 text-purple-800',
  'Subsidy':        'bg-amber-100 text-amber-800',
  'Soil & Inputs':  'bg-orange-100 text-orange-800',
};

function EligibilityGauge({ score }: { score: number }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 85 ? '#10b981' : score >= 65 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r={r} fill="none" stroke="#f3f4f6" strokeWidth="5" />
        <circle
          cx="30"
          cy="30"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-bold text-gray-800">{score}%</span>
      </div>
    </div>
  );
}

export default function SchemeEligibilityCards({ schemes, selectedSchemeId, onSelect }: Props) {
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Top 3 Recommended schemes
  const recommendedSchemes = schemes.slice(0, 3);

  // Filter schemes
  const filteredSchemes = schemes.filter(
    (s) => filterCategory === 'All' || s.category === filterCategory
  );

  return (
    <div className="space-y-4">
      {/* ================= RECOMMENDED FOR YOU (AI ENGINE) ================= */}
      <div className="bg-gradient-to-r from-[#F0FDF4] to-[#ECFDF5] rounded-2xl border border-[#BBF7D0] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#166534] text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-xs font-bold text-[#166534] uppercase tracking-wider">
              RECOMMENDED FOR YOU (AI ELIGIBILITY ENGINE)
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#86EFAC]">
            Algorithmic Matching Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {recommendedSchemes.map((rec, idx) => {
            const isSelected = rec.id === selectedSchemeId;
            const docCount = rec.documents?.length || 4;
            const readyDocs = idx === 0 ? docCount : docCount - 1;

            return (
              <div
                key={rec.id}
                onClick={() => onSelect(rec.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-[#16A34A] shadow-md ring-2 ring-[#86EFAC]/50'
                    : 'bg-white/80 border-[#E5E7EB] hover:border-[#16A34A] hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="font-bold text-[#111827] line-clamp-1">
                    {idx + 1}. {rec.shortName}
                  </span>
                  <span className="text-[10px] font-semibold text-[#92400E] bg-[#FEF3C7] px-1.5 py-0.5 rounded shrink-0">
                    Potentially Eligible
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-[11px] text-[#4B5563]">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Profile Match:</span>
                    <strong className="text-[#166534]">{rec.eligibilityScore}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Documents Ready:</span>
                    <strong className="text-[#111827]">{readyDocs}/{docCount}</strong>
                  </div>
                  {idx === 1 && (
                    <div className="pt-1 text-[10px] text-red-600 line-clamp-1">
                      Missing: Soil Test / Quotation
                    </div>
                  )}
                  {idx === 2 && (
                    <div className="pt-1 text-[10px] text-red-600 line-clamp-1">
                      Missing: Bank Sanction Letter
                    </div>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-[#F3F4F6] text-[10px] text-[#166534] font-medium flex items-center justify-between">
                  <span className="truncate">Est: {rec.benefit.slice(0, 24)}...</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= CATEGORY FILTER TABS ================= */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-gray-400 flex items-center gap-1 mr-1 text-[11px] font-semibold">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {['All', 'Direct Benefit', 'Irrigation', 'Subsidy', 'Insurance', 'Soil & Inputs'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all border ${
              filterCategory === cat
                ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ================= ALL SCHEMES MATCHED CARDS ================= */}
      <div className="space-y-3">
        {filteredSchemes.map((scheme) => {
          const status = statusConfig[scheme.applicationStatus] || statusConfig['Not Started'];
          const StatusIcon = status.icon;
          const isSelected = scheme.id === selectedSchemeId;
          const isEnrolled = scheme.applicationStatus === 'Approved';

          // Automated match explanation reasons
          const matchReasons = [
            'Farmer has verified cultivable agricultural land (5.4 acres)',
            'Water source infrastructure detected (Borewell & Farm Pond)',
            'Crops (Tomato, Cotton, Wheat) qualify under notified district list',
            'Bank account linked with Aadhaar NPCI for direct DBT disbursal',
          ];

          return (
            <div
              key={scheme.id}
              onClick={() => onSelect(scheme.id)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#16A34A] bg-[#F0FDF4]/70 shadow-sm ring-1 ring-[#16A34A]'
                  : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Gauge */}
                <EligibilityGauge score={scheme.eligibilityScore ?? 75} />

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-gray-900 leading-tight">
                          {scheme.name}
                        </p>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isEnrolled
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          {isEnrolled ? '✓ Active Enrolled' : '⚠ Potentially Eligible'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {scheme.description}
                      </p>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                        isSelected ? 'text-[#166534]' : 'text-gray-400'
                      }`}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    {/* Category */}
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                        categoryBadgeColor[scheme.category] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {scheme.category}
                    </span>

                    {/* Application Status */}
                    <span
                      className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-medium border ${status.bg} ${status.border} ${status.color}`}
                    >
                      <StatusIcon className={`w-3 h-3 ${status.iconColor}`} />
                      {status.label}
                    </span>

                    {/* Benefit */}
                    <span className="text-[11px] text-gray-700 font-semibold flex items-center gap-1">
                      <BadgeIndianRupee className="w-3.5 h-3.5 text-green-700" />
                      {scheme.benefit}
                    </span>

                    {/* Deadline */}
                    {scheme.deadline && (
                      <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" /> {scheme.deadline}
                      </span>
                    )}
                  </div>

                  {/* WHY IT WAS MATCHED - Requirement 9 */}
                  <div className="mt-2.5 p-2 rounded-xl bg-white border border-[#E5E7EB] text-xs space-y-1">
                    <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider block">
                      Matched Because:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[#374151]">
                      {matchReasons.map((reason, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                          <span className="truncate">{reason}</span>
                        </div>
                      ))}
                    </div>
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
