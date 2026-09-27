'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2, CheckCircle } from 'lucide-react';

type ExportState = 'idle' | 'loading' | 'done';

export default function ExportButtons() {
  const [excelState, setExcelState] = useState<ExportState>('idle');
  const [pdfState, setPdfState] = useState<ExportState>('loading');

  const handleExcel = async () => {
    if (excelState === 'loading') return;
    setExcelState('loading');
    try {
      const { exportFarmExcelReport } = await import('@/lib/exportExcel');
      await exportFarmExcelReport();
      setExcelState('done');
      setTimeout(() => setExcelState('idle'), 3000);
    } catch (err) {
      console.error('Excel export failed:', err);
      setExcelState('idle');
    }
  };

  const handlePdf = async () => {
    if (pdfState === 'loading') return;
    setPdfState('loading');
    try {
      const { exportFarmPdfReport } = await import('@/lib/exportPdf');
      await exportFarmPdfReport();
      setPdfState('done');
      setTimeout(() => setPdfState('idle'), 3000);
    } catch (err) {
      console.error('PDF export failed:', err);
      setPdfState('idle');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
          <Download className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">Export Reports</h3>
          <p className="text-xs text-gray-500">Download comprehensive farm analytics reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Excel Export */}
        <button
          onClick={handleExcel}
          disabled={excelState === 'loading'}
          className="group relative flex items-center gap-4 p-5 rounded-xl border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            {excelState === 'loading' ? (
              <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
            ) : excelState === 'done' ? (
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            ) : (
              <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">
              {excelState === 'done' ? 'Downloaded!' : excelState === 'loading' ? 'Generating…' : 'Export Excel'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">31 sheets · Crops, Irrigation, Robots, Schemes</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">.xlsx format</p>
          </div>
        </button>

        {/* PDF Export */}
        <button
          onClick={handlePdf}
          disabled={pdfState === 'loading'}
          className="group relative flex items-center gap-4 p-5 rounded-xl border-2 border-dashed border-red-200 hover:border-red-400 bg-red-50/50 hover:bg-red-50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            {pdfState === 'loading' ? (
              <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
            ) : pdfState === 'done' ? (
              <CheckCircle className="w-6 h-6 text-red-500" />
            ) : (
              <FileText className="w-6 h-6 text-red-500" />
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">
              {pdfState === 'done' ? 'Downloaded!' : pdfState === 'loading' ? 'Generating…' : 'Export PDF'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Executive report · Farm summary & analytics</p>
            <p className="text-xs text-red-500 font-medium mt-1">.pdf format</p>
          </div>
        </button>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-start gap-2">
        <Download className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-gray-500 leading-relaxed">
          Reports are generated client-side from live telemetry and agromet data. Excel includes 31 sheets covering all farm entities.
          PDF includes executive summary with charts for decision-making.
        </p>
      </div>
    </div>
  );
}
