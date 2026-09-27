'use client';

import React, { useState } from 'react';
import { Plant, PlantPhoto } from '@/data/types';
import { X, ChevronLeft, ChevronRight, Camera, Calendar, Tag, Bot, AlertTriangle, User, Eye } from 'lucide-react';

interface PlantPhotoGalleryModalProps {
  plant: Plant;
  isOpen: boolean;
  onClose: () => void;
}

export function PlantPhotoGalleryModal({ plant, isOpen, onClose }: PlantPhotoGalleryModalProps) {
  const photos = plant.photos || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  const currentPhoto: PlantPhoto | undefined = photos[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= photos.length - 1 ? 0 : prev + 1));
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Agribot inspection':
        return <Bot className="w-3.5 h-3.5 text-[#16A34A]" />;
      case 'Disease detection':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />;
      case 'Manual farmer upload':
        return <User className="w-3.5 h-3.5 text-[#3B82F6]" />;
      default:
        return <Eye className="w-3.5 h-3.5 text-[#7C3AED]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-[#E5E7EB] bg-[#F7F9F7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#166534]">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-[#111827]">
                Plant Photo Archive: #{plant.id}
              </h3>
              <p className="text-[11px] text-[#6B7280]">
                {plant.cropName} ({plant.variety}) • {photos.length} captured observations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#9CA3AF] hover:text-[#111827] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {photos.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6B7280] space-y-2">
            <Camera className="w-10 h-10 text-[#9CA3AF] mx-auto opacity-50" />
            <p className="font-semibold text-sm text-[#374151]">No plant photos available yet.</p>
            <p className="text-[11px]">AgroBot missions and scouting will automatically upload images here.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col p-4 md:p-6 gap-4">
            {/* Main Stage Image Viewer */}
            <div className="relative w-full aspect-video md:aspect-2/1 max-h-[380px] rounded-xl overflow-hidden bg-black/5 border border-[#E5E7EB] flex items-center justify-center group">
              <img
                src={currentPhoto?.url || plant.imageUrl}
                alt={currentPhoto?.caption || 'Plant photo'}
                className="w-full h-full object-contain"
              />

              {/* Prev / Next Floating Arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md border border-[#E5E7EB] text-[#111827] flex items-center justify-center transition-all cursor-pointer"
                    title="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md border border-[#E5E7EB] text-[#111827] flex items-center justify-center transition-all cursor-pointer"
                    title="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Photo Counter Pill */}
              <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded-full">
                {currentIndex + 1} of {photos.length}
              </div>
            </div>

            {/* Photo Metadata Bar */}
            <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-[#111827] text-sm block">
                  {currentPhoto?.caption || 'Plant Observation'}
                </span>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#6B7280]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    {currentPhoto?.date}
                  </span>
                  <span>•</span>
                  <span className="capitalize font-medium text-[#374151]">
                    Event: {currentPhoto?.eventType?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Source Tag Badge */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-white border border-[#E5E7EB] text-[11px] font-semibold text-[#111827] flex items-center gap-1.5 shadow-xs">
                  {getSourceIcon(currentPhoto?.source || '')}
                  <span>{currentPhoto?.source}</span>
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                {photos.map((item, idx) => (
                  <button
                    key={item.id || idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-18 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      currentIndex === idx
                        ? 'border-[#16A34A] ring-2 ring-[#DCFCE7]'
                        : 'border-[#E5E7EB] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
