import { useState, useEffect } from 'react';
import { GeocodingResult } from '../types';

export interface WeatherPreferences {
  theme: 'dark' | 'light';
  lastCity: {
    name: string;
    country: string;
    lat: number;
    lon: number;
    countryCode?: string;
  };
  recentSearches: GeocodingResult[];
}

const DEFAULT_CITY = {
  name: 'San Francisco',
  country: 'United States',
  lat: 37.7749,
  lon: -122.4194,
  countryCode: 'US',
};

export function useWeatherPreferences() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('weather_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    // Default to dark mode for the premium glassy aesthetic
    return 'dark';
  });

  const [lastCity, setLastCity] = useState(() => {
    const saved = localStorage.getItem('weather_last_city');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_CITY;
      }
    }
    return DEFAULT_CITY;
  });

  const [recentSearches, setRecentSearches] = useState<GeocodingResult[]>(() => {
    const saved = localStorage.getItem('weather_recent_searches');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Apply theme class to HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('weather_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const saveLastCity = (city: typeof DEFAULT_CITY) => {
    setLastCity(city);
    localStorage.setItem('weather_last_city', JSON.stringify(city));
  };

  const addRecentSearch = (city: GeocodingResult) => {
    setRecentSearches((prev) => {
      // Filter out duplicate cities
      const filtered = prev.filter((item) => item.id !== city.id);
      // Prepend and limit to top 5
      const updated = [city, ...filtered].slice(0, 5);
      localStorage.setItem('weather_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.setItem('weather_recent_searches', JSON.stringify([]));
  };

  return {
    theme,
    toggleTheme,
    lastCity,
    saveLastCity,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  };
}
