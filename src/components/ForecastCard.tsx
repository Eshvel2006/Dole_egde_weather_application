import { DailyForecastItem } from '../types';
import { getWeatherCondition, formatDate } from '../utils/weatherUtils';
import { AnimatedWeatherIcon } from './AnimatedWeatherIcon';
import { motion } from 'motion/react';
import { Droplet, Wind } from 'lucide-react';

interface ForecastCardProps {
  item: DailyForecastItem;
  isToday: boolean;
  minTempBound: number; // overall minimum across all forecast days to bound the visual bar
  maxTempBound: number; // overall maximum across all forecast days to bound the visual bar
  key?: string | number;
}

export function ForecastCard({ item, isToday, minTempBound, maxTempBound }: ForecastCardProps) {
  const condition = getWeatherCondition(item.weatherCode, true);

  // Parse day name
  const getDayName = (dateStr: string) => {
    if (isToday) return 'Today';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Calculate percentages for Apple-Weather style temp bar
  const totalRange = maxTempBound - minTempBound;
  const leftPercent = totalRange > 0 ? ((item.tempMin - minTempBound) / totalRange) * 100 : 0;
  const widthPercent = totalRange > 0 ? ((item.tempMax - item.tempMin) / totalRange) * 100 : 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center justify-between gap-4 py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 dark:bg-slate-950/15 dark:hover:bg-slate-950/25 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm transition-all group"
    >
      {/* Day label */}
      <div className="w-16 flex-shrink-0">
        <div className={`text-sm font-bold tracking-tight ${isToday ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-800 dark:text-slate-200'}`}>
          {getDayName(item.date)}
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
          {formatDate(item.date).split(',')[1]?.trim() || item.date}
        </div>
      </div>

      {/* Icon + Condition Label */}
      <div className="flex items-center gap-2.5 w-28 flex-shrink-0">
        <AnimatedWeatherIcon code={item.weatherCode} size={26} className="group-hover:scale-110 transition-transform" />
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
          {condition.label}
        </div>
      </div>

      {/* Min Temp Label */}
      <div className="w-8 text-right text-xs font-bold text-slate-500 dark:text-slate-400">
        {Math.round(item.tempMin)}°
      </div>

      {/* Interactive Range Bar (Apple Weather style!) */}
      <div className="flex-grow h-2 rounded-full bg-slate-200 dark:bg-slate-800/80 relative overflow-hidden hidden sm:block min-w-[70px]">
        <div
          className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-amber-400 shadow-sm"
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
          }}
        />
      </div>

      {/* Max Temp Label */}
      <div className="w-8 text-right text-xs font-black text-slate-800 dark:text-white">
        {Math.round(item.tempMax)}°
      </div>

      {/* Auxiliary indicators (e.g. Rain sum, Wind max) */}
      <div className="w-16 flex items-center justify-end gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-semibold flex-shrink-0">
        {item.precipitationSum > 0 ? (
          <span className="flex items-center gap-0.5 text-sky-500">
            <Droplet size={11} className="fill-current" />
            {item.precipitationSum.toFixed(1)}m
          </span>
        ) : (
          <span className="flex items-center gap-0.5 text-slate-400/80">
            <Wind size={11} />
            {Math.round(item.windSpeedMax)}k
          </span>
        )}
      </div>
    </motion.div>
  );
}
