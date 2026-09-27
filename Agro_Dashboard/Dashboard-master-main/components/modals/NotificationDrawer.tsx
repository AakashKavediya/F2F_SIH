'use client';

import React, { useState } from 'react';
import { Bell, X, AlertTriangle, AlertCircle, Info, CheckCircle2, ChevronRight } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function NotificationDrawer() {
  const { isNotificationDrawerOpen, setIsNotificationDrawerOpen, alerts, acknowledgeAlert } = useFarm();
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Warning' | 'Information'>('All');

  if (!isNotificationDrawerOpen) return null;

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'All') return true;
    return a.severity === filter;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <AlertCircle className="w-4 h-4 text-[#EF4444]" />;
      case 'Warning':
        return <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />;
      default:
        return <Info className="w-4 h-4 text-[#3B82F6]" />;
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-50 text-[#EF4444] border-red-200';
      case 'Warning':
        return 'bg-amber-50 text-[#F59E0B] border-amber-200';
      default:
        return 'bg-blue-50 text-[#3B82F6] border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-[2px] flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E5E7EB] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F7F9F7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#111827]">Farm Notifications</h3>
              <p className="text-[11px] text-[#6B7280]">Real-time telemetry and hazard alerts</p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="p-1.5 rounded-xl text-[#9CA3AF] hover:text-[#111827] hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3 border-b border-[#E5E7EB] flex gap-1.5 bg-[#FCFDFC]">
          {(['All', 'Critical', 'Warning', 'Information'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === tab
                  ? 'bg-[#16A34A] text-white shadow-xs font-semibold'
                  : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#9CA3AF]">
              No notifications matching &quot;{filter}&quot;.
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#16A34A]/40 transition-all shadow-subtle space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(alert.severity)}
                    <span
                      className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getSeverityBadgeClass(
                        alert.severity
                      )}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-[#9CA3AF]">•</span>
                    <span className="text-[10px] font-medium text-[#6B7280]">{alert.category}</span>
                  </div>
                  <span className="text-[10px] text-[#9CA3AF]">{alert.timestamp}</span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#111827]">{alert.title}</h4>
                  <p className="text-[11px] text-[#6B7280] mt-1 leading-relaxed">{alert.description}</p>
                </div>

                {alert.actionPrompt && (
                  <div className="p-2 rounded-lg bg-[#F7F9F7] text-[11px] text-[#166534] font-medium flex items-center justify-between">
                    <span>{alert.actionPrompt}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-semibold text-[#9CA3AF]">ID: {alert.id}</span>
                  {alert.status === 'Active' ? (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-[11px] font-semibold text-[#16A34A] hover:text-[#15803D] hover:underline"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#166534]">
                      <CheckCircle2 className="w-3 h-3" /> Acknowledged
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
