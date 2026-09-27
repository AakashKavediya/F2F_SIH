'use client';

import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Upload,
  FileSpreadsheet,
  FileImage,
  FileCode,
  FileCheck,
  Check,
  Trash2,
} from 'lucide-react';
import { GovtSchemeItem } from '@/data/types';

interface DocumentItem {
  name: string;
  status: 'available' | 'missing' | 'verified' | 'expired';
  note?: string;
}

interface UploadedFileMeta {
  fileName: string;
  fileSize: string;
  format: 'PDF' | 'PNG' | 'WORD' | 'EXCEL' | 'DOC';
  uploadedAt: string;
}

// Document checklists mapped by scheme shortName
const initialDocumentsByScheme: Record<string, DocumentItem[]> = {
  'default': [
    { name: 'Aadhaar Card', status: 'verified', note: 'Linked with bank account' },
    { name: '7/12 Extract', status: 'verified', note: 'Land revenue record (Survey 42/1, 42/2)' },
    { name: '8-A Extract', status: 'verified', note: 'Khata holding record (Khata No. 891)' },
    { name: 'Caste Certificate', status: 'verified', note: 'OBC category proof' },
    { name: 'Income Certificate', status: 'verified', note: 'Tehsildar approved (₹1,80,000)' },
    { name: 'Domicile Certificate', status: 'verified', note: 'Maharashtra state resident certificate' },
    { name: 'Bank Account Details', status: 'verified', note: 'Aadhaar NPCI active' },
    { name: 'eKYC Completion', status: 'verified', note: 'Completed Oct 2023' },
  ],
  'PM-KISAN': [
    { name: 'Aadhaar Card', status: 'verified', note: 'Linked with bank account' },
    { name: '7/12 Extract', status: 'verified', note: 'Land ownership verified' },
    { name: '8-A Extract', status: 'verified', note: 'Khata holding registered' },
    { name: 'Income Certificate', status: 'verified', note: 'Tehsildar certified' },
    { name: 'Domicile Certificate', status: 'verified', note: 'Maharashtra state domicile' },
    { name: 'Bank Passbook / Account Details', status: 'verified', note: 'State Bank of India, A/c ****3821' },
    { name: 'eKYC Completion', status: 'verified', note: 'Completed Oct 2023' },
    { name: 'Mobile Number (OTP linked)', status: 'verified', note: '+91 98765 43210' },
    { name: 'PM-KISAN Registration ID', status: 'available', note: 'ID: PMKISAN2024RA9871' },
  ],
  'PMKSY Micro-Irrigation': [
    { name: 'Aadhaar Card', status: 'verified' },
    { name: '7/12 Extract', status: 'verified', note: 'Land parcel ownership' },
    { name: '8-A Extract', status: 'verified', note: 'Holding area certified' },
    { name: 'Caste Certificate', status: 'verified', note: 'OBC / Small & Marginal quota subsidy' },
    { name: 'Income Certificate', status: 'available', note: 'Family income certificate' },
    { name: 'Domicile Certificate', status: 'verified', note: 'Resident proof' },
    { name: 'Drip / Sprinkler Installation Quote', status: 'missing', note: 'Required from empanelled vendor' },
    { name: 'Bank Account Details', status: 'verified' },
    { name: 'Photo of Existing Irrigation Setup', status: 'missing', note: 'Upload recent farm photo' },
  ],
  'PMFBY Crop Insurance': [
    { name: 'Aadhaar Card', status: 'verified' },
    { name: '7/12 Extract', status: 'verified', note: 'Crop area revenue proof' },
    { name: '8-A Extract', status: 'verified', note: 'Khata possession record' },
    { name: 'Domicile Certificate', status: 'verified', note: 'Resident certificate' },
    { name: 'Kisan Credit Card (KCC)', status: 'available', note: 'KCC No. KCC2024RA1234' },
    { name: 'Crop Sowing Declaration', status: 'available', note: 'Kharif 2026 declared' },
    { name: 'Bank Loan Account Statement', status: 'available' },
    { name: 'Premium Payment Confirmation', status: 'missing', note: 'Auto-deducted pending' },
  ],
  'SMAM Robot & Drone Subsidy': [
    { name: 'Aadhaar Card', status: 'verified' },
    { name: '7/12 Extract', status: 'verified', note: 'Minimum 1 ha land proof' },
    { name: '8-A Extract', status: 'verified', note: 'Khata holding certificate' },
    { name: 'Caste Certificate', status: 'verified', note: 'OBC special mechanization grant' },
    { name: 'Income Certificate', status: 'verified', note: 'Annual income certificate' },
    { name: 'Domicile Certificate', status: 'verified', note: 'State domicile proof' },
    { name: 'Farm Registration Number', status: 'available' },
    { name: 'Equipment Purchase Invoice', status: 'missing', note: 'Proforma from authorised dealer' },
    { name: 'Bank Account (subsidy credit)', status: 'verified' },
  ],
  'Soil Health Card': [
    { name: 'Aadhaar Card', status: 'verified' },
    { name: '7/12 Extract', status: 'verified', note: 'Cadastral land proof' },
    { name: '8-A Extract', status: 'verified', note: 'Holding certificate' },
    { name: 'Soil Sample Collection Receipt', status: 'available', note: 'Sample registered' },
    { name: 'Farm GPS Coordinates', status: 'available', note: 'Captured by AgroBot' },
  ],
};

const statusConfig = {
  available: { label: 'Available', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  verified: { label: 'Verified', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  missing: { label: 'Missing', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  expired: { label: 'Expired', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
};

function detectFileFormat(fileName: string): 'PDF' | 'PNG' | 'WORD' | 'EXCEL' | 'DOC' {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'PDF';
  if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return 'PNG';
  if (ext === 'doc' || ext === 'docx') return 'WORD';
  if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return 'EXCEL';
  return 'DOC';
}

function getFormatBadgeConfig(fmt: 'PDF' | 'PNG' | 'WORD' | 'EXCEL' | 'DOC') {
  switch (fmt) {
    case 'PDF':
      return { label: 'PDF', bg: 'bg-red-50 text-red-700 border-red-200', icon: FileText };
    case 'PNG':
      return { label: 'PNG / Image', bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: FileImage };
    case 'WORD':
      return { label: 'Word (.docx)', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: FileCode };
    case 'EXCEL':
      return { label: 'Excel (.xlsx)', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: FileSpreadsheet };
    default:
      return { label: 'Document', bg: 'bg-gray-50 text-gray-700 border-gray-200', icon: FileText };
  }
}

interface Props {
  scheme: GovtSchemeItem | null;
}

export default function DocumentChecklist({ scheme }: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFileMeta>>({
    '7/12 Extract': {
      fileName: '7_12_Extract_Kosbad.pdf',
      fileSize: '1.8 MB',
      format: 'PDF',
      uploadedAt: 'Verified today',
    },
    '8-A Extract': {
      fileName: '8A_Holding_Extract.pdf',
      fileSize: '950 KB',
      format: 'PDF',
      uploadedAt: 'Verified today',
    },
    'Caste Certificate': {
      fileName: 'OBC_Certificate_2022.png',
      fileSize: '2.4 MB',
      format: 'PNG',
      uploadedAt: 'Uploaded',
    },
    'Income Certificate': {
      fileName: 'Income_Certificate_Tehsildar.docx',
      fileSize: '420 KB',
      format: 'WORD',
      uploadedAt: 'Uploaded',
    },
    'Domicile Certificate': {
      fileName: 'Maharashtra_Domicile.pdf',
      fileSize: '1.2 MB',
      format: 'PDF',
      uploadedAt: 'Verified today',
    },
  });

  const [activeDocForUpload, setActiveDocForUpload] = useState<string | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!scheme) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center text-center">
        <FileText className="w-10 h-10 text-gray-300 mb-3" />
        <p className="text-sm font-medium text-gray-600">Select a scheme</p>
        <p className="text-xs text-gray-400 mt-1">Document checklist will appear here</p>
      </div>
    );
  }

  const rawDocs = initialDocumentsByScheme[scheme.shortName] || initialDocumentsByScheme['default'];

  // Dynamically compute status considering uploaded files
  const docs = rawDocs.map((d) => {
    if (uploadedFiles[d.name]) {
      return {
        ...d,
        status: (d.status === 'missing' || d.status === 'expired' ? 'available' : d.status) as any,
      };
    }
    return d;
  });

  const counts = {
    verified: docs.filter((d) => d.status === 'verified').length,
    available: docs.filter((d) => d.status === 'available').length,
    missing: docs.filter((d) => d.status === 'missing').length,
    expired: docs.filter((d) => d.status === 'expired').length,
  };
  const ready = counts.verified + counts.available;
  const total = docs.length;
  const readyPct = Math.round((ready / total) * 100);

  const handleTriggerUpload = (docName: string) => {
    setActiveDocForUpload(docName);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeDocForUpload) return;

    const format = detectFileFormat(file.name);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const sizeDisplay = file.size > 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(file.size / 1024)} KB`;

    setUploadedFiles((prev) => ({
      ...prev,
      [activeDocForUpload]: {
        fileName: file.name,
        fileSize: sizeDisplay,
        format,
        uploadedAt: 'Just now',
      },
    }));

    setUploadNotice(`✓ "${file.name}" uploaded successfully for ${activeDocForUpload} (${format})`);
    setTimeout(() => setUploadNotice(null), 4000);
    setActiveDocForUpload(null);
  };

  const handleRemoveFile = (docName: string) => {
    setUploadedFiles((prev) => {
      const copy = { ...prev };
      delete copy[docName];
      return copy;
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Hidden Universal File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,application/pdf,image/png,image/jpeg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="hidden"
      />

      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-[#FCFDFC]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-bold text-gray-900">Document Checklist</h3>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${readyPct >= 80 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
            {ready}/{total} Documents Ready ({readyPct}%)
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-3 line-clamp-1">{scheme.name}</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${readyPct}%`, background: readyPct >= 80 ? '#10b981' : '#f59e0b' }}
          />
        </div>

        {/* Supported Formats Banner */}
        <div className="mt-3 p-2 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-between text-[11px] text-[#166534]">
          <span className="font-semibold flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-[#16A34A]" /> Supported Upload Formats:
          </span>
          <div className="flex items-center gap-1 font-bold text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-white border border-[#BBF7D0] text-red-700">PDF</span>
            <span className="px-1.5 py-0.5 rounded bg-white border border-[#BBF7D0] text-purple-700">PNG</span>
            <span className="px-1.5 py-0.5 rounded bg-white border border-[#BBF7D0] text-blue-700">WORD</span>
            <span className="px-1.5 py-0.5 rounded bg-white border border-[#BBF7D0] text-emerald-700">EXCEL</span>
          </div>
        </div>

        {/* Upload Success Notice */}
        {uploadNotice && (
          <div className="mt-2.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{uploadNotice}</span>
          </div>
        )}
      </div>

      {/* Document List */}
      <div className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
        {docs.map((doc, i) => {
          const cfg = statusConfig[doc.status as keyof typeof statusConfig] || statusConfig.available;
          const StatusIcon = cfg.icon;
          const attachedFile = uploadedFiles[doc.name];
          const formatBadge = attachedFile ? getFormatBadgeConfig(attachedFile.format) : null;
          const FormatIcon = formatBadge?.icon || FileText;

          return (
            <div key={i} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/70 transition-colors">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <StatusIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs sm:text-sm text-gray-900 font-semibold truncate">{doc.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    {formatBadge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${formatBadge.bg}`}>
                        <FormatIcon className="w-3 h-3" />
                        {formatBadge.label}
                      </span>
                    )}
                  </div>

                  {attachedFile ? (
                    <div className="text-[11px] text-[#166534] mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="font-medium text-gray-700">File: {attachedFile.fileName}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{attachedFile.fileSize}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-[#16A34A]">{attachedFile.uploadedAt}</span>
                    </div>
                  ) : doc.note ? (
                    <p className="text-xs text-gray-500 mt-0.5">{doc.note}</p>
                  ) : null}
                </div>
              </div>

              {/* Action Buttons: Upload all files (PDF, PNG, WORD, EXCEL) */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {attachedFile && (
                  <button
                    onClick={() => handleRemoveFile(doc.name)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove attached file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleTriggerUpload(doc.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                    attachedFile
                      ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                      : doc.status === 'missing' || doc.status === 'expired'
                      ? 'bg-[#166534] text-white hover:bg-[#14532D]'
                      : 'bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] hover:bg-[#DCFCE7]'
                  }`}
                  title="Upload PDF, PNG, Word or Excel file"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{attachedFile ? 'Replace File' : 'Upload File'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Helper */}
      <div className="p-3.5 bg-[#F9FAFB] border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-[#16A34A]" />
          <span>Upload files directly: <strong>PDF, PNG, Word (.doc/.docx), Excel (.xls/.xlsx)</strong>.</span>
        </div>
        <button
          type="button"
          onClick={() => handleTriggerUpload('General Scheme Document')}
          className="text-xs font-bold text-[#166534] hover:underline self-start sm:self-auto flex items-center gap-1"
        >
          <Upload className="w-3.5 h-3.5" /> Upload Additional File
        </button>
      </div>
    </div>
  );
}
