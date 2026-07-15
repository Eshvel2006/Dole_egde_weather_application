import { CloudSun } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { motion } from 'motion/react';

interface NavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex items-center justify-between py-5 border-b border-slate-200 dark:border-slate-800 bg-white/5 dark:bg-slate-950/30 backdrop-blur-md sticky top-0 z-40"
    >
      {/* Brand Logo & Identity */}
      <div className="flex items-center gap-3 select-none">
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
        >
          <CloudSun size={22} className="animate-pulse" />
        </motion.div>
        <div>
          <h1 className="text-lg font-display font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5 leading-none">
            DoleEdge Weather 
            <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase">
              SaaS
            </span>
          </h1>
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-wider mt-0.5">
            Created by Eshvel.T
          </p>
        </div>
      </div>

      {/* Actions (System Status indicator & Theme Toggle) */}
      <div className="flex items-center gap-4">
        {/* API Health State Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>API Connected</span>
        </div>

        {/* Theme Switching Switcher */}
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </motion.header>
  );
}
