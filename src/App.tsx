import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useWeatherPreferences } from './hooks/useWeatherPreferences';
import { fetchWeatherData } from './services/weatherAPI';
import { WeatherBackground } from './components/WeatherBackground';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { HourlyForecast } from './components/HourlyForecast';
import { ForecastCard } from './components/ForecastCard';
import { MetricCard } from './components/MetricCard';
import { AirQuality } from './components/AirQuality';
import { SkeletonLoader } from './components/Skeleton';
import { ErrorState } from './components/ErrorState';
import { Footer } from './components/Footer';
import { WorldRecords } from './components/WorldRecords';
import { getWeatherCondition } from './utils/weatherUtils';
import { 
  Wind, 
  Droplets, 
  Eye, 
  Gauge, 
  SunDim, 
  Sunrise, 
  Sunset, 
  Sparkles,
  Navigation,
  Compass,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Initialize the shared React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // prevent aggressive background queries on tab focus
      retry: 1, // retry failed connections once
    },
  },
});

// High-resolution curated Unsplash photo database for popular searched cities around the world
const CURATED_CITY_IMAGES: Record<string, string> = {
  chennai: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80', // Chennai Central at Night
  tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80', // Shinjuku neon cityscape
  newyork: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80', // Times Square
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80', // Big Ben & Bridge
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80', // Eiffel Tower street view
  singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=80', // Marina Bay Sands
  cairo: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1600&q=80', // Giza Pyramids
  reykjavik: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1600&q=80', // Icelandic Aurora & church
  sydney: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80', // Sydney Opera House
  riodejaneiro: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1600&q=80', // Rio mountains & beaches
  mumbai: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1600&q=80', // Gateway of India
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=80', // Humayun's Tomb / Lotus Temple
  sanfrancisco: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80', // Golden Gate Bridge
  losangeles: 'https://images.unsplash.com/photo-1515898913320-f38370edab7a?auto=format&fit=crop&w=1600&q=80', // Palm trees sky
  chicago: 'https://images.unsplash.com/photo-1494522358652-f30e61a60313?auto=format&fit=crop&w=1600&q=80', // Chicago skyline & lake
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80', // Burj Khalifa & towers
  toronto: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1600&q=80', // CN Tower skyline
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80', // Colosseum
  berlin: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80', // Berlin Cathedral
  amsterdam: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80', // Canals & houses
  seoul: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1600&q=80', // Seoul city at night
  bangkok: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&q=80', // Bangkok Grand Palace
  capetown: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1600&q=80', // Table Mountain
  vancouver: 'https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=1600&q=80', // Skyline & snowy mountains
  barcelona: 'https://images.unsplash.com/photo-1583422409516-2895a77efedd?auto=format&fit=crop&w=1600&q=80', // Park Guell / Sagrada Familia
  istanbul: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80', // Bosporus & Hagia Sophia
};

function DashboardContent() {
  const {
    theme,
    toggleTheme,
    lastCity,
    saveLastCity,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  } = useWeatherPreferences();

  // Floating Geolocation notification state
  interface GeoNotification {
    type: 'loading' | 'success' | 'error';
    message: string;
  }
  const [geoNotification, setGeoNotification] = useState<GeoNotification | null>(null);

  // Real-time location tracking state
  const [realTimeTracking, setRealTimeTracking] = useState<boolean>(() => {
    return localStorage.getItem('real_time_tracking') === 'true';
  });

  // Background Personalization States
  const [customBg, setCustomBg] = useState<string | null>(() => {
    return localStorage.getItem('custom_weather_bg');
  });
  const [bgBlur, setBgBlur] = useState<number>(() => {
    const saved = localStorage.getItem('custom_weather_bg_blur');
    return saved ? parseInt(saved, 10) : 10;
  });
  const [bgBrightness, setBgBrightness] = useState<number>(() => {
    const saved = localStorage.getItem('custom_weather_bg_brightness');
    return saved ? parseInt(saved, 10) : 75;
  });

  const handleUploadBg = (url: string | null) => {
    setCustomBg(url);
    if (url) {
      localStorage.setItem('custom_weather_bg', url);
    } else {
      localStorage.removeItem('custom_weather_bg');
    }
  };

  const handleUpdateBlur = (blur: number) => {
    setBgBlur(blur);
    localStorage.setItem('custom_weather_bg_blur', blur.toString());
  };

  const handleUpdateBrightness = (brightness: number) => {
    setBgBrightness(brightness);
    localStorage.setItem('custom_weather_bg_brightness', brightness.toString());
  };

  // Dynamic automatic city wallpaper state and fetching logic
  const [cityBgUrl, setCityBgUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCityBg = async () => {
      if (!lastCity?.name) return;
      
      // Clean and normalize name for dictionary lookup (e.g., "New York" -> "newyork")
      const key = lastCity.name.toLowerCase().replace(/[^a-z]/g, '');
      
      // Phase 1: Try high-quality curated preset list first
      if (CURATED_CITY_IMAGES[key]) {
        if (isMounted) {
          setCityBgUrl(CURATED_CITY_IMAGES[key]);
        }
        return;
      }

      // Phase 2: Dynamic fallback queries to official Wikipedia main image database
      try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(lastCity.name)}&origin=*`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Wikipedia image response failed');
        const resData = await response.json();
        const pages = resData.query?.pages;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          if (pageId && pageId !== '-1') {
            const originalImg = pages[pageId]?.original?.source;
            if (originalImg && isMounted) {
              setCityBgUrl(originalImg);
              return;
            }
          }
        }
      } catch (error) {
        console.warn('Dynamic Wikipedia background lookup failed:', error);
      }

      // Phase 3: No image found; reset background to use beautiful weather gradients
      if (isMounted) {
        setCityBgUrl(null);
      }
    };

    fetchCityBg();

    return () => {
      isMounted = false;
    };
  }, [lastCity?.name]);

  // React Query fetching the complete weather data
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['weather', lastCity.lat, lastCity.lon],
    queryFn: () =>
      fetchWeatherData(
        lastCity.lat,
        lastCity.lon,
        lastCity.name,
        lastCity.country,
        lastCity.countryCode
      ),
    staleTime: 1000 * 60 * 15, // Cache results for 15 minutes to save bandwidth
  });

  // Real-time location tracking and periodic weather poller effect
  useEffect(() => {
    if (!realTimeTracking) return;

    if (!navigator.geolocation) {
      setGeoNotification({
        type: 'error',
        message: 'Geolocation is not supported by your browser.'
      });
      setTimeout(() => setGeoNotification(null), 5000);
      setRealTimeTracking(false);
      localStorage.setItem('real_time_tracking', 'false');
      return;
    }

    setGeoNotification({
      type: 'loading',
      message: '🛰️ Real-Time GPS Active. Syncing current location...'
    });

    const updatePosition = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        if (!response.ok) throw new Error('Failed to resolve city name');
        const resData = await response.json();
        
        const cityName = resData.city || resData.locality || resData.principalSubdivision || 'Your Location';
        const countryName = resData.countryName || 'GPS Coordinates';
        const countryCode = resData.countryCode || '';

        const detectedCity = {
          name: cityName,
          country: countryName,
          lat: latitude,
          lon: longitude,
          countryCode: countryCode,
        };

        // Update if coordinates or city actually shifted
        if (
          lastCity.name !== cityName || 
          Math.abs(lastCity.lat - latitude) > 0.005 || 
          Math.abs(lastCity.lon - longitude) > 0.005
        ) {
          saveLastCity(detectedCity);
        }

        setGeoNotification({
          type: 'success',
          message: `📡 Real-Time GPS Synced: ${cityName}!`
        });
      } catch (err) {
        console.error('Real-Time reverse geocoding failed:', err);
        const detectedCity = {
          name: 'Your Location',
          country: 'GPS Coordinates',
          lat: latitude,
          lon: longitude,
          countryCode: '',
        };
        saveLastCity(detectedCity);
      }

      setTimeout(() => setGeoNotification(null), 4000);
    };

    // Use watchPosition for automatic movement detection
    const watchId = navigator.geolocation.watchPosition(
      updatePosition,
      (error) => {
        console.warn('Real-time watchPosition failed:', error);
        setGeoNotification({
          type: 'error',
          message: '⚠️ Real-Time GPS connection interrupted.'
        });
        setTimeout(() => setGeoNotification(null), 5000);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 * 30 }
    );

    // Periodic live weather poller (refetches every 30 seconds to keep data 100% real-time)
    const refetchTimer = setInterval(() => {
      refetch();
    }, 30000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(refetchTimer);
    };
  }, [realTimeTracking, refetch, lastCity.name, lastCity.lat, lastCity.lon]);

  // Trigger geolocation on mount (one-shot fetch only if real-time tracking is disabled)
  useEffect(() => {
    if (realTimeTracking) return;

    if (!navigator.geolocation) {
      setGeoNotification({
        type: 'error',
        message: 'Geolocation is not supported by your browser.'
      });
      setTimeout(() => setGeoNotification(null), 5000);
      return;
    }

    setGeoNotification({
      type: 'loading',
      message: '📍 Requesting location access...'
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setGeoNotification({
          type: 'loading',
          message: '🔍 Detecting current city...'
        });

        try {
          // Fetch reverse geocoded city name for maximum luxury
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (!response.ok) throw new Error('Failed to resolve city name');
          const resData = await response.json();
          
          const cityName = resData.city || resData.locality || resData.principalSubdivision || 'Your Location';
          const countryName = resData.countryName || 'GPS Coordinates';
          const countryCode = resData.countryCode || '';

          const detectedCity = {
            name: cityName,
            country: countryName,
            lat: latitude,
            lon: longitude,
            countryCode: countryCode,
          };

          saveLastCity(detectedCity);
          
          setGeoNotification({
            type: 'success',
            message: `✅ Location detected: ${cityName}, ${countryName}!`
          });
        } catch (err) {
          console.error('Reverse geocoding failed:', err);
          
          // Fallback to coordinates
          const detectedCity = {
            name: 'Your Location',
            country: 'GPS Coordinates',
            lat: latitude,
            lon: longitude,
            countryCode: '',
          };

          saveLastCity(detectedCity);

          setGeoNotification({
            type: 'success',
            message: '✅ Location detected via GPS!'
          });
        }

        // Auto fade success message after 4 seconds
        setTimeout(() => setGeoNotification(null), 4000);
      },
      (error) => {
        console.warn('Geolocation failed or denied:', error);
        let errorMsg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied. Using saved city.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location unavailable. Using saved city.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out. Using saved city.';
        }

        setGeoNotification({
          type: 'error',
          message: `⚠️ ${errorMsg}`
        });

        // Auto fade error message after 5 seconds
        setTimeout(() => setGeoNotification(null), 5000);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 1000 * 60 * 10 }
    );
  }, [realTimeTracking]);

  const handleSelectCity = (city: typeof lastCity) => {
    saveLastCity(city);
  };

  // Extract visual state parameters once loaded
  const currentCondition = data ? getWeatherCondition(data.current.weatherCode, data.current.isDay) : null;

  // Render UV Risk descriptive levels
  const getUvIndexRisk = (uv: number) => {
    if (uv <= 2) return 'Low Risk';
    if (uv <= 5) return 'Moderate Risk';
    if (uv <= 7) return 'High Risk';
    if (uv <= 10) return 'Very High Risk';
    return 'Extreme Exposure';
  };

  // Convert degrees to standard compass direction
  const getWindDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  return (
    <>
      {/* Background Ambience Layer */}
      <WeatherBackground 
        type={currentCondition?.animationType || 'sunny'} 
        customBgUrl={customBg}
        bgBlur={bgBlur}
        bgBrightness={bgBrightness}
      />

      {/* Floating Geolocation Toast Status */}
      <AnimatePresence>
        {geoNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 p-4 rounded-2xl backdrop-blur-xl border shadow-xl flex items-center gap-3 text-xs font-semibold max-w-sm ${
              geoNotification.type === 'loading'
                ? 'bg-indigo-500/15 dark:bg-indigo-500/20 border-indigo-500/30 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-200'
                : geoNotification.type === 'success'
                ? 'bg-emerald-500/15 dark:bg-emerald-500/20 border-emerald-500/30 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-200'
                : 'bg-amber-500/15 dark:bg-amber-500/20 border-amber-500/30 dark:border-amber-500/40 text-amber-700 dark:text-amber-200'
            }`}
          >
            {geoNotification.type === 'loading' && (
              <Loader2 className="animate-spin text-indigo-500" size={16} />
            )}
            <span>{geoNotification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex bg-slate-50 dark:bg-[#020617] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-1000 relative">
        {/* Sidebar Nav (Geometric Balance layout pattern) */}
        <aside className="w-20 hidden md:flex flex-col items-center py-8 border-r border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-950/50 backdrop-blur-xl relative z-20 select-none">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl mb-12 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <nav className="flex flex-col gap-8">
            <div className="p-2.5 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-lg cursor-pointer transition-all hover:scale-105" title="Dashboard">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <div className="p-2.5 text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-all cursor-pointer hover:scale-105" title="Radar Map" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="p-2.5 text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-all cursor-pointer hover:scale-105" title="Sensation Stats" onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="p-2.5 text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-all cursor-pointer hover:scale-105" title="Theme Quick Change" onClick={toggleTheme}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </nav>
          <div className="mt-auto">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:scale-105 transition-all" />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow flex flex-col min-h-screen relative z-10 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto w-full transition-colors duration-1000">
          {/* Navigation Section */}
          <Navbar theme={theme} onToggleTheme={toggleTheme} />

          <main className="flex-grow pt-6 space-y-8 pb-12">
          {/* Header Actions Line */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <SearchBar
              onSelectCity={handleSelectCity}
              recentSearches={recentSearches}
              addRecentSearch={addRecentSearch}
              clearRecentSearches={clearRecentSearches}
            />

            {/* Micro Location & Real-Time Sync Info */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Real-time Tracking Toggle */}
              <button
                onClick={() => {
                  const newState = !realTimeTracking;
                  setRealTimeTracking(newState);
                  localStorage.setItem('real_time_tracking', newState ? 'true' : 'false');
                }}
                className={`px-3.5 py-1.5 rounded-2xl border backdrop-blur-md text-[11px] font-bold shadow-md flex items-center gap-2 transition-all duration-300 select-none ${
                  realTimeTracking
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                    : 'bg-white/10 dark:bg-slate-900/40 border-white/20 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-white/20 dark:hover:bg-slate-800/80'
                }`}
                title={realTimeTracking ? "Real-time live location tracking is active" : "Enable real-time live location tracking"}
              >
                <div className="relative flex h-2 w-2">
                  {realTimeTracking && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${realTimeTracking ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                </div>
                <span>{realTimeTracking ? 'LIVE Sync: Active' : 'Enable LIVE Sync'}</span>
              </button>

              <AnimatePresence mode="wait">
                {data && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="px-3.5 py-1.5 rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/80 backdrop-blur-md text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-md flex items-center gap-1.5"
                  >
                    <Sparkles size={13} className="text-indigo-500" />
                    <span>Viewing details for {data.city}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Conditional Content Rendering */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12"
            >
              <SkeletonLoader />
            </motion.div>
          )}

          {isError && (
            <div className="py-20 flex justify-center">
              <ErrorState
                message={error instanceof Error ? error.message : 'An error occurred'}
                onRetry={refetch}
              />
            </div>
          )}

          {/* Loaded Dashboard Content */}
          {!isLoading && !isError && data && (
            <motion.div
              key={`${data.city}_${data.current.time}_${data.current.temperature}`}
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              {/* Primary Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: Weather Cards & Hourly */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Hero Weather Card */}
                  <WeatherCard 
                    data={data}
                    customBgUrl={customBg}
                    bgBlur={bgBlur}
                    bgBrightness={bgBrightness}
                    onUploadBg={handleUploadBg}
                    onUpdateBlur={handleUpdateBlur}
                    onUpdateBrightness={handleUpdateBrightness}
                  />

                  {/* Hourly 24-hour timeline slider */}
                  <HourlyForecast hourly={data.hourly} currentTimeStr={data.current.time} />
                </div>

                {/* Right Side: 5-Day / 7-Day Forecast */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-[32px] bg-gradient-to-b from-white/40 to-slate-50/10 dark:from-slate-900/40 dark:to-slate-950/40 border border-slate-200 dark:border-slate-800 backdrop-blur-xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850 pb-3 mb-2">
                      <h3 className="text-sm font-display font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-3.5 bg-indigo-600 dark:bg-indigo-500 rounded-full" />
                        7-Day Forecast
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                        Celsius
                      </span>
                    </div>

                    {/* Pre-calculate global min/max bounds for proper visual bar alignment */}
                    {(() => {
                      const mins = data.daily.map((d) => d.tempMin);
                      const maxs = data.daily.map((d) => d.tempMax);
                      const globalMin = Math.min(...mins);
                      const globalMax = Math.max(...maxs);

                      return (
                        <div className="flex flex-col gap-2.5">
                          {data.daily.map((dayItem, idx) => (
                            <ForecastCard
                              key={dayItem.date}
                              item={dayItem}
                              isToday={idx === 0}
                              minTempBound={globalMin}
                              maxTempBound={globalMax}
                            />
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Secondary Layout: Metrics Highlights & Air Quality */}
              <div className="space-y-8">
                {/* Today's Highlights Block */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full" />
                    Today's Meteorological Highlights
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* UV Index */}
                    <MetricCard
                      icon={<SunDim size={18} />}
                      label="UV Radiation"
                      value={`${Math.round(data.current.uvIndex)} / 11`}
                      subValue={getUvIndexRisk(data.current.uvIndex)}
                      colorClass="text-amber-500"
                    />

                    {/* Wind Speed */}
                    <MetricCard
                      icon={<Wind size={18} />}
                      label="Wind Condition"
                      value={`${Math.round(data.current.windSpeed)} km/h`}
                      subValue={`Blowing ${getWindDirection(data.current.windDirection)} (${Math.round(data.current.windDirection)}°)`}
                      colorClass="text-sky-400"
                    />

                    {/* Humidity */}
                    <MetricCard
                      icon={<Droplets size={18} />}
                      label="Relative Humidity"
                      value={`${Math.round(data.current.humidity)}%`}
                      subValue={`Cloud cover sits at ${Math.round(data.current.cloudCover)}%`}
                      colorClass="text-blue-400"
                    />

                    {/* Air Pressure */}
                    <MetricCard
                      icon={<Gauge size={18} />}
                      label="Atmospheric Pressure"
                      value={`${Math.round(data.current.pressure)} hPa`}
                      subValue="Standard sea-level surface"
                      colorClass="text-teal-400"
                    />

                    {/* Visibility */}
                    <MetricCard
                      icon={<Eye size={18} />}
                      label="Horizontal Visibility"
                      value="10.0 km"
                      subValue="Excellent visual range"
                      colorClass="text-indigo-400"
                    />

                    {/* Sunrise Time */}
                    <MetricCard
                      icon={<Sunrise size={18} />}
                      label="Solar Sunrise"
                      value={new Date(data.daily[0].sunrise).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                      subValue="Astronomical dawn"
                      colorClass="text-amber-400"
                    />

                    {/* Sunset Time */}
                    <MetricCard
                      icon={<Sunset size={18} />}
                      label="Solar Sunset"
                      value={new Date(data.daily[0].sunset).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                      subValue="Astronomical dusk"
                      colorClass="text-indigo-400"
                    />

                    {/* Feels Like summary block */}
                    <MetricCard
                      icon={<Compass size={18} />}
                      label="Sensation Index"
                      value={`${Math.round(data.current.apparentTemperature)}°C`}
                      subValue={`Thermal deviation: ${(data.current.apparentTemperature - data.current.temperature).toFixed(1)}°C`}
                      colorClass="text-purple-400"
                    />
                  </div>
                </div>

                {/* Air Quality Index Block */}
                <AirQuality data={data.airQuality} />

                {/* World Meteorological Records Section */}
                <WorldRecords onSelectCity={handleSelectCity} />
              </div>
            </motion.div>
          )}
        </main>

        <Footer />
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}
