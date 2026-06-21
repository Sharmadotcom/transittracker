# TransitTrack 🚌✨

**TransitTrack** is a high-fidelity, real-time public bus tracking Progressive Web App (PWA) tailored for municipal transit agencies in tier-2 Indian cities (**Nashik**, **Indore**, and **Bhopal**). 

The app features an interactive live map, an advanced telemetry/GPS simulation engine, commuter tools (trip planning, ticket booking), a low-bandwidth accessible mode, and operational analytics. It is built using clean modern semantic HTML, custom HSL design tokens in vanilla CSS, and modular vanilla JavaScript.

---

## 🚀 Key Features

### 📍 Live Map & Telemetry Simulation
- **Leaflet.js Map Integration:** Real-time updates of buses moving along color-coded route tracks. Supports multiple styles: *Dark Transit*, *Standard Streets*, and *Satellite View*, alongside toggleable traffic congestion overlays.
- **GPS Simulation Engine:** The custom [BusTracker](file:///c:/Study/Projects/transittrack/simulation/tracker.js#L7) class calculates precise, speed-based bus movements along complex path curves using the **Haversine formula**.
- **Dynamic ETAs & Rotation:** Evaluates exact distances to upcoming stops to update countdown timers and applies compass bearings to rotate bus markers smoothly.
- **Stop Facilities Departure Board:** Interactive stops containing facility info (parking, food, restrooms) and real-time departure boards.

### 📶 Low-Bandwidth Mode (Low-BW)
- Switches off heavy map rendering and image tile loading.
- Replaces the visual UI with an extremely lightweight, high-performance text-based departures/arrivals board. Optimized for standard 2G/3G network conditions common during commutes.

### 🎫 Commuter Companion Tools
- **Trip Planner:** Input origin and destination stops to find routes linking them.
- **Digital Ticketing Pass:** Calculate fares based on route segments, choose a mock UPI payment gateway (Google Pay, PhonePe, Paytm), authorize a simulated checkout, and retrieve an active digital pass complete with a scannable Canvas QR code.
- **Live Service Alerts:** Dynamic announcement tickers for operational deviations and active delays.
- **Favorites:** One-click saving of frequently visited stops and routes for immediate lookup.

### 📊 Operations Analytics
- Visualizes real-time performance indices, operational speeds, transit delays, and estimated daily CO2 savings.
- Includes custom SVG infographics mapping hourly congestion profiles and bar charts depicting route headway adherence.

### 💡 Interactive Onboarding & Access
- **Interactive Tour:** Step-by-step guided onboarding to walk new commuters through features.
- **Keyboard Shortcuts:** Enhanced accessibility with keyboard shortcuts:
  - `1`: Routes Tab
  - `2`: Live Buses Tab
  - `3`: Trip Planner Tab
  - `4`: Service Alerts Tab
  - `/`: Focus Search Input
  - `Esc`: Close Current Panel
  - `F`: Toggle Favorites
  - `?`: Show Keyboard Shortcuts Dialog

---

## 📂 File Architecture

The repository is modularly structured as follows:

*   [index.html](file:///c:/Study/Projects/transittrack/index.html): Main application layout, sidebar panel controls, analytical widgets, FAQ forms, onboarding dialogs, and SVG icon repositories.
*   [index.css](file:///c:/Study/Projects/transittrack/index.css): Modern CSS stylesheet outlining custom design variables (HSL palette, typography, glassmorphism, responsive grid sheets, animations, and dark-theme configurations).
*   [app.js](file:///c:/Study/Projects/transittrack/app.js): Application bootstrapper. Manages UI event handlers, Leaflet map initializations, DOM rendering lifecycle, and local storage configurations.
*   [data/routes.js](file:///c:/Study/Projects/transittrack/data/routes.js): Contains geographic coordinates and properties for stops across all three municipal corridors:
    - **Nashik (NMPML):** Satpur MIDC, Gangapur Road, Panchavati.
    - **Indore (AiCTSL):** Rajwada Palace, Vijay Nagar, Airport corridors.
    - **Bhopal (BCLL):** ISBT Nadra, Habibganj Station, TT Nagar.
    - Includes the [generateWaypoints](file:///c:/Study/Projects/transittrack/data/routes.js#L14) function which interpolates dense intermediate coordinates using sine-curve math for realistic bus tracking.
*   [simulation/tracker.js](file:///c:/Study/Projects/transittrack/simulation/tracker.js): Houses the [BusTracker](file:///c:/Study/Projects/transittrack/simulation/tracker.js#L7) class, the telemetry simulator updating active coordinates, speeds, crowd profiles, and transit statuses every 2 seconds.
*   [sw.js](file:///c:/Study/Projects/transittrack/sw.js): PWA service worker configuring offline cache storage (`transittrack-v3`) and caching strategies for asset loading.
*   [manifest.json](file:///c:/Study/Projects/transittrack/manifest.json): PWA manifest specifying theme coloring, standalone modes, and startup attributes.

---

## 🛠️ Technology Stack
- **Structure:** Semantic HTML5
- **Styling:** Custom CSS Grid/Flexbox, HSL variables, transitions
- **Map Rendering:** [Leaflet.js](https://leafletjs.com/) (OpenStreetMap API)
- **Logistics Logic:** Vanilla JavaScript (ES6 Modules)
- **Offline / PWA Capability:** Service Worker, Cache Storage API, Web Manifest
- **Icons:** Inline SVG vectors

---

## 🏃 Running the Application Locally

Since TransitTrack is built entirely on native web standards with ES Modules, running it locally requires a simple static file server.

### Option 1: Using VS Code Live Server
1. Install the **Live Server** extension.
2. Open the project root folder.
3. Click **Go Live** in the status bar.

### Option 2: Using Node.js (npx)
Run any of the following command lines in the root workspace directory:
```bash
# Serve using local static server
npx serve .

# Or using live-server
npx live-server
```

### Option 3: Using Python
If you have Python installed, run:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.
