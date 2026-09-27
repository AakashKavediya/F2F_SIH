'use client';

import React from 'react';
import { useFarm } from '@/context/FarmContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, dismissToast } = useFarm();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isWarning = toast.type === 'warning';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg border text-xs font-medium animate-in slide-in-from-bottom-3 duration-200 transition-all ${
              isSuccess
                ? 'bg-white text-[#111827] border-[#DCFCE7] shadow-[#16A34A]/10'
                : isWarning
                ? 'bg-white text-[#111827] border-amber-200 shadow-amber-500/10'
                : 'bg-white text-[#111827] border-blue-200 shadow-blue-500/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && (
                <div className="w-6 h-6 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                </div>
              )}
              {isWarning && (
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                </div>
              )}
              {isInfo && (
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4 text-[#2563EB]" />
                </div>
              )}
              <span className="leading-snug">{toast.message}</span>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
