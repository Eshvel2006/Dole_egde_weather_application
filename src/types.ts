export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1_id?: number;
  admin2_id?: number;
  country_id?: number;
  country: string;
  admin1?: string;
  admin2?: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  humidity: number;
  apparentTemperature: number;
  isDay: boolean;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  humidity: number;
  weatherCode: number;
  uvIndex: number;
}

export interface DailyForecastItem {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  windSpeedMax: number;
}

export interface AirQuality {
  pm2_5: number;
  pm10: number;
  co: number;
  no2: number;
  so2: number;
  o3: number;
  aqi: number; // calculated US AQI or standard index
}

export interface WeatherData {
  city: string;
  country: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality: AirQuality;
}

export interface WeatherConditionDetails {
  label: string;
  iconName: string; // Used to match Lucide icons dynamically
  bgGradient: string; // Tailwind gradient classes
  themeColor: string; // Primary colored text/border for this weather
  animationType: 'sunny' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog' | 'night';
}
