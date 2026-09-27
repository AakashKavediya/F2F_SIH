'use client';

import React, { useState } from 'react';
import {
  BarChart2,
  Droplets,
  Bot,
  Download,
  FileSpreadsheet,
  FileText,
  Leaf,
  Activity,
  TrendingUp,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Sparkles,
  Layers,
  Bug,
  Clock,
  User,
} from 'lucide-react';
import { FarmOverviewReport } from '@/components/reports/FarmOverviewReport';
import { CropHealthReport } from '@/components/reports/CropHealthReport';
import YieldForecastChart from '@/components/reports/YieldForecastChart';
import WaterUsageReport from '@/components/reports/WaterUsageReport';
import { SoilHydrologyReport } from '@/components/reports/SoilHydrologyReport';
import { PathologyEventsReport } from '@/components/reports/PathologyEventsReport';
import { IrrigationHistoryReport } from '@/components/reports/IrrigationHistoryReport';
import { RoboticsMissionReport } from '@/components/reports/RoboticsMissionReport';
import { RiskEngineReport } from '@/components/reports/RiskEngineReport';
import { GovtSchemesReport } from '@/components/reports/GovtSchemesReport';
import { NutrientSoilReport } from '@/components/reports/NutrientSoilReport';
import { FarmPerformanceCard } from '@/components/reports/FarmPerformanceCard';
import ExportButtons from '@/components/reports/ExportButtons';
import { exportFarmExcelReport } from '@/lib/exportExcel';
import { exportFarmPdfReport } from '@/lib/exportPdf';

type TabType =
  | 'all'
  | 'overview'
  | 'crop'
  | 'yield'
  | 'water'
  | 'pathology'
  | 'irrigation-history'
  | 'robotics'
  | 'risk'
  | 'schemes'
  | 'nutrients'
  | 'export';

const reportTabs = [
  { id: 'all', label: 'All 10 Reports (Unified View)', icon: Layers },
  { id: 'overview', label: '1. Farm & Farmer Overview', icon: User },
  { id: 'crop', label: '2. Crop Health Summary', icon: Leaf },
  { id: 'yield', label: '3. Yield Forecast by Crop', icon: TrendingUp },
  { id: 'water', label: '4. Water Usage & ETc', icon: Droplets },
  { id: 'pathology', label: '5. Disease / Pest / Weed', icon: Bug },
  { id: 'irrigation-history', label: '6. Irrigation History', icon: Clock },
  { id: 'robotics', label: '7. Robot Mission Logs', icon: Bot },
  { id: 'risk', label: '8. Risk & Alert Timeline', icon: Activity },
  { id: 'schemes', label: '9. Govt Scheme Eligibility', icon: Landmark },
  { id: 'nutrients', label: '10. Nutrient & Soil Data', icon: Sparkles },
  { id: 'export', label: 'Export Center', icon: Download },
];

const summaryMetrics = [
  {
    label: 'Season Revenue Potential',
    value: '₹5.20 Lakh',
    sub: 'Projected 4.6t harvest yield',
    icon: TrendingUp,
    color: 'text-[#166534]',
    bg: 'bg-[#F0FDF4]',
    border: 'border-[#DCFCE7]',
  },
  {
    label: 'AI Water Cost Savings',
    value: '₹18,400',
    sub: '23.6 mm saved via precision drip',
    icon: Droplets,
    color: 'text-[#0284C7]',
    bg: 'bg-[#F0F9FF]',
    border: 'border-[#E0F2FE]',
  },
  {
    label: 'Autonomous Labor Savings',
    value: '₹32,000',
    sub: '284h autonomous fleet ops',
    icon: Bot,
    color: 'text-[#7C3AED]',
    bg: 'bg-[#F5F3FF]',
    border: 'border-[#DDD6FE]',
  },
  {
    label: 'Crop Loss Prevented',
    value: '₹24,600',
    sub: 'Early blight spot intervention',
    icon: ShieldCheck,
    color: 'text-[#B45309]',
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#FDE68A]',
  },
];

export default function ReportAnalysisPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [pdfState, setPdfState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [excelState, setExcelState] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleDownloadPdf = async () => {
    if (pdfState === 'loading') return;
    setPdfState('loading');
    try {
      exportFarmPdfReport();
      setPdfState('done');
      setTimeout(() => setPdfState('idle'), 3000);
    } catch (err) {
      console.error(err);
      setPdfState('idle');
    }
  };

  const handleDownloadExcel = async () => {
    if (excelState === 'loading') return;
    setExcelState('loading');
    try {
      exportFarmExcelReport();
      setExcelState('done');
      setTimeout(() => setExcelState('idle'), 3000);
    } catch (err) {
      console.error(err);
      setExcelState('idle');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header with Instant PDF / Excel Downloads */}
      <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
              Comprehensive Farm Intelligence
            </span>
            <span className="text-xs text-[#6B7280]">
              All 10 Operational Domains • Verified Telemetry
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] mt-1.5">
            Farm Reports & Analytics Engine
          </h1>
          <p className="text-xs text-[#4B5563] mt-0.5 max-w-2xl">
            Complete data dossier covering farm overview, crop health, yield forecasts, water hydrology, pathology events, irrigation history, robotics telemetry, risk timeline, government subsidies, and soil chemistry.
          </p>
        </div>

        {/* Global Download Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* PDF Download Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={pdfState === 'loading'}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all shadow-xs disabled:opacity-70"
            title="Download complete 10-report PDF dossier"
          >
            {pdfState === 'loading' ? (
              <Loader2 className="w-3.5 h-3.5 text-rose-700 animate-spin" />
            ) : pdfState === 'done' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-rose-700" />
            )}
            <span>{pdfState === 'done' ? 'PDF Exported!' : pdfState === 'loading' ? 'Exporting PDF...' : 'Download PDF Report'}</span>
          </button>

          {/* Excel Download Button */}
          <button
            onClick={handleDownloadExcel}
            disabled={excelState === 'loading'}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#166534] bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#BBF7D0] transition-all shadow-xs disabled:opacity-70"
            title="Download full 31-sheet Excel workbook"
          >
            {excelState === 'loading' ? (
              <Loader2 className="w-3.5 h-3.5 text-[#16A34A] animate-spin" />
            ) : excelState === 'done' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#16A34A]" />
            )}
            <span>{excelState === 'done' ? 'Excel Exported!' : excelState === 'loading' ? 'Exporting Excel...' : 'Download Excel (.xlsx)'}</span>
          </button>
        </div>
      </div>

      {/* Executive Financial & Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className={`rounded-2xl border ${m.border} ${m.bg} p-4 shadow-subtle flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#4B5563]">{m.label}</span>
                <div className="w-8 h-8 rounded-xl bg-white/80 border border-white flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
              </div>
              <div>
                <p className={`text-2xl font-extrabold ${m.color} tracking-tight`}>{m.value}</p>
                <p className="text-[11px] text-[#6B7280] mt-0.5">{m.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sub-Tabs Navigator */}
      <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1.5 rounded-2xl border border-[#E2E8F0] overflow-x-auto">
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-[#0F172A] shadow-xs border border-[#E2E8F0]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#16A34A]' : 'text-[#64748B]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ALL 10 REPORTS IN ONE UNIFIED VIEW */}
      {(activeTab === 'all' || activeTab === 'overview') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-[#E2E8F0] text-xs text-[#475569]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#16A34A]" />
              <span>
                <strong>All 10 Core Reports</strong> loaded with interactive bar charts. Use the quick tabs above to jump directly to any sector, or click <strong>Download PDF / Excel</strong> to export the complete dossier.
              </span>
            </div>
            <span className="hidden sm:inline text-[11px] font-mono text-[#64748B]">Station: KVK Kosbad Hill</span>
          </div>

          {/* 1. Farm & Farmer Overview */}
          <FarmOverviewReport />
        </div>
      )}

      {(activeTab === 'all' || activeTab === 'crop') && (
        <div className="space-y-6">
          {/* 2. Crop Health Summary */}
          <CropHealthReport />
        </div>
      )}

      {(activeTab === 'all' || activeTab === 'yield') && (
        <div className="space-y-6">
          {/* 3. Yield Forecast by Crop */}
          <YieldForecastChart />
        </div>
      )}

      {(activeTab === 'all' || activeTab === 'water') && (
        <div className="space-y-6">
          {/* 4. Water Usage & ETc */}
          <SoilHydrologyReport />
          <WaterUsageReport />
        </div>
      )}

      {(activeTab === 'all' || activeTab === 'pathology') && (
        <div className="space-y-6">
          {/* 5. Disease / Pest / Weed Events */}
          <PathologyEventsReport />
        </div>
      )}

      {(activeTab === 'all' || activeTab === 'irrigation-history') && (
        <div className="space-y-6">
          {/* 6. Irrigation History */}
          <IrrigationHistoryReport />
        </div>
      )}

      {(activeTab === 'all' || activeTab === 'robotics') && (
        <div className="space-y-6">
          {/* 7. Robot Mission Logs */}
          <RoboticsMissionReport />
        </div>
      )}

      {(activeTab === 'all' || activeTab === 'risk') && (
        <div className="space-y-6">
          {/* 8. Risk & Alert Timeline */}
          <RiskEngineReport />
        </div>
      )}

      {(activeTab === 'all' || activeTab === 'schemes') && (
        <div className="space-y-6">
          {/* 9. Govt Scheme Eligibility */}
          <GovtSchemesReport />
        </div>
      )}

      {(activeTab === 'all' || activeTab === 'nutrients') && (
        <div className="space-y-6">
          {/* 10. Nutrient & Soil Data */}
          <NutrientSoilReport />
        </div>
      )}

      {/* 30-Day Performance Trajectory (Always visible in All view) */}
      {activeTab === 'all' && (
        <div className="space-y-6">
          <FarmPerformanceCard />
        </div>
      )}

      {/* EXPORT CENTER */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <ExportButtons />

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-subtle space-y-4">
            <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#16A34A]" />
              Complete 10-Domain Manifest in Export Dossier
            </h3>
            <p className="text-xs text-[#64748B]">
              Every metric, sensor threshold, and AI observation across all 10 areas is bundled into the PDF and 31-sheet Excel workbook:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {[
                { title: '1. Farm & Farmer Overview', desc: 'Aadhaar, 7/12, KCC limit, eKYC status, holding size' },
                { title: '2. Crop Health Summary', desc: 'Cultivars, crop age, phenology, plant stands, health %' },
                { title: '3. Yield Forecast by Crop', desc: 'Tonnage projections, harvest dates, market valuation' },
                { title: '4. Water Usage & ETc', desc: 'Penman-Monteith ET0/ETc, water saved, flow rates' },
                { title: '5. Disease/Pest/Weed Events', desc: 'Alternaria, Whiteflies, Parthenium weed density logs' },
                { title: '6. Irrigation History', desc: 'Liters delivered, run durations, pre/post moisture delta' },
                { title: '7. Robot Mission Logs', desc: 'LiDAR SLAM coordinates, battery, uptime, speed' },
                { title: '8. Risk & Alert Timeline', desc: 'Hazard probabilities, compound environmental factors' },
                { title: '9. Govt Scheme Eligibility', desc: 'PM-KISAN, PMKSY, SMAM, PMFBY subsidy dossiers' },
                { title: '10. Nutrient & Soil Data', desc: 'Available Nitrogen, Phosphorus, Potassium (NPK mg/kg)' },
              ].map((item) => (
                <div key={item.title} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] pl-5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
