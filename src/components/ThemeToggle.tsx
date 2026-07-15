import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 backdrop-blur-md text-slate-800 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-all cursor-pointer shadow-sm"
      aria-label="Toggle visual theme"
    >
      <motion.div
        key={theme}
        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} className="text-slate-800" />}
      </motion.div>
    </button>
  );
}
