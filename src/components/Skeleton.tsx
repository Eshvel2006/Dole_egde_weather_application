import { motion } from 'motion/react';

export function SkeletonLoader() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-pulse select-none">
      {/* Top Search Bar Placeholder */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full max-w-lg h-12 rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-white/10 dark:border-slate-800/60" />
        <div className="w-10 h-10 rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-white/10 dark:border-slate-800/60" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Layout (Hero & Hourly) */}
        <div className="lg:col-span-7 space-y-8">
          {/* WeatherCard Skeleton */}
          <div className="h-[340px] rounded-3xl bg-white/10 dark:bg-slate-900/30 border border-white/20 dark:border-slate-800/50 p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-24 h-4 rounded bg-white/15 dark:bg-slate-850" />
              <div className="w-48 h-8 rounded bg-white/15 dark:bg-slate-850" />
              <div className="w-32 h-4 rounded bg-white/15 dark:bg-slate-850" />
            </div>
            <div className="flex items-center gap-6 my-6">
              <div className="w-20 h-20 rounded-full bg-white/15 dark:bg-slate-850" />
              <div className="space-y-2">
                <div className="w-24 h-10 rounded bg-white/15 dark:bg-slate-850" />
                <div className="w-36 h-4 rounded bg-white/15 dark:bg-slate-850" />
              </div>
            </div>
            <div className="w-full h-8 rounded bg-white/15 dark:bg-slate-850" />
          </div>

          {/* Hourly Forecast Timeline Skeleton */}
          <div className="space-y-4">
            <div className="w-40 h-5 rounded bg-white/15 dark:bg-slate-850" />
            <div className="flex gap-3 overflow-x-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`hour-skeleton-${i}`}
                  className="flex-shrink-0 w-24 h-32 rounded-2xl bg-white/10 dark:bg-slate-900/30 border border-white/10 dark:border-slate-800/40 p-4 flex flex-col items-center justify-between"
                >
                  <div className="w-10 h-3 rounded bg-white/15 dark:bg-slate-850" />
                  <div className="w-8 h-8 rounded-full bg-white/15 dark:bg-slate-850" />
                  <div className="w-6 h-4 rounded bg-white/15 dark:bg-slate-850" />
                  <div className="w-12 h-2 rounded bg-white/15 dark:bg-slate-850" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Layout (7-Day Forecast) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-white/10 dark:bg-slate-900/30 border border-white/20 dark:border-slate-800/50 p-6 space-y-4">
            <div className="w-36 h-5 rounded bg-white/15 dark:bg-slate-850 mb-6" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`day-skeleton-${i}`}
                className="flex items-center justify-between gap-4 py-3.5 px-4 rounded-2xl bg-white/5 border border-white/5 dark:border-slate-800/20"
              >
                <div className="w-14 h-4 rounded bg-white/15 dark:bg-slate-850" />
                <div className="w-16 h-4 rounded bg-white/15 dark:bg-slate-850" />
                <div className="flex-grow h-2 rounded-full bg-white/15 dark:bg-slate-850 mx-4" />
                <div className="w-8 h-4 rounded bg-white/15 dark:bg-slate-850" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Highlights & Air Quality Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Today's Highlights Skeleton */}
        <div className="space-y-4">
          <div className="w-36 h-5 rounded bg-white/15 dark:bg-slate-850" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`metric-skeleton-${i}`}
                className="rounded-2xl bg-white/10 dark:bg-slate-900/30 border border-white/20 dark:border-slate-800/50 p-5 h-36 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center">
                  <div className="w-16 h-3 rounded bg-white/15 dark:bg-slate-850" />
                  <div className="w-8 h-8 rounded-lg bg-white/15 dark:bg-slate-850" />
                </div>
                <div className="w-20 h-6 rounded bg-white/15 dark:bg-slate-850" />
              </div>
            ))}
          </div>
        </div>

        {/* Air Quality Skeleton */}
        <div className="rounded-3xl bg-white/10 dark:bg-slate-900/30 border border-white/20 dark:border-slate-800/50 p-6 space-y-6">
          <div className="w-36 h-5 rounded bg-white/15 dark:bg-slate-850" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-24 h-24 rounded-full bg-white/15 dark:bg-slate-850" />
              <div className="w-16 h-4 rounded bg-white/15 dark:bg-slate-850 mt-4" />
            </div>
            <div className="md:col-span-7 space-y-4">
              <div className="w-full h-8 rounded bg-white/15 dark:bg-slate-850" />
              <div className="w-full h-8 rounded bg-white/15 dark:bg-slate-850" />
              <div className="w-full h-8 rounded bg-white/15 dark:bg-slate-850" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SkeletonLoader;
