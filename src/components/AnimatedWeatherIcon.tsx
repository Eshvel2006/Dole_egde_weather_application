import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudSun, 
  CloudMoon, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  Snowflake, 
  CloudLightning,
  HelpCircle,
  Wind
} from 'lucide-react';
import { motion } from 'motion/react';

interface AnimatedWeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
  size?: number;
}

export function AnimatedWeatherIcon({ code, isDay = true, className = '', size = 48 }: AnimatedWeatherIconProps) {
  const iconProps = {
    size,
    className: 'text-current',
  };

  // Select the appropriate icon based on weather code
  const getIconElement = () => {
    switch (code) {
      case 0: // Clear Sky
        return isDay ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]"
          >
            <Sun {...iconProps} />
          </motion.div>
        ) : (
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="text-indigo-200 drop-shadow-[0_0_10px_rgba(199,210,254,0.4)]"
          >
            <Moon {...iconProps} />
          </motion.div>
        );

      case 1: // Mainly clear
      case 2: // Partly cloudy
        return isDay ? (
          <div className="relative text-sky-300">
            <motion.div
              animate={{ y: [0, -3, 0], x: [0, 2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-1 -right-1 text-amber-400 opacity-90"
            >
              <Sun size={size * 0.7} />
            </motion.div>
            <motion.div
              animate={{ y: [0, 2, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative text-slate-100"
            >
              <Cloud {...iconProps} />
            </motion.div>
          </div>
        ) : (
          <div className="relative text-indigo-400">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-1 -right-1 text-indigo-200"
            >
              <Moon size={size * 0.7} />
            </motion.div>
            <motion.div
              animate={{ y: [0, 2, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative text-slate-300"
            >
              <Cloud {...iconProps} />
            </motion.div>
          </div>
        );

      case 3: // Overcast
        return (
          <motion.div
            animate={{ y: [0, -2, 2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="text-slate-400 drop-shadow-md"
          >
            <Cloud {...iconProps} />
          </motion.div>
        );

      case 45: // Fog
      case 48: // Depositing rime fog
        return (
          <motion.div
            animate={{ x: [-4, 4, -4] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="text-zinc-300"
          >
            <CloudFog {...iconProps} />
          </motion.div>
        );

      case 51: // Drizzle
      case 53:
      case 55:
      case 56:
      case 57:
        return (
          <div className="relative text-blue-300">
            <motion.div
              animate={{ y: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <CloudDrizzle {...iconProps} />
            </motion.div>
          </div>
        );

      case 61: // Rain
      case 63:
      case 65:
      case 66:
      case 67:
      case 80:
      case 81:
      case 82:
        return (
          <div className="relative text-blue-400">
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <CloudRain {...iconProps} />
            </motion.div>
          </div>
        );

      case 71: // Snow
      case 73:
      case 75:
      case 77:
      case 85:
      case 86:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="text-sky-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
          >
            <Snowflake {...iconProps} />
          </motion.div>
        );

      case 95: // Thunderstorm
      case 96:
      case 99:
        return (
          <div className="relative text-purple-400">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 0.98, 1.03, 1],
                color: ['#c084fc', '#e9d5ff', '#c084fc', '#e9d5ff', '#c084fc']
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <CloudLightning {...iconProps} />
            </motion.div>
          </div>
        );

      default:
        return <HelpCircle {...iconProps} className="text-slate-400" />;
    }
  };

  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      {getIconElement()}
    </div>
  );
}
