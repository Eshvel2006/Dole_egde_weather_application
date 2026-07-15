import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Loader2, History, Compass } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { searchCities } from '../services/weatherAPI';
import { GeocodingResult } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SearchBarProps {
  onSelectCity: (city: { name: string; country: string; lat: number; lon: number; countryCode?: string }) => void;
  recentSearches: GeocodingResult[];
  addRecentSearch: (city: GeocodingResult) => void;
  clearRecentSearches: () => void;
}

export function SearchBar({ onSelectCity, recentSearches, addRecentSearch, clearRecentSearches }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Geocoding Autocomplete Query
  const { data: suggestions = [], isLoading, isError } = useQuery<GeocodingResult[]>({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchCities(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 1000 * 60 * 5, // cache autocomplete results for 5 mins
  });

  const handleSelect = (item: GeocodingResult) => {
    onSelectCity({
      name: item.name,
      country: item.country,
      lat: item.latitude,
      lon: item.longitude,
      countryCode: item.country_code,
    });
    addRecentSearch(item);
    setQuery('');
    setIsOpen(false);
  };

  // Geo-location search
  const [gpsLoading, setGpsLoading] = useState(false);
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (!response.ok) throw new Error('Reverse geocode failed');
          const data = await response.json();
          
          const cityName = data.city || data.locality || data.principalSubdivision || 'Your Location';
          const countryName = data.countryName || 'GPS Coordinates';
          const countryCode = data.countryCode || '';

          onSelectCity({
            name: cityName,
            country: countryName,
            lat: latitude,
            lon: longitude,
            countryCode: countryCode,
          });
        } catch (error) {
          console.warn('Reverse geocode on GPS button click failed, falling back to coordinates:', error);
          onSelectCity({
            name: 'Your Location',
            country: 'GPS Coordinates',
            lat: latitude,
            lon: longitude,
          });
        } finally {
          setGpsLoading(false);
          setIsOpen(false);
        }
      },
      (error) => {
        console.error('GPS Geolocation Error:', error);
        setGpsLoading(false);
      }
    );
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions && suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div ref={dropdownRef} className="relative w-full max-w-lg z-30">
      <form onSubmit={handleFormSubmit} className="relative w-full">
        <div className="relative flex items-center w-full h-12 rounded-full bg-white/10 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500">
          <div className="pl-4 text-slate-400 dark:text-slate-300">
            <Search size={18} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search for cities..."
            className="w-full h-full px-3 bg-transparent text-sm font-sans font-medium text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none"
          />

          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={handleClear}
                className="p-1 mr-1 text-slate-400 hover:text-slate-200 dark:hover:text-white rounded-full hover:bg-white/10"
              >
                <X size={16} />
              </motion.button>
            )}
          </AnimatePresence>

          <span className="w-px h-6 bg-slate-200 dark:bg-slate-800" />

          {/* GPS Location Button */}
          <button
            type="button"
            onClick={handleGeolocation}
            disabled={gpsLoading}
            title="Use current GPS location"
            className="p-2 mx-1 text-indigo-400 hover:text-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            {gpsLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Compass size={18} />
            )}
          </button>

          {/* Search Button */}
          <button
            type="submit"
            className="h-full px-5 rounded-r-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold tracking-wide shadow-md transition-all active:scale-[0.98]"
          >
            Search
          </button>
        </div>
      </form>

      {/* Dropdown for Autocomplete Suggestions and Recent Searches */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 right-0 mt-2 p-2 rounded-[24px] bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center justify-center py-4 text-slate-500 text-xs font-medium gap-2">
                <Loader2 className="animate-spin text-indigo-500" size={16} />
                <span>Searching locations...</span>
              </div>
            )}

            {/* Suggestions List */}
            {!isLoading && query.trim().length >= 2 && suggestions.length > 0 && (
              <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Locations Found
                </div>
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="flex items-center w-full px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors text-left group"
                  >
                    <MapPin size={15} className="mr-2 text-indigo-500 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {item.admin1 ? `${item.admin1}, ` : ''}
                        {item.country}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results Found */}
            {!isLoading && query.trim().length >= 2 && suggestions.length === 0 && (
              <div className="py-4 text-center text-slate-500 text-xs font-medium">
                No locations found matching "{query}"
              </div>
            )}

            {/* Recent Searches (Show when input is empty or less than 2 characters) */}
            {query.trim().length < 2 && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between px-3 py-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <History size={10} />
                    Recent Searches
                  </span>
                  {recentSearches.length > 0 && (
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-[10px] font-semibold text-rose-500 dark:text-rose-400 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {recentSearches.length > 0 ? (
                  recentSearches.map((item) => (
                    <button
                      key={`recent-${item.id}`}
                      onClick={() => handleSelect(item)}
                      className="flex items-center w-full px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors text-left group"
                    >
                      <MapPin size={14} className="mr-2 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 group-hover:scale-110 transition-all" />
                      <div>
                        <span className="text-xs font-semibold text-slate-800 dark:text-white mr-1">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {item.country}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-3 text-center text-slate-400 dark:text-slate-500 text-xs font-medium">
                    Your search history is empty.
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
