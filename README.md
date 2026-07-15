# Skyline - Premium Meteorological SaaS Dashboard

Skyline is a production-ready, highly polished, and responsive Meteorological Dashboard styled like a premium SaaS product (e.g., Stripe, Vercel, Linear). Connecting directly to the high-resolution, open-source **Open-Meteo Weather & Geocoding API**, it provides live real-world weather metrics, forecasting indexes, and health reports with zero-config required.

---

## 🎨 Design Concept (Visual Identity)

- **Glassmorphism:** Generous usage of transparent white/slate panels, subtle border outlines, and advanced multi-layer backdrop blurs (`backdrop-blur-xl`).
- **Atmospheric Background Loops:** A fluid, animated backdrop that shifts colors and matches active weather codes (Sunny, Cloudy, Stormy, Rainy, Snowy, Foggy, Night) with ambient canvas or CSS particles.
- **Premium Typography:** Custom loaded Google Fonts pairing **Inter** (sans-serif) for general data density and **Space Grotesk** for display headers.
- **Micro-Interactions:** Micro-animated weather condition icons using physical spring parameters via Framer Motion.

---

## 🚀 Key Features

1. **Intelligent Location Autocomplete Search:**
   - Powered by Open-Meteo Geocoding API.
   - Debounced input field matching (400ms delay) to conserve bandwidth.
   - Saves history of the 5 most recent searches locally.
   - Displays history on focus if input is empty.

2. **One-Tap GPS Locate:**
   - Detects real-time coordinate offsets using browser GPS tracking.
   - Displays local data instantly.

3. **High-Resolution Metrics Card:**
   - Real-time digital clock display.
   - Displays temperature, feels-like, UV risk, air pressure, relative humidity, horizontal visibility, sunrise, and sunset times.

4. **WMO Meteorological Engine:**
   - Maps World Meteorological Organization weather codes to visual profiles, gradient classes, and icons.

5. **Hourly Timeline:**
   - Horizontal scrolling carousel of weather conditions for the next 24 hours.
   - Spotlights the current active hour in a glassy gradient.

6. **7-Day Outlook with Thermal Range Bars:**
   - Displays future predictions with custom min/max bounds.
   - Integrates **Apple-Weather style range sliders** visualizer showing relative daily ranges compared to the week's absolute limits.

7. **Air Quality Index Dial:**
   - Calculates the US Environmental Protection Agency standard PM2.5 AQI.
   - Visualizes detailed components (PM2.5, PM10, NO₂, SO₂) on safety bars.
   - Provides written health advice and action steps.

8. **Visual Theme Toggle:**
   - Allows users to switch between Light Mode and Dark Mode, with preferences persisted in `localStorage`.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 6
- **Styling:** Tailwind CSS v4 + Tailwind Vite plugin
- **State & Data Caching:** TanStack React Query v5 (Axios-driven async queries)
- **Animations:** Motion (Framer Motion v12+)
- **Icons:** Lucide React

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── AnimatedWeatherIcon.tsx  # Dynamic weather conditions animations
│   ├── AirQuality.tsx           # AQI dial, PM bars & EPA warnings
│   ├── ErrorState.tsx           # Stylized illustrations for failed query states
│   ├── Footer.tsx               # Powered-by citation footer
│   ├── ForecastCard.tsx         # Weekly row item with thermal range bars
│   ├── HourlyForecast.tsx       # 24-hour horizontal carousel timeline
│   ├── MetricCard.tsx           # Bento-grid metric highlights
│   ├── Navbar.tsx               # Top header with applet status & toggler
│   ├── SearchBar.tsx            # Autocomplete geocoding dropdown
│   ├── Skeleton.tsx             # Shimmer loader cards for pending states
│   └── WeatherBackground.tsx    # Live animated weather canvas/particle loops
├── hooks/
│   └── useWeatherPreferences.ts # Persists searches, coordinates, & active theme
├── services/
│   └── weatherAPI.ts            # Axios requests to Open-Meteo Forecast & Geocoding
├── utils/
│   └── weatherUtils.ts          # AQI scales, WMO converters, date formatters
├── App.tsx                      # Dashboard grid, query coordinator, context provider
├── main.tsx                     # React entry point
└── index.css                    # Font integrations, scrollbar styling, tailwind import
```

---

## 📦 Installation & Setup

1. **Clone or Extract the Workspace Files.**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Launch local dev server:**
   ```bash
   npm run dev
   ```
   The dev server will run on `http://localhost:3000`.

4. **Production Build:**
   ```bash
   npm run build
   ```
   Outputs production-ready static assets in `/dist`.

---

## 🔮 Future Improvements

- **Interactive Maps Integration:** Pinpointing coordinates directly via a leaflet/mapbox canvas.
- **Multilingual localization:** Auto-translating weather alerts and descriptors based on geographic locales.
- **Precipitation Radar:** Animating active rain radar tiles using real-time satellite imagery.
