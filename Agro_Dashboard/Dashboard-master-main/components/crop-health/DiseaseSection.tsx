'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Bot,
  Activity,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const diseaseProgressionData = [
  { day: 'Day 1', plants: 2, note: 'Initial lesion' },
  { day: 'Day 3', plants: 6, note: 'Spore spread' },
  { day: 'Day 5', plants: 17, note: 'Peak detected' },
  { day: 'Day 7', plants: 12, note: 'Treatment initiated' },
  { day: 'Post-Spray', plants: 6, note: 'Lesion arrested' },
];

export function DiseaseSection() {
  const { diseaseEvents, openFieldPassportFor } = useFarm();
  const [showMask, setShowMask] = useState(true);

  const primaryDisease = diseaseEvents[0]; // Early Blight

  return (
    <div className="space-y-6">
      {/* Top Counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-subtle">
          <span className="text-xs text-[#6B7280]">Total Detections</span>
          <p className="text-xl font-bold text-[#111827] mt-1">24 cases</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-subtle">
          <span className="text-xs text-[#6B7280]">Active Inoculum</span>
          <p className="text-xl font-bold text-[#EF4444] mt-1">7 active</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-subtle">
          <span className="text-xs text-[#6B7280]">Resolved Cases</span>
          <p className="text-xl font-bold text-[#16A34A] mt-1">17 resolved</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-subtle">
          <span className="text-xs text-[#6B7280]">High Severity Alert</span>
          <p className="text-xl font-bold text-[#F59E0B] mt-1">3 clusters</p>
        </div>
      </div>

      {/* Main Grid: Disease Card & Progression Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Featured Disease Detection Card */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between pb-3 border-b border-[#F3F4F6]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-[#EF4444] px-2 py-0.5 rounded">
                  {primaryDisease.severity} Severity
                </span>
                <span className="text-xs text-[#6B7280]">ID: {primaryDisease.id}</span>
              </div>
              <h3 className="text-base font-bold text-[#111827] mt-1">
                {primaryDisease.diseaseName}
              </h3>
              <p className="text-xs text-[#6B7280]">
                {primaryDisease.fieldId} • {primaryDisease.zoneId} • {primaryDisease.affectedPlants} plants flagged
              </p>
            </div>
            <span className="text-xs font-bold text-[#166534] bg-[#DCFCE7] px-2 py-1 rounded-lg">
              {primaryDisease.confidence}% Confidence
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280]">Affected Area</span>
              <p className="text-sm font-bold text-[#111827] mt-0.5">{primaryDisease.affectedAreaSqM} m²</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280]">Detection Source</span>
              <p className="text-xs font-bold text-[#111827] mt-0.5">{primaryDisease.source}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280]">AI Vision Model</span>
              <p className="text-xs font-bold text-[#166534] mt-0.5">{primaryDisease.aiModel}</p>
            </div>
          </div>

          {/* Treatment Verification Status */}
          <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#166534]">Robot Treatment Verification</span>
              <span className="font-bold text-[#16A34A]">64.7% Reduction</span>
            </div>
            <p className="text-xs text-[#4B5563]">
              Targeted copper hydroxide bio-spray delivered by AgroBot AGB-02 on 18 Sep. Plant count reduced from 17 down to 6.
            </p>
          </div>

          <button
            onClick={() => openFieldPassportFor(primaryDisease.fieldId)}
            className="w-full py-2.5 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Field C Passport & Treatment Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Disease Progression Chart */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
            <div>
              <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#EF4444]" />
                Disease Progression Over Time
              </h3>
              <p className="text-[11px] text-[#6B7280]">Symptomatic plant counts before and after intervention</p>
            </div>
            <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> -64.7%
            </span>
          </div>

          <div className="h-56 w-full py-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={diseaseProgressionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5E7EB',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="plants"
                  stroke="#EF4444"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#EF4444' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between text-[11px] text-[#6B7280]">
            <span>Peak: 17 plants (Day 5)</span>
            <span className="text-[#16A34A] font-semibold">Post-Spray: 6 plants remaining</span>
          </div>
        </div>
      </div>

      {/* Disease Segmentation Visualizer */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
          <div>
            <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#16A34A]" />
              Edge Vision AI Disease Segmentation
            </h3>
            <p className="text-[11px] text-[#6B7280]">
              Sub-millimeter pixel segmentation mask generated on-robot by Edge Vision v1.4
            </p>
          </div>
          <button
            onClick={() => setShowMask(!showMask)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showMask
                ? 'bg-[#16A34A] text-white border-[#16A34A]'
                : 'bg-white text-[#4B5563] border-[#E5E7EB]'
            }`}
          >
            {showMask ? 'Mask Overlay: ACTIVE' : 'Raw RGB Camera View'}
          </button>
        </div>

        {/* Visualizer Frame */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7">
            <div className="w-full h-64 rounded-2xl bg-[#1C281F] relative overflow-hidden flex items-center justify-center border border-[#E5E7EB] shadow-inner">
              {/* Synthetic Leaf Visual with SVG */}
              <svg viewBox="0 0 400 240" className="w-full h-full">
                {/* Background Leaf Outline */}
                <path
                  d="M50,120 Q180,20 350,120 Q180,220 50,120 Z"
                  fill="#2E7D32"
                  stroke="#1B5E20"
                  strokeWidth="3"
                />
                {/* Leaf Veins */}
                <path d="M50,120 Q200,120 350,120" stroke="#4CAF50" strokeWidth="2" fill="none" />
                <path d="M120,120 Q160,80 180,60" stroke="#4CAF50" strokeWidth="1.5" fill="none" />
                <path d="M180,120 Q220,70 260,50" stroke="#4CAF50" strokeWidth="1.5" fill="none" />
                <path d="M120,120 Q160,160 180,180" stroke="#4CAF50" strokeWidth="1.5" fill="none" />
                <path d="M180,120 Q220,170 260,190" stroke="#4CAF50" strokeWidth="1.5" fill="none" />

                {/* Lesion 1 */}
                <circle cx="210" cy="95" r="28" fill="#5D4037" opacity="0.85" />
                <circle cx="210" cy="95" r="18" fill="#3E2723" opacity="0.9" />

                {/* Lesion 2 */}
                <circle cx="270" cy="140" r="18" fill="#5D4037" opacity="0.85" />

                {/* AI Segmentation Overlay Mask */}
                {showMask && (
                  <g>
                    {/* Ring highlight around Lesion 1 */}
                    <circle
                      cx="210"
                      cy="95"
                      r="32"
                      fill="#EF4444"
                      fillOpacity="0.35"
                      stroke="#EF4444"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                    <text x="180" y="58" fill="#FCA5A5" fontSize="11" fontWeight="bold">
                      Early Blight (94%)
                    </text>

                    {/* Ring highlight around Lesion 2 */}
                    <circle
                      cx="270"
                      cy="140"
                      r="22"
                      fill="#EF4444"
                      fillOpacity="0.35"
                      stroke="#EF4444"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                    <text x="250" y="172" fill="#FCA5A5" fontSize="10" fontWeight="bold">
                      Lesion 2 (89%)
                    </text>
                  </g>
                )}
              </svg>

              {/* Status Badge Over Image */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] text-white font-mono">
                Model: Edge Vision v1.4 • Inference: 38ms
              </div>
            </div>
          </div>

          {/* Mask Statistics */}
          <div className="md:col-span-5 space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[#6B7280]">Total Canopy Area Analyzed</span>
              <p className="text-base font-bold text-[#111827] mt-0.5">342.8 cm²</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[#6B7280]">Healthy Leaf Tissue</span>
              <p className="text-base font-bold text-[#16A34A] mt-0.5">304.2 cm² (88.7%)</p>
            </div>
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200">
              <span className="text-[#EF4444]">Necrotic / Chlorotic Lesions</span>
              <p className="text-base font-bold text-[#EF4444] mt-0.5">38.6 cm² (11.3%)</p>
            </div>
            <p className="text-[11px] text-[#6B7280] italic">
              Concentric ring morphology strongly matches Alternaria solani (Early Blight).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
