import axios from 'axios';
import { GeocodingResult, WeatherData, CurrentWeather, HourlyForecastItem, DailyForecastItem, AirQuality } from '../types';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

/**
 * Search cities using Open-Meteo Geocoding API
 */
export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const response = await axios.get<{ results?: GeocodingResult[] }>(GEOCODING_BASE_URL, {
      params: {
        name: query,
        count: 8,
        language: 'en',
        format: 'json',
      },
    });
    return response.data.results || [];
  } catch (error) {
    console.error('Error searching cities:', error);
    throw new Error('Failed to search locations. Please check your internet connection.');
  }
}

/**
 * Fetch detailed weather and air quality for a given coordinate
 */
export async function fetchWeatherData(
  lat: number,
  lon: number,
  cityName: string,
  countryName: string,
  countryCode?: string
): Promise<WeatherData> {
  try {
    // Run forecast and air quality queries in parallel for peak performance
    const [forecastRes, aqRes] = await Promise.all([
      axios.get(FORECAST_BASE_URL, {
        params: {
          latitude: lat,
          longitude: lon,
          current: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'is_day',
            'precipitation',
            'rain',
            'showers',
            'snowfall',
            'weather_code',
            'cloud_cover',
            'pressure_msl',
            'wind_speed_10m',
            'wind_direction_10m',
            'uv_index',
          ].join(','),
          hourly: [
            'temperature_2m',
            'relative_humidity_2m',
            'weather_code',
            'uv_index',
          ].join(','),
          daily: [
            'weather_code',
            'temperature_2m_max',
            'temperature_2m_min',
            'apparent_temperature_max',
            'apparent_temperature_min',
            'sunrise',
            'sunset',
            'uv_index_max',
            'precipitation_sum',
            'wind_speed_10m_max',
          ].join(','),
          timezone: 'auto',
          forecast_hours: 24, // limit to 24 hourly items to keep response lightweight
        },
      }),
      axios.get(AIR_QUALITY_BASE_URL, {
        params: {
          latitude: lat,
          longitude: lon,
          current: [
            'pm2_5',
            'pm10',
            'carbon_monoxide',
            'nitrogen_dioxide',
            'sulphur_dioxide',
            'ozone',
          ].join(','),
        },
      }),
    ]);

    const forecastData = forecastRes.data;
    const aqData = aqRes.data;

    if (!forecastData || !forecastData.current) {
      throw new Error('Invalid response received from the weather service.');
    }

    // Parse Current Weather
    const current: CurrentWeather = {
      time: forecastData.current.time,
      temperature: forecastData.current.temperature_2m,
      humidity: forecastData.current.relative_humidity_2m,
      apparentTemperature: forecastData.current.apparent_temperature,
      isDay: forecastData.current.is_day === 1,
      precipitation: forecastData.current.precipitation,
      rain: forecastData.current.rain,
      showers: forecastData.current.showers,
      snowfall: forecastData.current.snowfall,
      weatherCode: forecastData.current.weather_code,
      cloudCover: forecastData.current.cloud_cover,
      pressure: forecastData.current.pressure_msl,
      windSpeed: forecastData.current.wind_speed_10m,
      windDirection: forecastData.current.wind_direction_10m,
      uvIndex: forecastData.current.uv_index ?? 0,
    };

    // Parse Hourly Forecast
    const hourly: HourlyForecastItem[] = [];
    if (forecastData.hourly && forecastData.hourly.time) {
      const hCount = Math.min(forecastData.hourly.time.length, 24);
      for (let i = 0; i < hCount; i++) {
        hourly.push({
          time: forecastData.hourly.time[i],
          temperature: forecastData.hourly.temperature_2m[i],
          humidity: forecastData.hourly.relative_humidity_2m[i],
          weatherCode: forecastData.hourly.weather_code[i],
          uvIndex: forecastData.hourly.uv_index ? forecastData.hourly.uv_index[i] : 0,
        });
      }
    }

    // Parse Daily Forecast
    const daily: DailyForecastItem[] = [];
    if (forecastData.daily && forecastData.daily.time) {
      const dCount = forecastData.daily.time.length;
      for (let i = 0; i < dCount; i++) {
        daily.push({
          date: forecastData.daily.time[i],
          weatherCode: forecastData.daily.weather_code[i],
          tempMax: forecastData.daily.temperature_2m_max[i],
          tempMin: forecastData.daily.temperature_2m_min[i],
          apparentTempMax: forecastData.daily.apparent_temperature_max[i],
          apparentTempMin: forecastData.daily.apparent_temperature_min[i],
          sunrise: forecastData.daily.sunrise[i],
          sunset: forecastData.daily.sunset[i],
          uvIndexMax: forecastData.daily.uv_index_max ? forecastData.daily.uv_index_max[i] : 0,
          precipitationSum: forecastData.daily.precipitation_sum[i],
          windSpeedMax: forecastData.daily.wind_speed_10m_max[i],
        });
      }
    }

    // Parse Air Quality (default values if missing)
    const currentAQ = aqData.current || {};
    const airQuality: AirQuality = {
      pm2_5: currentAQ.pm2_5 ?? 5.0,
      pm10: currentAQ.pm10 ?? 12.0,
      co: currentAQ.carbon_monoxide ?? 250.0,
      no2: currentAQ.nitrogen_dioxide ?? 15.0,
      so2: currentAQ.sulphur_dioxide ?? 2.0,
      o3: currentAQ.ozone ?? 40.0,
      aqi: 0, // will be parsed/calculated in details helper
    };

    return {
      city: cityName,
      country: countryName,
      countryCode,
      latitude: lat,
      longitude: lon,
      current,
      hourly,
      daily,
      airQuality,
    };
  } catch (error: any) {
    console.error('Error fetching weather data:', error);
    const message = error.response?.data?.reason || error.message || 'Unknown network error';
    throw new Error(`Failed to fetch weather forecast: ${message}`);
  }
}
