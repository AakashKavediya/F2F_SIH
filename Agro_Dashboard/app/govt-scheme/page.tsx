'use client';

import { useState } from 'react';
import {
  Landmark,
  TrendingUp,
  FileCheck,
  Clock,
  CheckCircle2,
  ExternalLink,
  Info,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Calculator,
  GitBranch,
  BadgeIndianRupee,
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import SchemeEligibilityCards from '@/components/govt-scheme/SchemeEligibilityCards';
import DocumentChecklist from '@/components/govt-scheme/DocumentChecklist';
import SchemeTable from '@/components/govt-scheme/SchemeTable';
import SchemeApplicationTracker from '@/components/govt-scheme/SchemeApplicationTracker';
import SchemeCalculator from '@/components/govt-scheme/SchemeCalculator';

const subTabs = [
  { id: 'eligibility', label: 'AI Eligibility & Documents', icon: CheckCircle2 },
  { id: 'tracker', label: 'Application Pipeline Tracker', icon: GitBranch },
  { id: 'calculator', label: 'Subsidy Calculator', icon: Calculator },
  { id: 'table', label: 'All Schemes Directory', icon: Landmark },
  { id: 'benefits', label: 'DBT Ledger & Benefits', icon: TrendingUp },
];

export default function GovtSchemePage() {
  const { govtSchemes, farmer, setIsProfileOpen } = useFarm();
  const [activeTab, setActiveTab] = useState('eligibility');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(govtSchemes[0]?.id ?? null);

  const selectedScheme = govtSchemes.find((s) => s.id === selectedSchemeId) ?? null;

  // Enhanced KPI metrics
  const kpis = [
    {
      label: 'PROFILE COMPLETION',
      value: `${farmer.profileCompletionPct || 92}% Complete`,
      sub: 'AgriStack & 5 Certificates Verified',
      icon: ShieldCheck,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'SCHEME MATCHES',
      value: '7 Potential Matches',
      sub: 'Tailored to 5.4 acres at Palghar',
      icon: Landmark,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'DOCUMENTS READY',
      value: '14/20 Ready',
      sub: '14/20 Required Documents Ready',
      icon: FileCheck,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
    },
    {
      label: 'PENDING ACTIONS',
      value: '2 Missing Docs',
      sub: 'Upload quote & bank letter',
      icon: Clock,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      label: 'TOTAL GRANT VALUE',
      value: '₹7,09,000+',
      sub: 'Confirmed & approved grants',
      icon: BadgeIndianRupee,
      color: 'text-emerald-800',
      bg: 'bg-emerald-50/80',
      border: 'border-emerald-200',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#166534] text-white">
              FarmerOS GovTech
            </span>
            <span className="text-xs text-[#166534] font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI Subsidy & Matching Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Government Schemes & Subsidies
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Eligibility matching, universal document uploads (PDF, PNG, Word, Excel), DBT tracking & multi-stage application pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-1.5 text-xs text-[#166534] font-semibold px-3 py-2 rounded-xl border border-[#86EFAC] bg-[#F0FDF4] hover:bg-[#DCFCE7] transition-all shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Farmer Profile & Certificates
          </button>
          <a
            href="https://agriwelfare.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-green-700 hover:text-green-800 font-medium px-3 py-2 rounded-xl border border-green-200 hover:border-green-300 bg-green-50 transition-all shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            AgriWelfare Portal
          </a>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={`rounded-2xl border ${kpi.border} ${kpi.bg} p-4 flex flex-col justify-between`}>
              <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center mb-2 shadow-xs">
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div>
                <p className={`text-xl font-bold tracking-tight ${kpi.color}`}>{kpi.value}</p>
                <p className="text-[11px] font-semibold text-gray-800 mt-0.5">{kpi.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 truncate">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-full sm:w-fit overflow-x-auto text-xs font-semibold">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#166534]' : 'text-gray-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: ELIGIBILITY & DOCUMENT CHECKLIST ================= */}
      {activeTab === 'eligibility' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Eligibility Cards */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Scheme Matches & Algorithmic Scoring
              </p>
              <span className="text-xs text-gray-400">Select card to view checklist</span>
            </div>
            <SchemeEligibilityCards
              schemes={govtSchemes}
              selectedSchemeId={selectedSchemeId}
              onSelect={setSelectedSchemeId}
            />
          </div>

          {/* Right: Document Checklist */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Selected Scheme Checklist
              </p>
              <DocumentChecklist scheme={selectedScheme} />
            </div>

            {/* Selected Scheme Detail Card */}
            {selectedScheme && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{selectedScheme.name}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{selectedScheme.category} Scheme</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                    {selectedScheme.eligibilityScore}% Match
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">{selectedScheme.description}</p>

                <div className="pt-2 border-t border-gray-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Financial Benefit:</span>
                    <span className="font-bold text-gray-900 text-right max-w-[65%]">
                      {selectedScheme.benefit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Submission Deadline:</span>
                    <span className="font-medium text-gray-700">{selectedScheme.deadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Application Status:</span>
                    <span className="font-semibold text-emerald-700">{selectedScheme.applicationStatus}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <a
                    href="https://agriwelfare.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    Apply on Official Portal <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setActiveTab('calculator')}
                    className="px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
                    title="Calculate subsidy"
                  >
                    <Calculator className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: APPLICATION MILESTONE TRACKER ================= */}
      {activeTab === 'tracker' && (
        <SchemeApplicationTracker schemes={govtSchemes} />
      )}

      {/* ================= TAB 3: SUBSIDY CALCULATOR ================= */}
      {activeTab === 'calculator' && (
        <SchemeCalculator />
      )}

      {/* ================= TAB 4: ALL SCHEMES DIRECTORY TABLE ================= */}
      {activeTab === 'table' && (
        <SchemeTable
          schemes={govtSchemes}
          selectedId={selectedSchemeId}
          onSelect={(id) => {
            setSelectedSchemeId(id);
            setActiveTab('eligibility');
          }}
        />
      )}

      {/* ================= TAB 5: BENEFITS & DBT DISBURSAL LEDGER ================= */}
      {activeTab === 'benefits' && (
        <div className="space-y-6">
          {/* Benefits breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-gray-900">Direct Benefit Transfer (DBT) Disbursal Ledger</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Verified payments deposited into State Bank of India (A/c ••••••••3821, IFSC: SBIN0001234)
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                Aadhaar NPCI Active
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {[
                { scheme: 'PM-KISAN', status: 'Disbursed', amount: '₹2,000', installment: '17th Installment • Ref: UTR-PFMS-998241029', color: 'text-emerald-700', badge: 'bg-emerald-50 border-emerald-200 text-emerald-700', date: '18 Jun 2026' },
                { scheme: 'Namo Shetkari Mahasanman Nidhi', status: 'Disbursed', amount: '₹2,000', installment: 'State Component • Ref: MH-GOV-DBT-88219', color: 'text-emerald-700', badge: 'bg-emerald-50 border-emerald-200 text-emerald-700', date: '22 Jul 2026' },
                { scheme: 'PMFBY Crop Insurance', status: 'Active Policy', amount: '₹18,500 Cover', installment: 'Kharif 2026 Premium Debited • Claim protection active', color: 'text-blue-700', badge: 'bg-blue-50 border-blue-200 text-blue-700', date: 'Policy Active' },
                { scheme: 'PMKSY Micro-Irrigation', status: 'Pre-Sanctioned', amount: '₹1,24,000', installment: '55% Capital Subsidy • Scheduled post installation check', color: 'text-amber-700', badge: 'bg-amber-50 border-amber-200 text-amber-700', date: 'Oct 2026 Expected' },
                { scheme: 'SMAM Robot & Drone Subsidy', status: 'Under Scrutiny', amount: '₹1,80,000', installment: 'AgroBot AGB-02 Subsidy grant (40% cost share)', color: 'text-blue-700', badge: 'bg-blue-50 border-blue-200 text-blue-700', date: 'Nov 2026 Expected' },
                { scheme: 'Soil Health Card', status: 'Card Issued', amount: '100% Free Lab Diagnostics', installment: 'Sample Ref: SHC-PLG-2026-091 • Valid till Feb 2028', color: 'text-green-700', badge: 'bg-green-50 border-green-200 text-green-700', date: 'Valid 2 Years' },
              ].map((b, i) => (
                <div key={i} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">{b.scheme}</p>
                      <span className="text-[10px] text-gray-400 font-mono">({b.date})</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{b.installment}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${b.badge}`}>
                      {b.status}
                    </span>
                    <span className={`text-sm font-extrabold ${b.color}`}>{b.amount}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-semibold text-gray-700 text-xs">
                Cumulative Government Benefit Value (Disbursed + Approved Grants)
              </span>
              <span className="font-extrabold text-green-800 text-base">₹7,09,000+ Total Value</span>
            </div>
          </div>

          {/* Action items */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" /> Pending Actions for Subsidy Disbursal
            </h4>
            <div className="space-y-2">
              {[
                { action: 'Upload Drip Irrigation OEM Vendor quotation for PMKSY application', deadline: 'Before 15 Oct 2026', urgency: 'high' },
                { action: 'Attach Bank Sanction Letter from PNB for SMAM robotics subsidy', deadline: 'Before 30 Nov 2026', urgency: 'medium' },
                { action: 'Verify soil test baseline with KVK agronomist for organic PKVY cluster transition', deadline: 'Before Dec 2026', urgency: 'medium' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-amber-100 text-xs">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      item.urgency === 'high' ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{item.action}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{item.deadline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
