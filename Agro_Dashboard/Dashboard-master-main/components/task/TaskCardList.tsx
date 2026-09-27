'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot,
  User,
  Clock,
  MapPin,
  Play,
  Pause,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Check,
  X,
  Gauge,
  BatteryCharging,
  ShieldCheck,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { TaskItem } from '@/data/types';

interface TaskTelemetry {
  progress: number;
  elapsedSeconds: number;
  isPaused: boolean;
  speed: number;
  itemsProcessed: number;
  currentStep: string;
}

export function TaskCardList() {
  const { tasks, startTask, completeTask, rescheduleTask, openFieldPassportFor } = useFarm();
  const [filter, setFilter] = useState<'ALL' | 'FARMER' | 'ROBOT'>('ALL');

  // Active Real-Time Execution States for In-Progress Tasks
  const [runningStates, setRunningStates] = useState<Record<string, TaskTelemetry>>({});

  // Reschedule Modal State
  const [reschedulingTask, setReschedulingTask] = useState<TaskItem | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleTime, setRescheduleTime] = useState<string>('07:30');
  const [rescheduleReason, setRescheduleReason] = useState<string>('Weather Agromet Window');
  const [rescheduledNotification, setRescheduledNotification] = useState<string | null>(null);

  // Filter tasks based on selected tab
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'ALL') return true;
    return t.category === filter;
  });

  // Initialize or maintain running state for In-Progress tasks
  useEffect(() => {
    tasks.forEach((task) => {
      if (task.status === 'In Progress' && !runningStates[task.id]) {
        setRunningStates((prev) => ({
          ...prev,
          [task.id]: {
            progress: 18,
            elapsedSeconds: 12,
            isPaused: false,
            speed: 1.1,
            itemsProcessed: 14,
            currentStep: 'Initialising RTK-GPS waypoint navigation & sensor payload...',
          },
        }));
      }
    });
  }, [tasks]);

  // Real-time ticking engine for all active tasks
  useEffect(() => {
    const interval = setInterval(() => {
      setRunningStates((prev) => {
        let hasChanges = false;
        const next = { ...prev };

        Object.keys(next).forEach((taskId) => {
          const state = next[taskId];
          if (!state || state.isPaused || state.progress >= 100) return;

          hasChanges = true;
          const newElapsed = state.elapsedSeconds + 1;
          const increment = Math.floor(Math.random() * 3) + 2; // +2% to +4% per sec
          const newProgress = Math.min(100, state.progress + increment);
          const newProcessed = state.itemsProcessed + (Math.random() > 0.5 ? 1 : 0);
          const speedJitter = Number((1.05 + Math.random() * 0.1).toFixed(2));

          let stepText = state.currentStep;
          if (newProgress < 25) {
            stepText = 'Verifying RTK-GPS centimeter fix & crop row path...';
          } else if (newProgress < 55) {
            stepText = 'Autonomous navigation active across target canopy rows...';
          } else if (newProgress < 85) {
            stepText = 'Applying targeted intervention & logging multi-spectral telemetry...';
          } else if (newProgress < 100) {
            stepText = 'Finalizing zone coverage & verifying sensor handshake...';
          } else {
            stepText = 'Task complete! Telemetry recorded to Krishi Vigyan Kendra ledger.';
            // Automatically complete task in context
            setTimeout(() => {
              completeTask(taskId);
            }, 800);
          }

          next[taskId] = {
            ...state,
            elapsedSeconds: newElapsed,
            progress: newProgress,
            speed: speedJitter,
            itemsProcessed: newProcessed,
            currentStep: stepText,
          };
        });

        return hasChanges ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [completeTask]);

  // Handle Start Task
  const handleStartTask = (taskId: string) => {
    startTask(taskId);
    setRunningStates((prev) => ({
      ...prev,
      [taskId]: {
        progress: 8,
        elapsedSeconds: 0,
        isPaused: false,
        speed: 1.1,
        itemsProcessed: 2,
        currentStep: 'Starting execution: Calibrating sensors and route...',
      },
    }));
  };

  // Toggle Pause/Resume on a running task
  const handleTogglePause = (taskId: string) => {
    setRunningStates((prev) => {
      const current = prev[taskId];
      if (!current) return prev;
      return {
        ...prev,
        [taskId]: {
          ...current,
          isPaused: !current.isPaused,
        },
      };
    });
  };

  // Immediate Complete
  const handleCompleteNow = (taskId: string) => {
    setRunningStates((prev) => {
      const current = prev[taskId];
      if (!current) return prev;
      return {
        ...prev,
        [taskId]: {
          ...current,
          progress: 100,
          currentStep: 'Task marked as completed.',
        },
      };
    });
    completeTask(taskId);
  };

  // Open Reschedule Modal
  const openRescheduleModal = (task: TaskItem) => {
    setReschedulingTask(task);
    // Default to tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setRescheduleDate(dateStr);
    setRescheduleTime('07:30');
    setRescheduleReason('Weather Agromet Window');
  };

  // Confirm Reschedule
  const handleConfirmReschedule = () => {
    if (!reschedulingTask || !rescheduleDate) return;

    const dateObj = new Date(rescheduleDate);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    rescheduleTask(reschedulingTask.id, formattedDate, dayName, rescheduleTime);

    setRescheduledNotification(
      `✓ "${reschedulingTask.title}" rescheduled to ${dayName}, ${formattedDate} at ${rescheduleTime}`
    );
    setReschedulingTask(null);

    setTimeout(() => {
      setRescheduledNotification(null);
    }, 4500);
  };

  // Format Elapsed Seconds as mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}s`;
  };

  // Calculate day name for current input
  const getComputedDayName = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {rescheduledNotification && (
        <div className="p-3 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] text-xs font-semibold text-[#166534] flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span>{rescheduledNotification}</span>
          </div>
          <button
            onClick={() => setRescheduledNotification(null)}
            className="text-[#166534] hover:text-[#14532D]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter Tabs & Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-[#F9FAFB] p-1 rounded-xl border border-[#E5E7EB] text-xs">
          {(['ALL', 'FARMER', 'ROBOT'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                filter === tab
                  ? 'bg-white text-[#111827] shadow-xs border border-[#E5E7EB]'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              {tab === 'ALL'
                ? 'All Operations'
                : tab === 'FARMER'
                ? 'Farmer Actions'
                : 'Robot Missions'}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#6B7280]">
          Showing <strong>{filteredTasks.length}</strong> tasks
        </span>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((t) => {
          const runState = runningStates[t.id];
          const isRunning = t.status === 'In Progress' && runState;
          const isCompleted = t.status === 'Completed';

          return (
            <div
              key={t.id}
              className={`p-5 rounded-2xl bg-white border shadow-subtle transition-all flex flex-col justify-between space-y-4 ${
                isRunning
                  ? 'border-[#16A34A] ring-1 ring-[#16A34A]/20 bg-gradient-to-b from-[#F0FDF4]/30 to-white'
                  : 'border-[#E5E7EB] hover:border-[#16A34A]/40'
              }`}
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        t.priority === 'HIGH'
                          ? 'bg-red-50 text-[#EF4444] border-red-200'
                          : t.priority === 'MEDIUM'
                          ? 'bg-amber-50 text-[#F59E0B] border-amber-200'
                          : 'bg-blue-50 text-[#3B82F6] border-blue-200'
                      }`}
                    >
                      {t.priority} Priority
                    </span>
                    <span className="text-[10px] font-semibold text-[#6B7280] bg-[#F9FAFB] px-2 py-0.5 rounded border border-[#E5E7EB]">
                      {t.category === 'ROBOT' ? '🤖 Robot Mission' : '🧑‍🌾 Farmer Task'} • {t.type}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                      isCompleted
                        ? 'bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]'
                        : isRunning
                        ? 'bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]'
                        : 'bg-gray-100 text-[#4B5563] border border-[#E5E7EB]'
                    }`}
                  >
                    {isRunning && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                    )}
                    {isCompleted ? '✓ Completed' : isRunning ? 'In Progress' : t.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#111827] mt-2.5">{t.title}</h3>
                <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">{t.reason}</p>
              </div>

              {/* Rescheduled Pill Badge (if rescheduled) */}
              {t.scheduledDate && (
                <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-[#92400E] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                    <span className="font-semibold">
                      Rescheduled: {t.scheduledDay}, {t.scheduledDate} @ {t.scheduledTime}
                    </span>
                  </div>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded font-bold border border-amber-200 text-[#B45309]">
                    Confirmed
                  </span>
                </div>
              )}

              {/* REAL-TIME RUNNING TELEMETRY CONSOLE (Revealed when task is running) */}
              {isRunning && (
                <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-3 animate-fade-in">
                  {/* Progress Header */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#166534] flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#16A34A] animate-spin" />
                      {runState.isPaused ? 'Mission Paused' : 'Live Execution Active'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#166534] bg-white px-2 py-0.5 rounded border border-[#BBF7D0]">
                        Elapsed: {formatTime(runState.elapsedSeconds)}
                      </span>
                      <span className="text-xs font-extrabold text-[#166534] font-mono">
                        {runState.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-[#DCFCE7] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#16A34A] transition-all duration-500 ease-out"
                      style={{ width: `${runState.progress}%` }}
                    />
                  </div>

                  {/* Real-time Telemetry Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-1.5 rounded-lg bg-white border border-[#DCFCE7]">
                      <span className="text-[10px] text-[#6B7280]">Speed</span>
                      <p className="font-bold text-[#111827]">{runState.speed} m/s</p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white border border-[#DCFCE7]">
                      <span className="text-[10px] text-[#6B7280]">Treated Units</span>
                      <p className="font-bold text-[#111827]">{runState.itemsProcessed} plants</p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white border border-[#DCFCE7]">
                      <span className="text-[10px] text-[#6B7280]">Status</span>
                      <p className="font-bold text-[#166534]">
                        {runState.isPaused ? 'Paused' : 'Active'}
                      </p>
                    </div>
                  </div>

                  {/* Live Step Ticker */}
                  <div className="text-[11px] text-[#166534] bg-white/80 p-2 rounded-lg border border-[#DCFCE7] flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" />
                    <span className="truncate">{runState.currentStep}</span>
                  </div>

                  {/* In-Flight Quick Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleTogglePause(t.id)}
                      className="px-2.5 py-1 rounded-lg border border-[#BBF7D0] bg-white text-xs font-semibold text-[#166534] hover:bg-[#F0FDF4] flex items-center gap-1 transition-colors"
                    >
                      {runState.isPaused ? (
                        <>
                          <Play className="w-3 h-3 text-[#16A34A]" />
                          <span>Resume</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3 h-3 text-[#D97706]" />
                          <span>Pause</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCompleteNow(t.id)}
                      className="px-2.5 py-1 rounded-lg bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3 h-3" />
                      <span>Complete Now</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Metadata Info (When not running) */}
              {!isRunning && (
                <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-[#6B7280]">Assigned To</span>
                    <p className="font-semibold text-[#111827] mt-0.5 truncate">{t.assignedTo}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7280]">Target Area</span>
                    <p className="font-semibold text-[#111827] mt-0.5">{t.targetArea}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7280]">Est. Time</span>
                    <p className="font-semibold text-[#111827] mt-0.5">{t.estimatedTimeMins} mins</p>
                  </div>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between gap-2">
                <button
                  onClick={() => openFieldPassportFor(t.fieldId)}
                  className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] hover:bg-[#F9FAFB] text-xs font-semibold text-[#111827] flex items-center gap-1 transition-colors"
                >
                  <span>View Field</span>
                  <ExternalLink className="w-3 h-3 text-[#6B7280]" />
                </button>

                <div className="flex items-center gap-2">
                  {/* Reschedule Button */}
                  <button
                    onClick={() => openRescheduleModal(t)}
                    className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] hover:bg-[#F9FAFB] text-xs font-semibold text-[#4B5563] flex items-center gap-1 transition-colors"
                  >
                    <Calendar className="w-3 h-3 text-[#6B7280]" />
                    <span>Reschedule</span>
                  </button>

                  {/* Start / Running / Completed Button */}
                  {!isCompleted ? (
                    <button
                      onClick={() => (isRunning ? handleTogglePause(t.id) : handleStartTask(t.id))}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors ${
                        isRunning
                          ? 'bg-[#059669] hover:bg-[#047857] text-white'
                          : 'bg-[#16A34A] hover:bg-[#15803D] text-white'
                      }`}
                    >
                      {isRunning ? (
                        <>
                          <Activity className="w-3 h-3 animate-pulse" />
                          <span>Running ({runState?.progress || 0}%)</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          <span>Start Task</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-[#DCFCE7] text-[#166534] text-xs font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>Completed</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RESCHEDULE MODAL (DATE, DAY & TIME PICKER) */}
      {reschedulingTask && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl max-w-md w-full p-5 space-y-4 text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#111827]">Reschedule Task</h3>
                  <span className="text-[11px] text-[#6B7280]">{reschedulingTask.title}</span>
                </div>
              </div>
              <button
                onClick={() => setReschedulingTask(null)}
                className="w-7 h-7 rounded-lg hover:bg-[#F3F4F6] flex items-center justify-center text-[#6B7280]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Date Selection & Day Indicator */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#374151] uppercase tracking-wider block">
                Select Date & Day
              </label>
              <input
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] font-semibold text-xs focus:outline-none focus:border-[#16A34A]"
              />

              {/* Computed Day & Date Display */}
              {rescheduleDate && (
                <div className="text-[11px] text-[#166534] font-semibold bg-[#DCFCE7]/60 px-2.5 py-1 rounded-lg border border-[#86EFAC]/60 flex items-center gap-1.5">
                  <Check className="w-3 h-3" />
                  <span>Selected: {getComputedDayName(rescheduleDate)}</span>
                </div>
              )}

              {/* Quick Date Presets */}
              <div className="flex items-center gap-1.5 pt-1">
                {[
                  { label: 'Today', daysOffset: 0 },
                  { label: 'Tomorrow', daysOffset: 1 },
                  { label: '+2 Days', daysOffset: 2 },
                  { label: 'Next Monday', daysOffset: 3 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + preset.daysOffset);
                      setRescheduleDate(d.toISOString().split('T')[0]);
                    }}
                    className="px-2 py-0.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[10px] font-medium text-[#4B5563]"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Time Selection & Agromet Shifts */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#374151] uppercase tracking-wider block">
                Select Time Window
              </label>
              <input
                type="time"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] font-semibold text-xs focus:outline-none focus:border-[#16A34A]"
              />

              {/* Recommended Agromet Slots */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {[
                  { time: '07:30', label: '07:30 AM', note: 'Morning Cool' },
                  { time: '11:00', label: '11:00 AM', note: 'Midday Solar' },
                  { time: '16:30', label: '04:30 PM', note: 'Low Wind' },
                ].map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => setRescheduleTime(slot.time)}
                    className={`p-1.5 rounded-lg text-left border transition-all ${
                      rescheduleTime === slot.time
                        ? 'bg-[#DCFCE7] border-[#16A34A] text-[#166534]'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6]'
                    }`}
                  >
                    <div className="font-bold text-[11px]">{slot.label}</div>
                    <div className="text-[9px] opacity-75">{slot.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Reason Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#374151] uppercase tracking-wider block">
                Reason for Rescheduling
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  'Weather Agromet Window',
                  'Soil Moisture Too Wet',
                  'AgroBot Recharging',
                  'Agronomist Shift',
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setRescheduleReason(reason)}
                    className={`p-1.5 rounded-lg text-left border transition-all text-[10px] ${
                      rescheduleReason === reason
                        ? 'bg-[#111827] text-white border-[#111827] font-bold'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6]'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#166534] font-bold uppercase tracking-wider block">
                  New Scheduled Window
                </span>
                <span className="text-xs font-bold text-[#111827] mt-0.5 block">
                  {getComputedDayName(rescheduleDate)} at {rescheduleTime}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-[#166534] bg-white px-2 py-1 rounded-md border border-[#BBF7D0]">
                Optimal Window
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F3F4F6]">
              <button
                onClick={() => setReschedulingTask(null)}
                className="px-3.5 py-1.5 rounded-xl border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F9FAFB] text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-4 py-1.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs transition-colors"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
