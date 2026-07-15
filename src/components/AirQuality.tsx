import { AirQuality as AQIType } from '../types';
import { getAQIDetails } from '../utils/weatherUtils';
import { motion } from 'motion/react';
import { ShieldCheck, AlertCircle, Wind } from 'lucide-react';

interface AirQualityProps {
  data: AQIType;
}

export function AirQuality({ data }: AirQualityProps) {
  // Compute AQI score and descriptions
  const details = getAQIDetails(data.pm2_5);

  // Helper to render relative horizontal safety bars (0-100% of maximum typical standard values)
  const renderProgress = (val: number, maxStandard: number, colorClass: string) => {
    const percent = Math.min((val / maxStandard) * 100, 100);
    return (
      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800/80 overflow-hidden mt-1">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${colorClass}`}
        />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-[32px] bg-gradient-to-br from-white/40 to-slate-50/10 dark:from-slate-900/40 dark:to-slate-950/40 border border-slate-200 dark:border-slate-800 backdrop-blur-xl p-6 shadow-xl space-y-6"
    >
      {/* Title Header */}
      <div className="flex items-center gap-2">
        <Wind className="text-indigo-500" size={18} />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Air Quality Index (AQI)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Side: Large visual circular dial */}
        <div className="md:col-span-5 flex flex-col items-center text-center p-4 rounded-2xl bg-white/5 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/50">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Ambient Background Radial Glow */}
            <div className={`absolute inset-2 rounded-full blur-xl opacity-35 ${details.colorClass.replace('text-', 'bg-')}`} />
            
            {/* SVG Arc Path representing the gauge */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="6"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                className={`stroke-current ${details.colorClass}`}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="263.8"
                initial={{ strokeDashoffset: 263.8 }}
                whileInView={{ strokeDashoffset: 263.8 - (263.8 * Math.min(details.score, 300)) / 300 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>

            {/* Central Score Text */}
            <div className="flex flex-col items-center justify-center z-10">
              <span className="text-3xl font-black text-slate-950 dark:text-white leading-none tracking-tighter">
                {details.score}
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 mt-1">
                US AQI
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <h4 className={`text-base font-black ${details.colorClass}`}>
              {details.label}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium px-2">
              {details.description}
            </p>
          </div>
        </div>

        {/* Right Side: Detailed PM Breakdown Bars */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* PM2.5 Card */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400">PM2.5 (Fine Particles)</span>
              <span className="font-black text-slate-800 dark:text-slate-200">{data.pm2_5.toFixed(1)} ug/m³</span>
            </div>
            {renderProgress(data.pm2_5, 35.4, 'bg-emerald-500')}
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Target: &lt; 12.0 ug/m³</div>
          </div>

          {/* PM10 Card */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400">PM10 (Inhalable Particles)</span>
              <span className="font-black text-slate-800 dark:text-slate-200">{data.pm10.toFixed(1)} ug/m³</span>
            </div>
            {renderProgress(data.pm10, 150, 'bg-teal-500')}
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Target: &lt; 54.0 ug/m³</div>
          </div>

          {/* NO2 Card */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400">Nitrogen Dioxide (NO₂)</span>
              <span className="font-black text-slate-800 dark:text-slate-200">{data.no2.toFixed(1)} ug/m³</span>
            </div>
            {renderProgress(data.no2, 100, 'bg-sky-500')}
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Target: &lt; 40.0 ug/m³</div>
          </div>

          {/* SO2 Card */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400">Sulphur Dioxide (SO₂)</span>
              <span className="font-black text-slate-800 dark:text-slate-200">{data.so2.toFixed(1)} ug/m³</span>
            </div>
            {renderProgress(data.so2, 20, 'bg-amber-500')}
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Target: &lt; 10.0 ug/m³</div>
          </div>
        </div>
      </div>

      {/* Safety Alert Box */}
      <div className={`p-4 rounded-2xl flex items-start gap-3 border ${details.borderColorClass} ${details.bgClass}`}>
        {details.score <= 100 ? (
          <ShieldCheck className={`flex-shrink-0 mt-0.5 ${details.colorClass}`} size={18} />
        ) : (
          <AlertCircle className={`flex-shrink-0 mt-0.5 ${details.colorClass}`} size={18} />
        )}
        <div>
          <h5 className={`text-xs font-bold uppercase tracking-wider ${details.colorClass}`}>
            Health Advice
          </h5>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-0.5">
            {details.score <= 50 
              ? 'Excellent air quality! Perfect conditions for running, cycling, or other intensive outdoor activities.' 
              : details.score <= 100 
              ? 'Air quality is fair. Very sensitive individuals should consider cutting down on extremely long outdoor exercises.' 
              : 'Caution is advised. It is highly recommended to close windows, use indoor air filters, and avoid strenuous activities outdoors.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
