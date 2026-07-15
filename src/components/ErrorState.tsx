import { AlertTriangle, WifiOff, Search, RotateCcw, CloudOff } from 'lucide-react';
import { motion } from 'motion/react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  // Infer specific types of errors based on words in the message
  const isNetworkError = message.toLowerCase().includes('network') || message.toLowerCase().includes('internet') || message.toLowerCase().includes('connect');
  const isSearchError = message.toLowerCase().includes('search') || message.toLowerCase().includes('found') || message.toLowerCase().includes('invalid');

  const getVisual = () => {
    if (isNetworkError) {
      return (
        <div className="relative p-6 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 mb-6">
          <WifiOff size={48} className="animate-pulse" />
        </div>
      );
    }
    if (isSearchError) {
      return (
        <div className="relative p-6 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-6">
          <Search size={48} />
          <motion.span 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full"
          />
        </div>
      );
    }
    return (
      <div className="relative p-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 mb-6">
        <CloudOff size={48} />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto p-8 rounded-3xl bg-white/10 dark:bg-slate-900/30 border border-white/20 dark:border-slate-800/50 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center select-none"
    >
      {/* Dynamic Visual Illustration */}
      {getVisual()}

      {/* Error Message Header */}
      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
        {isNetworkError ? 'Connection interrupted' : isSearchError ? 'Location not found' : 'Weather service error'}
      </h3>

      {/* Description */}
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed">
        {message}
      </p>

      {/* Detailed troubleshooting suggestions based on error type */}
      <div className="mt-6 w-full p-3 rounded-xl bg-slate-50/5 dark:bg-slate-900/10 border border-white/5 text-left text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 font-medium">
        <div className="font-bold text-slate-700 dark:text-slate-300">Suggestions:</div>
        {isNetworkError ? (
          <>
            <div>• Check your WiFi or cellular network connectivity</div>
            <div>• Ensure your VPN is not blocking API requests</div>
          </>
        ) : isSearchError ? (
          <>
            <div>• Verify spelling is correct (e.g., "Paris", "New York")</div>
            <div>• Try appending the state or country code (e.g., "London, GB")</div>
          </>
        ) : (
          <>
            <div>• The Open-Meteo free API might be temporarily busy</div>
            <div>• Click retry below to query the server again</div>
          </>
        )}
      </div>

      {/* Retry CTA */}
      <button
        onClick={onRetry}
        className="mt-6 w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold tracking-wide shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
      >
        <RotateCcw size={14} />
        <span>Try Again</span>
      </button>
    </motion.div>
  );
}
export default ErrorState;
