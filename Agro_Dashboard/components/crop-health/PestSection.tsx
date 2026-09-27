'use client';

import React, { useState } from 'react';
import {
  Bug,
  Volume2,
  TrendingUp,
  TrendingDown,
  Radio,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';

interface PestSectionProps {
  isCompact?: boolean;
}

// Concise Frequency Response Spectrum Data (0.5 to 12.0 kHz)
const acousticSpectrumData = [
  { freq: '0.5k', score: 15, label: 'Ambient noise' },
  { freq: '1.2k', score: 42, label: 'Aphids vibration (Score: 42)' },
  { freq: '2.6k', score: 28, label: 'Caterpillar foliar chewing' },
  { freq: '3.8k', score: 46, label: 'Wing flutter' },
  { freq: '4.8k', score: 68, label: 'Whitefly wingbeat peak (Score: 68)' },
  { freq: '6.0k', score: 36, label: 'Harmonic band' },
  { freq: '7.4k', score: 25, label: 'Thrips rasping (Score: 25)' },
  { freq: '9.0k', score: 18, label: 'Micro-chitin friction' },
  { freq: '12.0k', score: 12, label: 'High threshold' },
];

export function PestSection({ isCompact = false }: PestSectionProps) {
  const { pestEvents } = useFarm();
  const [isTrapsDeployed, setIsTrapsDeployed] = useState(false);

  return (
    <div className="space-y-6">
      {/* Pest Species Cards: Whitefly, Aphids, Thrips, Caterpillar */}
      <div
        className={`grid gap-4 ${
          isCompact
            ? 'grid-cols-1 sm:grid-cols-2'
            : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
        }`}
      >
        {pestEvents.map((pest) => (
          <div
            key={pest.id}
            className="p-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#10B981]/50 shadow-subtle flex flex-col justify-between transition-all group min-h-[170px]"
          >
            <div>
              {/* Card Header: Icon + Species Title + Field/Zone + Status Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      pest.status === 'Active'
                        ? 'bg-amber-50 text-[#F59E0B] border border-amber-200/60'
                        : 'bg-[#DCFCE7] text-[#166534] border border-[#DCFCE7]'
                    }`}
                  >
                    <Bug className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#111827] truncate leading-tight">
                      {pest.species}
                    </h4>
                    <span className="text-[11px] text-[#6B7280] font-medium block truncate mt-0.5">
                      {pest.fieldId} • {pest.zoneId}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border uppercase tracking-wider ${
                    pest.status === 'Active'
                      ? 'bg-amber-50 text-[#B45309] border-amber-200'
                      : 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]'
                  }`}
                >
                  {pest.status}
                </span>
              </div>

              {/* KPI Metrics: Count & Density */}
              <div className="grid grid-cols-2 gap-2 text-center my-3">
                <div className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6] flex flex-col items-center justify-center">
                  <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">
                    Count
                  </span>
                  <p className="text-base font-bold text-[#111827] mt-0.5">{pest.count}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6] flex flex-col items-center justify-center">
                  <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">
                    Density
                  </span>
                  <p className="text-base font-bold text-[#111827] mt-0.5">
                    {pest.densityPerSqM}{' '}
                    <span className="text-[10px] font-normal text-[#6B7280]">/m²</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Card Footer: Detection Source & Trend */}
            <div className="pt-2.5 border-t border-[#F3F4F6] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#6B7280] truncate">
                Source: <strong className="text-[#374151] font-semibold">{pest.source}</strong>
              </span>
              <span
                className={`font-semibold inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded shrink-0 ${
                  pest.trendPct > 0
                    ? 'bg-red-50 text-[#EF4444]'
                    : 'bg-emerald-50 text-[#16A34A]'
                }`}
              >
                {pest.trendPct > 0 ? (
                  <TrendingUp className="w-3 h-3 shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 shrink-0" />
                )}
                <span>{pest.trendPct > 0 ? `+${pest.trendPct}%` : `${pest.trendPct}%`}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bio-Acoustic Pest Spectrum Analysis (Light Theme, Properly Aligned) */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle space-y-5">
        {/* Header: Title, Sensor Metadata & Actual Score Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F3F4F6]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <h3 className="text-base font-bold text-[#111827]">
                Bio-Acoustic Pest Spectrum Analysis
              </h3>
            </div>

            {/* Acoustic Node and Live Sensor Feed Badges - Perfectly Aligned */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] text-[11px] font-medium text-[#374151] leading-none shrink-0">
                <Radio className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <span>Acoustic Node SNS-AC-02 (Field A)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] text-[11px] font-semibold text-[#166534] leading-none shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse shrink-0" />
                <span>Live Sensor Feed</span>
              </span>
            </div>

            <p className="text-xs text-[#6B7280]">
              Continuous piezoelectric microphone frequency response detecting insect wingbeat and foliar vibration signatures
            </p>
          </div>


          {/* Actual Score Badge */}
          <div className="flex items-center gap-3 bg-[#F9FAFB] border border-[#E5E7EB] px-4 py-2.5 rounded-xl shrink-0 self-start sm:self-center shadow-xs">
            <div>
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                Actual Activity Score
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-extrabold text-[#D97706] font-mono leading-none">68</span>
                <span className="text-xs text-[#9CA3AF] font-semibold">/ 100</span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-amber-50 text-[#B45309] border border-amber-200">
              Active Peak: 4.8 kHz
            </span>
          </div>
        </div>

        {/* Clean Light-Theme Spectrum Graph with Proper Axis Offsets */}
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={acousticSpectrumData} margin={{ top: 22, right: 16, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="acousticLightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="freq"
                stroke="#9CA3AF"
                tick={{ fill: '#6B7280', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                stroke="#9CA3AF"
                domain={[0, 100]}
                tick={{ fill: '#6B7280', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 shadow-xl text-xs">
                        <div className="font-bold text-[#111827] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                          {data.freq} Band
                        </div>
                        <div className="text-xs text-[#D97706] font-bold mt-1">
                          Activity Score: {data.score} / 100
                        </div>
                        <div className="text-[11px] text-[#6B7280] mt-0.5">{data.label}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine
                x="4.8k"
                stroke="#D97706"
                strokeDasharray="3 3"
                label={{
                  value: 'Whitefly Peak (Score: 68)',
                  position: 'top',
                  fill: '#D97706',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#D97706"
                strokeWidth={2.5}
                fill="url(#acousticLightGradient)"
                dot={{ r: 3.5, fill: '#D97706', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#B45309', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Takeaway & Clickable Action Banner */}
        <div
          className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
            isTrapsDeployed
              ? 'bg-[#F0FDF4] border-[#86EFAC]'
              : 'bg-[#FFFBEB] border-[#FDE68A]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isTrapsDeployed ? (
              <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] flex items-center justify-center shrink-0 text-[#166534]">
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] flex items-center justify-center shrink-0 text-[#B45309]">
                <Volume2 className="w-4 h-4 text-[#D97706]" />
              </div>
            )}
            <span
              className={`text-xs ${
                isTrapsDeployed ? 'text-[#166534]' : 'text-[#92400E]'
              }`}
            >
              {isTrapsDeployed ? (
                <>
                  Yellow sticky traps are currently <strong>active across Field A (Zone A1)</strong>. Bio-acoustic suppression in progress.
                </>
              ) : (
                <>
                  Primary resonance detected at <strong>4.8 kHz (Whitefly wingbeat)</strong> with an actual activity score of <strong>68 / 100</strong> in Field A.
                </>
              )}
            </span>
          </div>

          {/* Clickable Deploy Yellow Traps Button */}
          <button
            type="button"
            onClick={() => setIsTrapsDeployed(!isTrapsDeployed)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer ${
              isTrapsDeployed
                ? 'bg-[#166534] text-white hover:bg-[#14532d]'
                : 'bg-[#F59E0B] text-white hover:bg-[#D97706]'
            }`}
          >
            {isTrapsDeployed ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>24 Traps Deployed (Active)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Deploy Yellow Traps</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}



