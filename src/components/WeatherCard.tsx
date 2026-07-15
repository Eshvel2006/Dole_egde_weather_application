import React, { useEffect, useState } from 'react';
import { WeatherData } from '../types';
import { getWeatherCondition, formatDate } from '../utils/weatherUtils';
import { AnimatedWeatherIcon } from './AnimatedWeatherIcon';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, Thermometer, Image as ImageIcon, Upload, RotateCcw, SlidersHorizontal, Sparkles, X } from 'lucide-react';
// @ts-ignore
import premiumCollage from '../assets/images/premium_weather_collage_1784112707517.jpg';

interface WeatherCardProps {
  data: WeatherData;
  customBgUrl: string | null;
  bgBlur: number;
  bgBrightness: number;
  onUploadBg: (url: string | null) => void;
  onUpdateBlur: (blur: number) => void;
  onUpdateBrightness: (brightness: number) => void;
}

export function WeatherCard({ 
  data,
  customBgUrl,
  bgBlur,
  bgBrightness,
  onUploadBg,
  onUpdateBlur,
  onUpdateBrightness
}: WeatherCardProps) {
  const { current, city, country } = data;
  const condition = getWeatherCondition(current.weatherCode, current.isDay);

  // Maintain local ticking clock for a premium dashboard feel
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [showWallpaperEditor, setShowWallpaperEditor] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatLocalClock = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, etc.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      onUploadBg(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const loadPresetCollage = () => {
    onUploadBg(premiumCollage);
  };

  const handleReset = () => {
    onUploadBg(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-50/50 via-white/50 to-slate-100/40 dark:from-indigo-950/30 dark:via-slate-900/30 dark:to-slate-950/40 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-2xl p-6 md:p-8 flex flex-col justify-between min-h-[340px] group"
    >
      {/* Decorative mesh orbs */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Header: Location & Time */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide text-xs uppercase">
            <MapPin size={14} className="animate-pulse" />
            <span>Current Location</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1.5">
            {city}
            {country && (
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                , {country}
              </span>
            )}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-1 font-medium">
            <span className="flex items-center gap-1">
              <Calendar size={13} className="text-indigo-500" />
              {formatDate(current.time)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-indigo-500" />
              Local Time: {formatLocalClock(currentTime)}
            </span>
          </div>
        </div>

        {/* Dynamic Condition Pill & Wallpaper Customizer Button */}
        <div className="flex flex-wrap items-center gap-2 md:self-start">
          <div className="px-3 py-1.5 rounded-full bg-white/20 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 backdrop-blur-md text-xs font-bold tracking-wide text-slate-800 dark:text-indigo-200 shadow-sm flex items-center gap-2 select-none">
            <span className={`w-2 h-2 rounded-full bg-indigo-500 animate-ping`} />
            {condition.label}
          </div>

          <button
            onClick={() => setShowWallpaperEditor(!showWallpaperEditor)}
            className={`px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all duration-300 flex items-center gap-1.5 select-none ${
              showWallpaperEditor || customBgUrl
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700'
                : 'bg-white/10 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-indigo-200 hover:bg-white/20 dark:hover:bg-slate-800/80 shadow-sm'
            }`}
          >
            <ImageIcon size={13} className={customBgUrl ? 'animate-pulse' : ''} />
            <span>{customBgUrl ? 'Wallpaper Settings' : 'Upload Wallpaper'}</span>
          </button>
        </div>
      </div>

      {/* Expanded Wallpaper Config Panel */}
      <AnimatePresence>
        {showWallpaperEditor && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden z-20"
          >
            <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-950/85 border border-slate-200 dark:border-slate-800/90 backdrop-blur-xl shadow-inner space-y-4 text-slate-800 dark:text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/60 pb-2">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={15} className="text-indigo-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Background Customizer
                  </span>
                </div>
                <button 
                  onClick={() => setShowWallpaperEditor(false)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left pane: File Picker & Drag-Drop area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 min-h-[110px] ${
                    isDragging 
                      ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10' 
                      : 'border-slate-300 dark:border-slate-800 hover:border-indigo-400 bg-slate-50/40 dark:bg-slate-900/20'
                  }`}
                  onClick={() => document.getElementById('bg-file-input')?.click()}
                >
                  <input
                    type="file"
                    id="bg-file-input"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Upload size={22} className="text-slate-400 dark:text-slate-500 mb-1.5 animate-bounce-slow" />
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Drag & Drop or Click to Upload
                  </p>
                  <p className="text-[9px] text-slate-400 mt-0.5">
                    Supports JPG, PNG, WEBP files
                  </p>
                </div>

                {/* Right pane: Adjustment sliders & Presets */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    {/* Blur Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        <span>Wallpaper Blur ({bgBlur}px)</span>
                        <span>{bgBlur === 0 ? 'Crisp' : 'Dreamy'}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={bgBlur}
                        onChange={(e) => onUpdateBlur(parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>

                    {/* Brightness Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        <span>Wallpaper Brightness ({bgBrightness}%)</span>
                        <span>{bgBrightness < 60 ? 'Muted' : bgBrightness > 100 ? 'Vivid' : 'Balanced'}</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="120"
                        value={bgBrightness}
                        onChange={(e) => onUpdateBrightness(parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Preset & Reset triggers */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={loadPresetCollage}
                      className="flex-1 px-3 py-1.5 text-[10px] font-extrabold tracking-wide uppercase bg-gradient-to-r from-violet-500/10 to-indigo-500/10 hover:from-violet-500/20 hover:to-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-lg transition-all flex items-center justify-center gap-1 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Sparkles size={11} />
                      <span>Load Collage Preset</span>
                    </button>

                    {customBgUrl && (
                      <button
                        onClick={handleReset}
                        className="px-3 py-1.5 text-[10px] font-extrabold tracking-wide uppercase bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg transition-all flex items-center gap-1 hover:text-rose-500 dark:hover:text-rose-400"
                        title="Reset to default background gradients"
                      >
                        <RotateCcw size={11} />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Temperature & Icon Segment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-6 md:my-8 z-10">
        <div className="flex items-center gap-6">
          <AnimatedWeatherIcon 
            code={current.weatherCode} 
            isDay={current.isDay} 
            size={110} 
            className="filter drop-shadow-2xl"
          />
          <div className="space-y-1">
            <div className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter flex items-start">
              {Math.round(current.temperature)}
              <span className="text-3xl md:text-4xl font-normal text-indigo-600 dark:text-indigo-400 mt-1">°C</span>
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Sky is {condition.label.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Quick Highlights info inside Hero Card */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/5 dark:bg-slate-950/25 border border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500">
              <Thermometer size={16} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Feels Like</div>
              <div className="text-sm font-black text-slate-800 dark:text-slate-100">{Math.round(current.apparentTemperature)}°C</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Rain chance</div>
              <div className="text-sm font-black text-slate-800 dark:text-slate-100">{Math.round(current.precipitation)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer sentence */}
      <div className="border-t border-white/15 dark:border-slate-800/40 pt-4 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap justify-between gap-2 font-medium z-10">
        <span>Latitude: {data.latitude.toFixed(4)}°N • Longitude: {data.longitude.toFixed(4)}°E</span>
        <span>Data cached via Open-Meteo API</span>
      </div>
    </motion.div>
  );
}
