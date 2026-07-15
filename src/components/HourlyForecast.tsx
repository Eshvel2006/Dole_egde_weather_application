import { HourlyForecastItem } from '../types';
import { getHourLabel, getWeatherCondition } from '../utils/weatherUtils';
import { AnimatedWeatherIcon } from './AnimatedWeatherIcon';
import { motion } from 'motion/react';
import { Compass, Droplet, Sun } from 'lucide-react';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  currentTimeStr: string;
}

export function HourlyForecast({ hourly, currentTimeStr }: HourlyForecastProps) {
  // Find current hour to highlight or default to first
  const currentHourNum = new Date(currentTimeStr).getHours();

  return (
    <div className="space-y-4">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full" />
          Hourly Forecast (24 Hours)
        </h3>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-widest hidden sm:inline">
          Scroll horizontally ➔
        </span>
      </div>

      {/* Horizontal List with hidden scrollbar */}
      <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {hourly.map((hour, idx) => {
          const hourDate = new Date(hour.time);
          const hourNum = hourDate.getHours();
          const isCurrentHour = hourNum === currentHourNum;
          const condition = getWeatherCondition(hour.weatherCode, hourNum >= 6 && hourNum < 20);

          return (
            <motion.div
              key={hour.time}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03, duration: 0.4 }}
              whileHover={{ y: -4, scale: 1.05 }}
              className={`flex-shrink-0 w-24 p-4 rounded-2xl flex flex-col items-center justify-between text-center border transition-all ${
                isCurrentHour
                  ? 'bg-indigo-500/15 dark:bg-indigo-500/20 border-indigo-500 dark:border-indigo-500 shadow-lg shadow-indigo-500/10'
                  : 'bg-white/10 dark:bg-slate-950/25 border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md'
              }`}
            >
              {/* Highlight Ring for Current Hour */}
              {isCurrentHour && (
                <span className="absolute -top-1.5 px-1.5 py-0.5 rounded-full bg-indigo-500 text-[8px] font-black uppercase text-white tracking-widest shadow-sm">
                  Now
                </span>
              )}

              {/* Time Label */}
              <span className={`text-[11px] font-bold ${isCurrentHour ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {idx === 0 && isCurrentHour ? 'Now' : getHourLabel(hour.time)}
              </span>

              {/* Weather Icon */}
              <div className="my-3">
                <AnimatedWeatherIcon
                  code={hour.weatherCode}
                  isDay={hourNum >= 6 && hourNum < 20}
                  size={28}
                  className="filter drop-shadow-md"
                />
              </div>

              {/* Temperature */}
              <div className="text-lg font-black text-slate-800 dark:text-white tracking-tight">
                {Math.round(hour.temperature)}°
              </div>

              {/* Metric Overlay: Humidity or UV index */}
              <div className="mt-2 flex items-center gap-0.5 text-[9px] font-bold text-slate-400 dark:text-slate-500">
                {hour.uvIndex > 2 ? (
                  <span className="flex items-center gap-0.5 text-amber-500">
                    <Sun size={9} />
                    UV {Math.round(hour.uvIndex)}
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-blue-400">
                    <Droplet size={9} className="fill-current" />
                    {hour.humidity}%
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
