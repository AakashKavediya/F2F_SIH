'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ExternalLink,
  CheckCircle,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

const samplePrompts = [
  'Why is Field C at risk?',
  'How is my farm today?',
  'How much water did I use this week?',
  'What did the robot detect?',
  'Which field needs attention?',
  'How much fertilizer did I use in Field D?',
];

export function FarmAiSheet() {
  const { isAiDrawerOpen, setIsAiDrawerOpen, chatMessages, sendAiQuery, farm, farmer, dataMode } = useFarm();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const farmerInitials = farmer.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase() || 'KVK';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!isAiDrawerOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendAiQuery(inputValue.trim());
    setInputValue('');
  };

  const handleChipClick = (prompt: string) => {
    sendAiQuery(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-[#E5E7EB] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F7F9F7]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] shadow-sm">
              <Sparkles className="w-5 h-5 text-[#16A34A]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-1.5">
                Farm AI Assistant
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DCFCE7] text-[#166534]">
                  {dataMode} ENGINE
                </span>
              </h3>
              <p className="text-[11px] text-[#6B7280]">Real-time farm data grounded reasoning</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiDrawerOpen(false)}
            className="p-1.5 rounded-xl text-[#9CA3AF] hover:text-[#111827] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Prompt Chips */}
        <div className="p-3 bg-[#FCFDFC] border-b border-[#E5E7EB] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
          {samplePrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleChipClick(prompt)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white border border-[#E5E7EB] text-[#374151] hover:border-[#16A34A] hover:text-[#16A34A] transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#16A34A] text-white font-medium rounded-tr-sm shadow-sm'
                    : 'bg-[#F7F9F7] text-[#111827] border border-[#E5E7EB] rounded-tl-sm'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Sources & Action footer for assistant */}
                {msg.sender === 'assistant' && (
                  <div className="mt-3 pt-2.5 border-t border-[#E5E7EB]/80 space-y-2">
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 text-[10px] text-[#6B7280]">
                        <span className="font-semibold text-[#4B5563]">Data Sources:</span>
                        {msg.sources.map((s) => (
                          <span
                            key={s}
                            className="bg-white border border-[#E5E7EB] px-1.5 py-0.5 rounded text-[#4B5563]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {msg.suggestedAction && (
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#166534] bg-[#DCFCE7]/60 px-2 py-1 rounded-md">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Action: {msg.suggestedAction}</span>
                      </div>
                    )}
                    <div className="text-[10px] text-[#9CA3AF] text-right">{msg.timestamp}</div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-[#166534] text-white flex items-center justify-center shrink-0 mt-1 text-[10px] font-bold">
                  {farmerInitials}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-[#E5E7EB] bg-white flex items-center gap-2">
          <input
            type="text"
            placeholder={`Ask anything about ${farm.name}...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-[#F7F9F7] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#16A34A]"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-2 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
