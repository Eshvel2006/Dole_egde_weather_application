import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WeatherBackgroundProps {
  type: 'sunny' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog' | 'night';
  customBgUrl?: string | null;
  bgBlur?: number;
  bgBrightness?: number;
}

export function WeatherBackground({ 
  type,
  customBgUrl = null,
  bgBlur = 10,
  bgBrightness = 75
}: WeatherBackgroundProps) {
  // We can create specific floating particles based on the weather type.
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    if (type === 'rain' || type === 'snow' || type === 'night') {
      const pCount = type === 'rain' ? 35 : type === 'snow' ? 25 : 30; // Twinkling stars or precipitation lines
      const generated = Array.from({ length: pCount }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: type === 'rain' ? 1 + Math.random() * 1.5 : type === 'snow' ? 3 + Math.random() * 4 : 2 + Math.random() * 3,
        size: type === 'rain' ? 1 + Math.random() * 2 : type === 'snow' ? 3 + Math.random() * 5 : 1 + Math.random() * 1.5,
      }));
      setParticles(generated);
    } else {
      setParticles([]);
    }
  }, [type]);

  // Define gradients matching the exact mood of the weather
  const getGradientStyles = () => {
    switch (type) {
      case 'sunny':
        return 'bg-gradient-to-tr from-sky-400 via-amber-200 to-amber-400 dark:from-slate-900 dark:via-amber-950/20 dark:to-slate-900';
      case 'cloudy':
        return 'bg-gradient-to-tr from-slate-300 via-blue-200 to-slate-400 dark:from-slate-950 dark:via-zinc-800/40 dark:to-slate-900';
      case 'rain':
        return 'bg-gradient-to-tr from-slate-700 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-950';
      case 'storm':
        return 'bg-gradient-to-tr from-zinc-900 via-purple-950/60 to-slate-950';
      case 'snow':
        return 'bg-gradient-to-tr from-indigo-50 via-sky-100 to-blue-200 dark:from-slate-950 dark:via-sky-950/20 dark:to-zinc-900';
      case 'fog':
        return 'bg-gradient-to-tr from-zinc-200 via-slate-300 to-zinc-400 dark:from-slate-950 dark:via-zinc-900/50 dark:to-slate-900';
      case 'night':
        return 'bg-gradient-to-tr from-slate-950 via-indigo-950 to-neutral-950';
      default:
        return 'bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-950';
    }
  };

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden select-none transition-all duration-1000 ease-out">
      {/* Dynamic Master Gradient Background */}
      <div className={`absolute inset-0 transition-all duration-1000 ${getGradientStyles()}`} />

      {/* User Custom Background Image Layer */}
      <AnimatePresence>
        {customBgUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-[-10]"
          >
            <img
              src={customBgUrl}
              alt="Custom Weather Background"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none"
              style={{
                filter: `blur(${bgBlur}px) brightness(${bgBrightness}%)`,
                transition: 'filter 0.5s ease-out',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glassy Overlay Pattern */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px] bg-[size:24px_24px] opacity-40" />

      {/* Interactive Orbs (floating background ambiance) */}
      <div className="absolute inset-0 overflow-hidden opacity-30 blur-[120px] pointer-events-none">
        {/* Orb 1 */}
        <motion.div
          animate={{
            x: type === 'sunny' ? [0, 40, -20, 0] : [-40, 20, -10, -40],
            y: type === 'sunny' ? [0, -30, 20, 0] : [10, -40, 30, 10],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-1/4 left-1/4 w-[35vw] h-[35vw] rounded-full filter ${
            type === 'sunny'
              ? 'bg-amber-300 dark:bg-amber-500/20'
              : type === 'rain' || type === 'storm'
              ? 'bg-blue-600 dark:bg-blue-800/10'
              : type === 'snow'
              ? 'bg-sky-200 dark:bg-sky-400/10'
              : 'bg-indigo-300 dark:bg-indigo-500/10'
          }`}
        />
        {/* Orb 2 */}
        <motion.div
          animate={{
            x: type === 'sunny' ? [0, -30, 30, 0] : [20, -30, 10, 20],
            y: type === 'sunny' ? [0, 40, -10, 0] : [-30, 20, -20, -30],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full filter ${
            type === 'sunny'
              ? 'bg-orange-300 dark:bg-orange-500/20'
              : type === 'rain' || type === 'storm'
              ? 'bg-violet-600 dark:bg-violet-900/10'
              : type === 'snow'
              ? 'bg-blue-100 dark:bg-blue-400/10'
              : 'bg-purple-300 dark:bg-purple-500/10'
          }`}
        />
      </div>

      {/* Atmospheric FX Layer: Rain, Snow, Stars or Storm Lightning */}
      <AnimatePresence mode="popLayout">
        {type === 'rain' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: '110vh', opacity: [0, 0.7, 0.7, 0] }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'linear',
                }}
                className="absolute bg-blue-300/40 rounded-full"
                style={{
                  left: `${p.left}%`,
                  width: `${p.size}px`,
                  height: `${p.size * 12}px`, // Slanted rain drop representation
                }}
              />
            ))}
          </div>
        )}

        {type === 'snow' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ y: -20, x: `${p.left}%`, opacity: 0 }}
                animate={{
                  y: '105vh',
                  x: [`${p.left}%`, `${p.left + (Math.random() * 10 - 5)}%`, `${p.left}%`],
                  opacity: [0, 0.8, 0.8, 0],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'easeInOut',
                }}
                className="absolute bg-white rounded-full blur-[0.5px]"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                }}
              />
            ))}
          </div>
        )}

        {type === 'night' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                animate={{
                  opacity: [0.1, 0.9, 0.1],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'easeInOut',
                }}
                className="absolute bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                style={{
                  left: `${p.left}%`,
                  top: `${Math.random() * 80}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                }}
              />
            ))}
          </div>
        )}

        {type === 'storm' && (
          <motion.div
            animate={{
              opacity: [0, 0, 0.05, 0, 0.6, 0.05, 0, 0, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-white pointer-events-none z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
