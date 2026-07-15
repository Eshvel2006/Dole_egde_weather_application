import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  colorClass?: string;
}

export function MetricCard({ icon, label, value, subValue, colorClass = 'text-indigo-500' }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className="relative overflow-hidden rounded-2xl bg-white/10 dark:bg-slate-950/25 border border-slate-200 dark:border-slate-800 backdrop-blur-md p-5 flex flex-col justify-between min-h-[140px] shadow-sm group hover:shadow-md transition-all"
    >
      {/* Background radial accent glow on hover */}
      <div className="absolute inset-0 bg-radial-[circle_at_bottom_right,rgba(99,102,241,0.04),transparent_70%] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Card Header (Icon & Label) */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <div className={`p-2 rounded-xl bg-white/5 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 shadow-sm ${colorClass} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>

      {/* Card Content (Value & Description) */}
      <div className="mt-4 space-y-1">
        <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {value}
        </div>
        {subValue && (
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {subValue}
          </div>
        )}
      </div>
    </motion.div>
  );
}
