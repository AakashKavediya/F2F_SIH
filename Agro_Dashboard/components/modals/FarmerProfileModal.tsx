'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  User,
  MapPin,
  ShieldCheck,
  Award,
  CreditCard,
  Sprout,
  Phone,
  Upload,
  FileText,
  FileImage,
  FileCode,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

interface CertDocItem {
  id: string;
  title: string;
  category: string;
  fileName: string;
  format: 'PDF' | 'PNG' | 'WORD' | 'EXCEL';
  status: string;
}

export function FarmerProfileModal() {
  const { isProfileOpen, setIsProfileOpen, farmer, farm } = useFarm();

  const [certificates, setCertificates] = useState<CertDocItem[]>([
    {
      id: '712',
      title: '7/12 Extract',
      category: 'Land Record',
      fileName: '7_12_Extract_42_1_42_2.pdf',
      format: 'PDF',
      status: 'Verified',
    },
    {
      id: '8a',
      title: '8-A Extract',
      category: 'Khata Holding',
      fileName: '8A_Holding_Extract.pdf',
      format: 'PDF',
      status: 'Verified',
    },
    {
      id: 'caste',
      title: 'Caste Certificate',
      category: 'Category Proof',
      fileName: 'OBC_Caste_Certificate.png',
      format: 'PNG',
      status: 'Verified',
    },
    {
      id: 'income',
      title: 'Income Certificate',
      category: 'Revenue Document',
      fileName: 'Tehsildar_Income_Cert.docx',
      format: 'WORD',
      status: 'Verified',
    },
    {
      id: 'domicile',
      title: 'Domicile Certificate',
      category: 'State Residence',
      fileName: 'Maharashtra_Domicile.pdf',
      format: 'PDF',
      status: 'Verified',
    },
  ]);

  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isProfileOpen) return null;

  const detectFormat = (name: string): 'PDF' | 'PNG' | 'WORD' | 'EXCEL' => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'PDF';
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return 'PNG';
    if (ext === 'doc' || ext === 'docx') return 'WORD';
    if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return 'EXCEL';
    return 'PDF';
  };

  const getFormatBadge = (fmt: 'PDF' | 'PNG' | 'WORD' | 'EXCEL') => {
    switch (fmt) {
      case 'PDF':
        return { label: 'PDF', bg: 'bg-red-50 text-red-700 border-red-200', icon: FileText };
      case 'PNG':
        return { label: 'PNG', bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: FileImage };
      case 'WORD':
        return { label: 'WORD', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: FileCode };
      case 'EXCEL':
        return { label: 'EXCEL', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: FileSpreadsheet };
    }
  };

  const handleTriggerUpload = (id: string) => {
    setActiveUploadId(id);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadId) return;

    const fmt = detectFormat(file.name);
    setCertificates((prev) =>
      prev.map((c) =>
        c.id === activeUploadId
          ? {
              ...c,
              fileName: file.name,
              format: fmt,
              status: 'Verified',
            }
          : c
      )
    );

    setUploadNotice(`✓ "${file.name}" uploaded successfully (${fmt})`);
    setTimeout(() => setUploadNotice(null), 3500);
    setActiveUploadId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Hidden Universal File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,application/pdf,image/png,image/jpeg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="hidden"
      />

      <div className="bg-white rounded-2xl shadow-float border border-[#E5E7EB] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F7F9F7]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#166534] text-white font-bold text-base flex items-center justify-center shadow-sm">
              AP
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#111827] flex items-center gap-2">
                {farmer.name}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#16A34A]" /> eKYC Verified
                </span>
              </h3>
              <p className="text-xs text-[#6B7280]">
                {farmer.id} • {farmer.experience} Experience
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileOpen(false)}
            className="p-1.5 rounded-xl text-[#9CA3AF] hover:text-[#111827] hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Location & Contacts */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#16A34A]" /> Location
              </span>
              <p className="font-semibold text-[#111827] mt-1">{farmer.village}, {farmer.taluka}</p>
              <p className="text-[11px] text-[#6B7280]">{farmer.district}, {farmer.state}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280] flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#16A34A]" /> Registered Mobile
              </span>
              <p className="font-semibold text-[#111827] mt-1">{farmer.mobile}</p>
              <p className="text-[10px] text-[#166534] mt-0.5">● SMS Agromet Alerts Active</p>
            </div>
          </div>

          {/* Farm Details Card */}
          <div className="p-4 rounded-xl border border-[#E5E7EB] bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-2">
              <span className="text-xs font-semibold text-[#111827] flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-[#16A34A]" /> {farm.name}
              </span>
              <span className="text-xs font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">
                Health {farm.farmHealth}/100
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-[#F7F9F7]">
                <div className="text-[11px] text-[#6B7280]">Total Land</div>
                <div className="text-sm font-semibold text-[#111827] mt-0.5">{farm.totalArea} ac</div>
              </div>
              <div className="p-2 rounded-lg bg-[#F7F9F7]">
                <div className="text-[11px] text-[#6B7280]">Irrigated</div>
                <div className="text-sm font-semibold text-[#111827] mt-0.5">{farm.irrigatedArea} ac</div>
              </div>
              <div className="p-2 rounded-lg bg-[#F7F9F7]">
                <div className="text-[11px] text-[#6B7280]">Cultivable</div>
                <div className="text-sm font-semibold text-[#111827] mt-0.5">{farm.cultivableArea} ac</div>
              </div>
            </div>
          </div>

          {/* Verified Certificates & Land Records with File Upload Support */}
          <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-2">
              <div>
                <span className="font-semibold text-[#111827] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" /> Verified Farmer Certificates & Documents
                </span>
                <span className="text-[10px] text-[#6B7280] mt-0.5 block">
                  Supports: <strong>PDF, PNG, Word (.docx), Excel (.xlsx)</strong>
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                5 Active
              </span>
            </div>

            {uploadNotice && (
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{uploadNotice}</span>
              </div>
            )}

            <div className="space-y-2 pt-1">
              {certificates.map((doc) => {
                const badge = getFormatBadge(doc.format);
                const BadgeIcon = badge.icon;
                return (
                  <div
                    key={doc.id}
                    className="p-2.5 rounded-lg bg-[#F7F9F7] border border-[#E5E7EB] flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-[#6B7280]">{doc.category}:</span>
                        <strong className="text-[#111827]">{doc.title}</strong>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border flex items-center gap-1 ${badge.bg}`}>
                          <BadgeIcon className="w-2.5 h-2.5" />
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#166534] truncate mt-0.5">{doc.fileName}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-bold text-[#166534] bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                        ✓ {doc.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleTriggerUpload(doc.id)}
                        className="px-2 py-1 rounded bg-white border border-[#D1D5DB] text-[10px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1 shadow-xs"
                        title="Upload/Replace file (PDF, PNG, Word, Excel)"
                      >
                        <Upload className="w-3 h-3 text-[#16A34A]" />
                        <span>Upload</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Regulatory & Institutional Credentials */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#E5E7EB] bg-[#FCFDFC]">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#16A34A]" />
                <span className="text-[#6B7280]">Farmer Portal Reg:</span>
              </div>
              <span className="font-semibold text-[#111827]">{farmer.registration}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#E5E7EB] bg-[#FCFDFC]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-[#6B7280]">Kisan Credit Card (KCC):</span>
              </div>
              <span className="font-semibold text-[#111827]">{farmer.kccLimit}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#E5E7EB] bg-[#FCFDFC]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#166534]" />
                <span className="text-[#6B7280]">Crop Insurance Status:</span>
              </div>
              <span className="font-semibold text-[#166534]">{farmer.insuranceStatus}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F7F9F7] border-t border-[#E5E7EB] flex justify-end">
          <button
            onClick={() => setIsProfileOpen(false)}
            className="px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#111827] hover:bg-[#F3F4F6] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
