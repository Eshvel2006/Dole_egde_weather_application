import { Heart } from 'lucide-react';
import { motion } from 'motion/react';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 dark:border-slate-900/50 py-6 mt-16 text-center select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <span>Created by</span>
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400">Eshvel.T</span>
          <Heart size={12} className="text-rose-500 fill-current animate-pulse" />
          <span>with premium React &amp; Tailwind</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          >
            Powered by Open-Meteo API
          </a>
          <span>•</span>
          <span>© {new Date().getFullYear()} Skyline Inc.</span>
        </div>
      </div>
    </footer>
  );
}
