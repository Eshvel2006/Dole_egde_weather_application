import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Flame, 
  Wind, 
  Droplets, 
  ArrowUpRight, 
  Trophy, 
  History, 
  Sparkles, 
  TrendingUp, 
  Compass, 
  Loader2,
  AlertTriangle,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudFog,
  Moon
} from 'lucide-react';
import axios from 'axios';

interface CityRecord {
  name: string;
  country: string;
  lat: number;
  lon: number;
  countryCode: string;
  temp?: number;
  humidity?: number;
  windSpeed?: number;
  weatherCode?: number;
  isDay?: boolean;
}

// Weather Code Helper to match icons
const getWeatherIcon = (code: number | undefined, isDay: boolean = true) => {
  if (code === undefined) return <Sun className="text-amber-500 animate-pulse" size={20} />;
  if (code === 0) return isDay ? <Sun className="text-amber-500 animate-spin-slow" size={20} /> : <Moon className="text-indigo-400" size={20} />;
  if ([1, 2, 3].includes(code)) return <Cloud className="text-slate-400" size={20} />;
  if ([45, 48].includes(code)) return <CloudFog className="text-slate-300" size={20} />;
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return <CloudRain className="text-blue-400" size={20} />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <Snowflake className="text-sky-300 animate-bounce" size={20} />;
  if ([95, 96, 99].includes(code)) return <CloudLightning className="text-purple-400" size={20} />;
  return <Cloud className="text-slate-400" size={20} />;
};

const CITIES: CityRecord[] = [
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, countryCode: 'JP' },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006, countryCode: 'US' },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278, countryCode: 'GB' },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198, countryCode: 'SG' },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lon: 31.2357, countryCode: 'EG' },
  { name: 'Reykjavik', country: 'Iceland', lat: 64.1466, lon: -21.9426, countryCode: 'IS' },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, countryCode: 'AU' },
  { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lon: -43.1729, countryCode: 'BR' },
];

const HISTORIC_RECORDS = [
  {
    category: 'Temperature High',
    value: '56.7 °C',
    location: 'Furnace Creek, Death Valley, USA',
    date: 'July 10, 1913',
    description: 'The highest reliably recorded ambient air temperature on Earth.',
    icon: <Flame className="text-rose-500" size={20} />,
    bgGradient: 'from-rose-500/10 to-orange-500/5 border-rose-500/20',
  },
  {
    category: 'Temperature Low',
    value: '-89.2 °C',
    location: 'Vostok Station, Antarctica',
    date: 'July 21, 1983',
    description: 'The lowest ground temperature ever measured on Earth naturally.',
    icon: <Snowflake className="text-sky-400" size={20} />,
    bgGradient: 'from-sky-500/10 to-indigo-500/5 border-sky-500/20',
  },
  {
    category: 'Highest Rainfall (24h)',
    value: '1,825 mm',
    location: 'Foc-Foc, Réunion Island',
    date: 'January 7-8, 1966',
    description: 'Heavy precipitation event caused by tropical cyclone Denise.',
    icon: <CloudRain className="text-blue-500" size={20} />,
    bgGradient: 'from-blue-500/10 to-cyan-500/5 border-blue-500/20',
  },
  {
    category: 'Highest Wind Gust',
    value: '408 km/h',
    location: 'Barrow Island, Australia',
    date: 'April 10, 1996',
    description: 'Recorded during Tropical Cyclone Olivia, breaking previous records.',
    icon: <Wind className="text-teal-400" size={20} />,
    bgGradient: 'from-teal-500/10 to-emerald-500/5 border-teal-500/20',
  },
];

interface WorldRecordsProps {
  onSelectCity: (city: { name: string; country: string; lat: number; lon: number; countryCode: string }) => void;
}

export function WorldRecords({ onSelectCity }: WorldRecordsProps) {
  const [activeTab, setActiveTab] = useState<'capitals' | 'dynamic' | 'alltime'>('capitals');
  const [citiesData, setCitiesData] = useState<CityRecord[]>(CITIES);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobalWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const lats = CITIES.map(c => c.lat).join(',');
        const lons = CITIES.map(c => c.lon).join(',');
        
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day`
        );
        
        const responseData = response.data;
        
        if (Array.isArray(responseData)) {
          const updated = CITIES.map((city, idx) => {
            const currentObj = responseData[idx]?.current;
            return {
              ...city,
              temp: currentObj?.temperature_2m,
              humidity: currentObj?.relative_humidity_2m,
              windSpeed: currentObj?.wind_speed_10m,
              weatherCode: currentObj?.weather_code,
              isDay: currentObj?.is_day === 1,
            };
          });
          setCitiesData(updated);
        } else if (responseData && responseData.current) {
          // If Open-Meteo returns a single object (which happens occasionally if only 1 item or in different version format), handle it
          const updated = CITIES.map((city) => ({
            ...city,
            temp: responseData.current.temperature_2m,
            humidity: responseData.current.relative_humidity_2m,
            windSpeed: responseData.current.wind_speed_10m,
            weatherCode: responseData.current.weather_code,
            isDay: responseData.current.is_day === 1,
          }));
          setCitiesData(updated);
        }
      } catch (err) {
        console.error('Failed to load world wise records:', err);
        setError('Failed to query world live weather databases.');
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalWeather();
  }, []);

  // Compute dynamic extremes based on loaded live data
  const getExtremes = () => {
    if (loading || error || !citiesData[0]?.temp) return null;

    const sortedByTemp = [...citiesData].sort((a, b) => (b.temp || 0) - (a.temp || 0));
    const sortedByWind = [...citiesData].sort((a, b) => (b.windSpeed || 0) - (a.windSpeed || 0));
    const sortedByHumidity = [...citiesData].sort((a, b) => (b.humidity || 0) - (a.humidity || 0));

    return {
      hottest: sortedByTemp[0],
      coldest: sortedByTemp[sortedByTemp.length - 1],
      windiest: sortedByWind[0],
      mostHumid: sortedByHumidity[0],
    };
  };

  const extremes = getExtremes();

  return (
    <div className="rounded-[32px] bg-gradient-to-br from-white/30 via-slate-50/10 to-slate-100/10 dark:from-slate-900/40 dark:via-slate-950/40 dark:to-slate-950/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl p-6 md:p-8 shadow-xl space-y-6">
      {/* Header and navigation tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/15 dark:bg-indigo-500/20 rounded-2xl text-indigo-600 dark:text-indigo-400">
            <Globe className="animate-spin-slow" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
              World Meteorological Records
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-widest">
                LIVE
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive global comparative records and historical highlights.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-slate-800/80 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('capitals')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'capitals'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Major Cities
          </button>
          <button
            onClick={() => setActiveTab('dynamic')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'dynamic'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Live Extremes
          </button>
          <button
            onClick={() => setActiveTab('alltime')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'alltime'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            All-Time Extremes
          </button>
        </div>
      </div>

      {/* Main interactive cards area based on tab */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
          <p className="text-xs text-slate-500 dark:text-slate-400">Querying real-time global weather grids...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center gap-3 text-xs">
          <AlertTriangle size={18} />
          <span>{error} Rendering mock backup grid for records.</span>
        </div>
      )}

      {!loading && (
        <div>
          {/* Tab 1: Major Cities comparison */}
          {activeTab === 'capitals' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {citiesData.map((city) => (
                <div
                  key={city.name}
                  onClick={() => onSelectCity({
                    name: city.name,
                    country: city.country,
                    lat: city.lat,
                    lon: city.lon,
                    countryCode: city.countryCode
                  })}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white/10 dark:bg-slate-900/10 backdrop-blur-md p-4 cursor-pointer hover:border-indigo-500/40 dark:hover:border-indigo-500/40 hover:bg-white/30 dark:hover:bg-slate-900/30 transition-all duration-300 flex flex-col justify-between min-h-[120px] shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`fi fi-${city.countryCode.toLowerCase()} rounded-sm`} />
                        <h4 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {city.name}
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{city.country}</p>
                    </div>
                    <div>
                      {getWeatherIcon(city.weatherCode, city.isDay)}
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    <p className="text-2xl font-light tracking-tighter text-slate-900 dark:text-white">
                      {city.temp !== undefined ? `${Math.round(city.temp)}°` : '--°'}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
                      <span>Inspect</span>
                      <ArrowUpRight size={10} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Dynamic Live Extremes based on coordinates */}
          {activeTab === 'dynamic' && extremes && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Hottest Dynamic */}
              <div 
                onClick={() => onSelectCity({
                  name: extremes.hottest.name,
                  country: extremes.hottest.country,
                  lat: extremes.hottest.lat,
                  lon: extremes.hottest.lon,
                  countryCode: extremes.hottest.countryCode
                })}
                className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 cursor-pointer transition-all flex flex-col justify-between min-h-[150px] shadow-sm group"
              >
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
                    <Flame size={18} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
                    Hottest Today
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-black text-rose-600 dark:text-rose-400">
                    {extremes.hottest.temp !== undefined ? `${Math.round(extremes.hottest.temp)}°C` : '--'}
                  </p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">{extremes.hottest.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Click to examine thermal grid</p>
                </div>
              </div>

              {/* Coldest Dynamic */}
              <div 
                onClick={() => onSelectCity({
                  name: extremes.coldest.name,
                  country: extremes.coldest.country,
                  lat: extremes.coldest.lat,
                  lon: extremes.coldest.lon,
                  countryCode: extremes.coldest.countryCode
                })}
                className="p-5 rounded-2xl border border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10 cursor-pointer transition-all flex flex-col justify-between min-h-[150px] shadow-sm group"
              >
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500">
                    <Snowflake size={18} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-500 bg-sky-500/10 px-2.5 py-0.5 rounded-full">
                    Coldest Today
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-black text-sky-600 dark:text-sky-400">
                    {extremes.coldest.temp !== undefined ? `${Math.round(extremes.coldest.temp)}°C` : '--'}
                  </p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">{extremes.coldest.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Click to examine subzero grid</p>
                </div>
              </div>

              {/* Windiest Dynamic */}
              <div 
                onClick={() => onSelectCity({
                  name: extremes.windiest.name,
                  country: extremes.windiest.country,
                  lat: extremes.windiest.lat,
                  lon: extremes.windiest.lon,
                  countryCode: extremes.windiest.countryCode
                })}
                className="p-5 rounded-2xl border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 cursor-pointer transition-all flex flex-col justify-between min-h-[150px] shadow-sm group"
              >
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-500">
                    <Wind size={18} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-500 bg-teal-500/10 px-2.5 py-0.5 rounded-full">
                    Windiest Today
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-black text-teal-600 dark:text-teal-400">
                    {extremes.windiest.windSpeed !== undefined ? `${Math.round(extremes.windiest.windSpeed)} km/h` : '--'}
                  </p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">{extremes.windiest.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Click to view atmospheric charts</p>
                </div>
              </div>

              {/* Most Humid Dynamic */}
              <div 
                onClick={() => onSelectCity({
                  name: extremes.mostHumid.name,
                  country: extremes.mostHumid.country,
                  lat: extremes.mostHumid.lat,
                  lon: extremes.mostHumid.lon,
                  countryCode: extremes.mostHumid.countryCode
                })}
                className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 cursor-pointer transition-all flex flex-col justify-between min-h-[150px] shadow-sm group"
              >
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Droplets size={18} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2.5 py-0.5 rounded-full">
                    Saturated Air
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {extremes.mostHumid.humidity !== undefined ? `${Math.round(extremes.mostHumid.humidity)}%` : '--'}
                  </p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">{extremes.mostHumid.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Click to inspect precipitation risk</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: All-Time Earth Records */}
          {activeTab === 'alltime' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HISTORIC_RECORDS.map((record) => (
                <div
                  key={record.category}
                  className={`p-5 rounded-2xl border bg-gradient-to-br ${record.bgGradient} flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
                      {record.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {record.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {record.location}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                        {record.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right sm:self-center">
                    <p className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                      {record.value}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400">{record.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
