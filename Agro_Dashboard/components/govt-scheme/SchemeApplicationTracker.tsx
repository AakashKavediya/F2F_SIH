'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  Building,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Calendar,
  IndianRupee,
} from 'lucide-react';
import { GovtSchemeItem } from '@/data/types';

interface Props {
  schemes: GovtSchemeItem[];
}

interface ApplicationTrackItem {
  id: string;
  schemeName: string;
  schemeId: string;
  applicationNumber: string;
  submittedOn: string;
  lastUpdated: string;
  currentStage: number; // 1 to 4
  stages: {
    title: string;
    officer: string;
    status: 'completed' | 'in_progress' | 'pending';
    date?: string;
    remarks: string;
  }[];
  disbursalAmount: string;
  bankAccount: string;
  urgencyNote?: string;
}

export default function SchemeApplicationTracker({ schemes }: Props) {
  const [selectedAppId, setSelectedAppId] = useState<string>('APP-PMKSY-2026-881');

  const applications: ApplicationTrackItem[] = [
    {
      id: 'APP-PMKSY-2026-881',
      schemeName: 'PMKSY - Per Drop More Crop (Micro-Irrigation)',
      schemeId: 'SCH-02',
      applicationNumber: 'MH-PLG-PMKSY-884192',
      submittedOn: '04 Sep 2026',
      lastUpdated: '22 Sep 2026',
      currentStage: 2,
      disbursalAmount: '₹1,24,000 (55% Capital Subsidy)',
      bankAccount: 'State Bank of India (A/c ••••••••3821)',
      urgencyNote: 'Action Needed: Upload Drip Vendor Proforma Quote to progress to Stage 3.',
      stages: [
        {
          title: 'Online Application & eKYC',
          officer: 'AgriStack Auto-Verification System',
          status: 'completed',
          date: '04 Sep 2026',
          remarks: 'Aadhaar, 7/12 Extract, 8-A Extract, and Bank DBT details verified.',
        },
        {
          title: 'Field Verification & Land Inspection',
          officer: 'Talathi & Block Agriculture Officer, Palghar',
          status: 'in_progress',
          date: '18 Sep 2026',
          remarks: 'Water source (borewell) verified on site. Awaiting official vendor quotation upload.',
        },
        {
          title: 'District Technical Sanction',
          officer: 'District Agriculture Officer (DAO), Palghar',
          status: 'pending',
          remarks: 'Administrative sanction pending post field quotation verification.',
        },
        {
          title: 'PFMS / DBT Subsidy Disbursal',
          officer: 'Public Financial Management System (PFMS Gateway)',
          status: 'pending',
          remarks: 'Direct subsidy transfer to bank account upon installation inspection.',
        },
      ],
    },
    {
      id: 'APP-SMAM-2026-402',
      schemeName: 'Sub-Mission on Agricultural Mechanization (SMAM)',
      schemeId: 'SCH-04',
      applicationNumber: 'SMAM-MAH-2026-0914',
      submittedOn: '12 Aug 2026',
      lastUpdated: '15 Sep 2026',
      currentStage: 3,
      disbursalAmount: '₹1,80,000 (40% AgroBot Subsidy)',
      bankAccount: 'State Bank of India (A/c ••••••••3821)',
      stages: [
        {
          title: 'Portal Registration & Profile Sync',
          officer: 'MahaDBT Agriculture Portal',
          status: 'completed',
          date: '12 Aug 2026',
          remarks: 'Farmer eligibility confirmed (OBC category quota verified).',
        },
        {
          title: 'Dealer Proforma & Technical Scrutiny',
          officer: 'State Agrimachinery Verification Cell',
          status: 'completed',
          date: '28 Aug 2026',
          remarks: 'AgroBot AGB-02 robotics technical specs approved.',
        },
        {
          title: 'Bank Sanction In-Principle Approval',
          officer: 'Punjab National Bank (Lead District Bank)',
          status: 'in_progress',
          date: '15 Sep 2026',
          remarks: 'Term loan document under final credit scrutiny. Decision expected by 10 Oct.',
        },
        {
          title: 'Subsidy Release to OEM / Farmer',
          officer: 'Treasury & PFMS Central Gateway',
          status: 'pending',
          remarks: 'Disbursal within 14 days of final loan sanction letter issuance.',
        },
      ],
    },
    {
      id: 'APP-PMKISAN-2026-001',
      schemeName: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      schemeId: 'SCH-01',
      applicationNumber: 'PMK-MH-PLG-77401',
      submittedOn: '15 Feb 2021',
      lastUpdated: '18 Jun 2026',
      currentStage: 4,
      disbursalAmount: '₹6,000 / year (₹2,000 / installment)',
      bankAccount: 'State Bank of India (A/c ••••••••3821)',
      stages: [
        {
          title: 'Farmer Land Ownership Authentication',
          officer: 'Revenue Department Maharashtra (Mahabhulekh)',
          status: 'completed',
          date: '15 Feb 2021',
          remarks: 'Landholding 5.4 acres linked with Aadhaar.',
        },
        {
          title: 'Aadhaar eKYC & NPCI Seeding',
          officer: 'UIDAI & NPCI APB Gateway',
          status: 'completed',
          date: '10 Oct 2023',
          remarks: 'Biometric and OTP eKYC successfully updated.',
        },
        {
          title: 'State Approval & Beneficiary List',
          officer: 'Department of Agriculture, Govt of Maharashtra',
          status: 'completed',
          date: '20 Oct 2023',
          remarks: 'Beneficiary status: Approved and Active in R-17 Batch.',
        },
        {
          title: '17th Installment Disbursed',
          officer: 'PFMS Direct Transfer',
          status: 'completed',
          date: '18 Jun 2026',
          remarks: '₹2,000 credited (Ref: UTR-PFMS-998241029).',
        },
      ],
    },
  ];

  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#F0FDF4] to-[#F7F9F7] p-5 rounded-2xl border border-[#BBF7D0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#166534] text-white">
            Live Application Tracker
          </span>
          <h2 className="text-lg font-bold text-[#111827] mt-1">
            Government Scheme Application & Disbursal Pipeline
          </h2>
          <p className="text-xs text-[#4B5563]">
            Track multi-stage government inspections, revenue endorsements (7/12 & 8-A), and PFMS bank transfers in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#166534] bg-white px-3 py-1.5 rounded-xl border border-[#BBF7D0] shadow-xs">
            3 Active Tracking Records
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Application Cards Selector */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Select Application to Inspect
          </p>
          {applications.map((app) => {
            const isSelected = app.id === selectedAppId;
            return (
              <div
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs ${
                  isSelected
                    ? 'bg-white border-[#16A34A] shadow-md ring-2 ring-[#86EFAC]/40'
                    : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-[#111827] line-clamp-1">{app.schemeName}</span>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isSelected ? 'text-[#166534]' : 'text-gray-400'
                    }`}
                  />
                </div>

                <div className="mt-2 space-y-1 text-[11px] text-gray-500">
                  <div className="flex justify-between">
                    <span>App No:</span>
                    <strong className="font-mono text-gray-800">{app.applicationNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Benefit Value:</span>
                    <strong className="text-[#166534]">{app.disbursalAmount}</strong>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                    <span>Stage {app.currentStage} of 4</span>
                    <span className="font-semibold text-[#166534]">
                      {app.currentStage === 4 ? '100% Completed' : `${app.currentStage * 25}%`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-[#16A34A] h-1.5 rounded-full transition-all"
                      style={{ width: `${app.currentStage * 25}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Stages Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            
            {/* Selected Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
              <div>
                <span className="text-[10px] font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">
                  Application Dossier: {selectedApp.applicationNumber}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-1">
                  {selectedApp.schemeName}
                </h3>
                <p className="text-xs text-gray-500">
                  Submitted: {selectedApp.submittedOn} • Updated: {selectedApp.lastUpdated}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-gray-500 block">Target DBT Account</span>
                <strong className="text-xs text-gray-800">{selectedApp.bankAccount}</strong>
              </div>
            </div>

            {/* Urgency Notice if any */}
            {selectedApp.urgencyNote && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{selectedApp.urgencyNote}</span>
              </div>
            )}

            {/* Visual 4-Stage Timeline */}
            <div className="space-y-4 pt-2">
              {selectedApp.stages.map((stage, idx) => {
                const stageNum = idx + 1;
                const isCompleted = stage.status === 'completed';
                const isCurrent = stage.status === 'in_progress';
                const isPending = stage.status === 'pending';

                return (
                  <div key={idx} className="flex items-start gap-4">
                    {/* Icon Column */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCompleted
                            ? 'bg-[#16A34A] text-white shadow-xs'
                            : isCurrent
                            ? 'bg-[#F59E0B] text-white animate-pulse shadow-xs'
                            : 'bg-gray-100 text-gray-400 border border-gray-200'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stageNum}
                      </div>
                      {idx < selectedApp.stages.length - 1 && (
                        <div
                          className={`w-0.5 h-12 my-1 ${
                            isCompleted ? 'bg-[#16A34A]' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>

                    {/* Content Box */}
                    <div
                      className={`flex-1 p-3.5 rounded-xl border transition-all text-xs ${
                        isCurrent
                          ? 'bg-amber-50/50 border-amber-200'
                          : isCompleted
                          ? 'bg-[#F0FDF4]/50 border-emerald-100'
                          : 'bg-gray-50/50 border-gray-100 opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{stage.title}</h4>
                          <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3 text-gray-400" />
                            {stage.officer}
                          </span>
                        </div>
                        {stage.date && (
                          <span className="text-[10px] font-semibold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                            {stage.date}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-700 mt-2">
                        {stage.remarks}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-gray-500">
                Official Helpline: <strong>1800-180-1551 (Kisan Call Centre)</strong>
              </span>
              <a
                href="https://agriwelfare.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold flex items-center gap-1.5 transition-colors"
              >
                Track on Government Portal <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
