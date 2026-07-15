import { WeatherConditionDetails } from '../types';

/**
 * Maps WMO Weather Interpretation Codes to visuals, icons, and themes.
 * Supports day/night variants.
 */
export function getWeatherCondition(code: number, isDay: boolean = true): WeatherConditionDetails {
  // WMO Weather Codes (https://open-meteo.com/en/docs)
  switch (code) {
    case 0: // Clear sky
      return isDay
        ? {
            label: 'Sunny',
            iconName: 'Sun',
            bgGradient: 'from-amber-400 via-orange-400 to-sky-500',
            themeColor: 'text-amber-500',
            animationType: 'sunny',
          }
        : {
            label: 'Clear Night',
            iconName: 'Moon',
            bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
            themeColor: 'text-indigo-300',
            animationType: 'night',
          };

    case 1: // Mainly clear
    case 2: // Partly cloudy
      return isDay
        ? {
            label: 'Partly Cloudy',
            iconName: 'CloudSun',
            bgGradient: 'from-sky-400 via-blue-400 to-indigo-500',
            themeColor: 'text-sky-400',
            animationType: 'cloudy',
          }
        : {
            label: 'Partly Cloudy',
            iconName: 'CloudMoon',
            bgGradient: 'from-slate-900 via-slate-800 to-indigo-950',
            themeColor: 'text-indigo-400',
            animationType: 'night',
          };

    case 3: // Overcast
      return {
        label: 'Overcast',
        iconName: 'Cloud',
        bgGradient: 'from-slate-400 via-slate-500 to-zinc-600',
        themeColor: 'text-slate-500',
        animationType: 'cloudy',
      };

    case 45: // Fog
    case 48: // Depositing rime fog
      return {
        label: 'Foggy',
        iconName: 'CloudFog',
        bgGradient: 'from-zinc-300 via-slate-400 to-zinc-500',
        themeColor: 'text-zinc-400',
        animationType: 'fog',
      };

    case 51: // Light drizzle
    case 53: // Moderate drizzle
    case 55: // Dense drizzle
    case 56: // Light freezing drizzle
    case 57: // Dense freezing drizzle
      return {
        label: 'Drizzle',
        iconName: 'CloudDrizzle',
        bgGradient: 'from-blue-400 via-slate-400 to-indigo-600',
        themeColor: 'text-blue-400',
        animationType: 'rain',
      };

    case 61: // Slight rain
    case 63: // Moderate rain
    case 65: // Heavy rain
    case 66: // Light freezing rain
    case 67: // Heavy freezing rain
    case 80: // Slight rain showers
    case 81: // Moderate rain showers
    case 82: // Violent rain showers
      return {
        label: 'Rainy',
        iconName: 'CloudRain',
        bgGradient: 'from-blue-500 via-slate-500 to-indigo-800',
        themeColor: 'text-blue-500',
        animationType: 'rain',
      };

    case 71: // Slight snow fall
    case 73: // Moderate snow fall
    case 75: // Heavy snow fall
    case 77: // Snow grains
    case 85: // Slight snow showers
    case 86: // Heavy snow showers
      return {
        label: 'Snowy',
        iconName: 'Snowflake',
        bgGradient: 'from-sky-300 via-zinc-200 to-blue-400',
        themeColor: 'text-sky-300',
        animationType: 'snow',
      };

    case 95: // Thunderstorm
    case 96: // Thunderstorm with slight hail
    case 99: // Thunderstorm with heavy hail
      return {
        label: 'Thunderstorm',
        iconName: 'CloudLightning',
        bgGradient: 'from-slate-800 via-purple-900 to-zinc-900',
        themeColor: 'text-purple-500',
        animationType: 'storm',
      };

    default:
      return {
        label: 'Unknown',
        iconName: 'HelpCircle',
        bgGradient: 'from-slate-500 via-blue-500 to-purple-600',
        themeColor: 'text-slate-500',
        animationType: 'cloudy',
      };
  }
}

/**
 * Calculates PM2.5 standard AQI index.
 * PM2.5 is the most common metric for computing standard Air Quality Index (AQI).
 */
export function calculatePM25AQI(pm25: number): number {
  if (pm25 < 0) return 0;
  // US EPA AQI breakpoints for PM2.5 (ug/m3)
  if (pm25 <= 12.0) return Math.round(((50 - 0) / (12.0 - 0)) * (pm25 - 0) + 0);
  if (pm25 <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
  if (pm25 <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
  if (pm25 <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
  if (pm25 <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
  if (pm25 <= 350.4) return Math.round(((400 - 301) / (350.4 - 250.5)) * (pm25 - 250.5) + 301);
  return Math.round(((500 - 401) / (500.4 - 350.5)) * (pm25 - 350.5) + 401);
}

export interface AQIDetails {
  score: number;
  label: string;
  colorClass: string;
  borderColorClass: string;
  bgClass: string;
  description: string;
}

export function getAQIDetails(pm25: number): AQIDetails {
  const score = calculatePM25AQI(pm25);
  if (score <= 50) {
    return {
      score,
      label: 'Good',
      colorClass: 'text-emerald-400',
      borderColorClass: 'border-emerald-500/30',
      bgClass: 'bg-emerald-500/10',
      description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    };
  } else if (score <= 100) {
    return {
      score,
      label: 'Moderate',
      colorClass: 'text-amber-400',
      borderColorClass: 'border-amber-500/30',
      bgClass: 'bg-amber-500/10',
      description: 'Air quality is acceptable; however, there may be a risk for some people.',
    };
  } else if (score <= 150) {
    return {
      score,
      label: 'Unhealthy for Sensitive Groups',
      colorClass: 'text-orange-400',
      borderColorClass: 'border-orange-500/30',
      bgClass: 'bg-orange-500/10',
      description: 'Members of sensitive groups may experience health effects.',
    };
  } else if (score <= 200) {
    return {
      score,
      label: 'Unhealthy',
      colorClass: 'text-red-400',
      borderColorClass: 'border-red-500/30',
      bgClass: 'bg-red-500/10',
      description: 'Everyone may begin to experience health effects; sensitive groups more seriously.',
    };
  } else if (score <= 300) {
    return {
      score,
      label: 'Very Unhealthy',
      colorClass: 'text-purple-400',
      borderColorClass: 'border-purple-500/30',
      bgClass: 'bg-purple-500/10',
      description: 'Health alert: the risk of health effects is increased for everyone.',
    };
  } else {
    return {
      score,
      label: 'Hazardous',
      colorClass: 'text-rose-600',
      borderColorClass: 'border-rose-600/30',
      bgClass: 'bg-rose-600/10',
      description: 'Health warning of emergency conditions: everyone is more likely to be affected.',
    };
  }
}

/**
 * Formats a Date object or string into a human-readable local date.
 */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats an ISO date/time string or standard date/time string into a local time.
 */
export function formatTime(timeStr: string): string {
  const d = new Date(timeStr);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Formats an ISO string to extract just the hour number for timeline indexing.
 */
export function getHourLabel(timeStr: string): string {
  const d = new Date(timeStr);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  });
}
