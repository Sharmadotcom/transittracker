// ============================================================
// TransitTrack — Route & Stop Data
// Covers 3 Indian tier-2 cities with 3 routes each
// Waypoints auto-generated with slight curves for realism
// ============================================================

/**
 * Generates dense interpolated waypoints between stops.
 * Adds a subtle perpendicular sine-curve for visual realism.
 * @param {Array} stops - Array of stop objects with .lat and .lng
 * @param {number} n - Intermediate points between each pair of stops
 * @returns {{ waypoints: Array, stopIndices: Array }}
 */
function generateWaypoints(stops, n = 14) {
  const waypoints = [];
  const stopIndices = [];

  for (let i = 0; i < stops.length; i++) {
    stopIndices.push(waypoints.length);
    waypoints.push([stops[i].lat, stops[i].lng]);

    if (i < stops.length - 1) {
      const lat1 = stops[i].lat, lng1 = stops[i].lng;
      const lat2 = stops[i + 1].lat, lng2 = stops[i + 1].lng;

      for (let j = 1; j < n; j++) {
        const t = j / n;
        // Perpendicular offset produces a gentle S-curve
        const curve = Math.sin(t * Math.PI) * 0.00035;
        const dLat = lat2 - lat1, dLng = lng2 - lng1;
        waypoints.push([
          lat1 + dLat * t - dLng * curve,
          lng1 + dLng * t + dLat * curve,
        ]);
      }
    }
  }

  return { waypoints, stopIndices };
}

// ============================================================
// AMENITY ICONS — SVG icon references (no emoji)
// ============================================================
export const AMENITY_ICONS = {
  parking: `<svg class="amenity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 18V8h4a3 3 0 0 1 0 6H9"/></svg>`,
  restroom: `<svg class="amenity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`,
  food: `<svg class="amenity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
};

// ============================================================
// WEATHER SIMULATION DATA — realistic conditions per city
// ============================================================
export const WEATHER_DATA = {
  nashik: [
    { temp: 32, condition: 'sunny', label: 'Sunny', humidity: 45 },
    { temp: 28, condition: 'partly-cloudy', label: 'Partly Cloudy', humidity: 58 },
    { temp: 26, condition: 'cloudy', label: 'Overcast', humidity: 72 },
    { temp: 24, condition: 'rain', label: 'Light Rain', humidity: 85 },
    { temp: 30, condition: 'sunny', label: 'Clear', humidity: 40 },
  ],
  indore: [
    { temp: 35, condition: 'sunny', label: 'Hot & Sunny', humidity: 38 },
    { temp: 33, condition: 'partly-cloudy', label: 'Hazy', humidity: 50 },
    { temp: 29, condition: 'cloudy', label: 'Overcast', humidity: 65 },
    { temp: 27, condition: 'rain', label: 'Showers', humidity: 80 },
    { temp: 34, condition: 'sunny', label: 'Clear Skies', humidity: 42 },
  ],
  bhopal: [
    { temp: 31, condition: 'partly-cloudy', label: 'Warm', humidity: 52 },
    { temp: 28, condition: 'rain', label: 'Drizzle', humidity: 78 },
    { temp: 33, condition: 'sunny', label: 'Sunny', humidity: 44 },
    { temp: 26, condition: 'cloudy', label: 'Cloudy', humidity: 70 },
    { temp: 30, condition: 'sunny', label: 'Clear', humidity: 48 },
  ],
};

// Weather SVG icons
export const WEATHER_ICONS = {
  sunny: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  'partly-cloudy': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/></svg>`,
  cloudy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
  rain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><line x1="8" y1="21" x2="8" y2="23" opacity="0.5"/><line x1="12" y1="21" x2="12" y2="23" opacity="0.5"/><line x1="16" y1="21" x2="16" y2="23" opacity="0.5"/></svg>`,
};

// ============================================================
// CITY DATA
// ============================================================

const CITIES_RAW = {

  // ─── NASHIK ──────────────────────────────────────────────
  nashik: {
    id: 'nashik',
    name: 'Nashik',
    state: 'Maharashtra',
    center: [20.002, 73.780],
    zoom: 13,
    population: '1.5M',
    established: 1948,
    routes: [
      {
        id: 'N1',
        number: 'N1',
        name: 'Railway Station — Panchavati',
        color: '#6366f1',
        frequency: 12,
        fare: 10,
        speed: 22,
        busCount: 4,
        description: 'Main artery connecting the railway hub to the holy Panchavati ghats via CBS.',
        stops: [
          { id: 'NS1', name: 'Nashik Road Rly. Station', lat: 19.9979, lng: 73.7910, amenities: ['parking', 'restroom', 'food'] },
          { id: 'NS2', name: 'Sharanpur Road',           lat: 20.0008, lng: 73.7860, amenities: [] },
          { id: 'NS3', name: 'CBS Mahamarg',             lat: 20.0025, lng: 73.7822, amenities: ['restroom', 'food'] },
          { id: 'NS4', name: 'Canada Corner',            lat: 20.0055, lng: 73.7748, amenities: ['food'] },
          { id: 'NS5', name: 'Panchavati Circle',        lat: 20.0075, lng: 73.7635, amenities: ['restroom'] },
        ],
      },
      {
        id: 'N2',
        number: 'N2',
        name: 'Gangapur Road — CBS Loop',
        color: '#2dd4bf',
        frequency: 18,
        fare: 8,
        speed: 20,
        busCount: 3,
        description: 'Connects the northern residential Gangapur belt to the central bus stand.',
        stops: [
          { id: 'NS6', name: 'Gangapur Naka',   lat: 20.0195, lng: 73.7748, amenities: ['food'] },
          { id: 'NS7', name: 'Parijat Nagar',   lat: 20.0135, lng: 73.7738, amenities: [] },
          { id: 'NS8', name: 'Dwarka Circle',   lat: 20.0068, lng: 73.7730, amenities: [] },
          { id: 'NS3b', name: 'CBS Mahamarg',   lat: 20.0025, lng: 73.7822, amenities: ['restroom', 'food'] },
        ],
      },
      {
        id: 'N3',
        number: 'N3',
        name: 'Nashik Road — Satpur MIDC',
        color: '#f59e0b',
        frequency: 20,
        fare: 12,
        speed: 28,
        busCount: 3,
        description: 'Industrial shuttle connecting railway depot to the Satpur manufacturing zone.',
        stops: [
          { id: 'NS9',  name: 'Nashik Road Depot',   lat: 19.9979, lng: 73.7910, amenities: ['parking'] },
          { id: 'NS10', name: 'Deolali Gaon',         lat: 19.9880, lng: 73.7988, amenities: [] },
          { id: 'NS11', name: 'Satpur Colony',         lat: 19.9780, lng: 73.8118, amenities: ['food'] },
          { id: 'NS12', name: 'Satpur MIDC Gate',      lat: 19.9690, lng: 73.8270, amenities: ['parking', 'restroom'] },
        ],
      },
    ],
  },

  // ─── INDORE ──────────────────────────────────────────────
  indore: {
    id: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    center: [22.7310, 75.8760],
    zoom: 13,
    population: '3.3M',
    established: 1715,
    routes: [
      {
        id: 'I51',
        number: '51',
        name: 'Rajwada — Vijay Nagar',
        color: '#f472b6',
        frequency: 10,
        fare: 10,
        speed: 20,
        busCount: 5,
        description: 'Busiest corridor from the historic Rajwada palace to the commercial Vijay Nagar square.',
        stops: [
          { id: 'IS1', name: 'Rajwada',           lat: 22.7196, lng: 75.8577, amenities: ['restroom', 'food'] },
          { id: 'IS2', name: 'Khajuri Bazar',     lat: 22.7230, lng: 75.8645, amenities: [] },
          { id: 'IS3', name: 'Palasia Square',    lat: 22.7271, lng: 75.8735, amenities: ['food'] },
          { id: 'IS4', name: 'Geeta Bhawan',      lat: 22.7385, lng: 75.8842, amenities: [] },
          { id: 'IS5', name: 'Vijay Nagar Square', lat: 22.7518, lng: 75.8939, amenities: ['restroom', 'parking', 'food'] },
        ],
      },
      {
        id: 'I52',
        number: '52',
        name: 'LIG Square — MR-10',
        color: '#2dd4bf',
        frequency: 15,
        fare: 8,
        speed: 25,
        busCount: 3,
        description: 'East-west connector through residential and industrial corridors.',
        stops: [
          { id: 'IS6', name: 'LIG Square',     lat: 22.7333, lng: 75.8794, amenities: ['restroom'] },
          { id: 'IS7', name: 'Navlakha',       lat: 22.7390, lng: 75.8725, amenities: [] },
          { id: 'IS8', name: 'MR-9 Square',    lat: 22.7440, lng: 75.8655, amenities: [] },
          { id: 'IS9', name: 'MR-10 Square',   lat: 22.7490, lng: 75.8560, amenities: ['parking', 'food'] },
        ],
      },
      {
        id: 'I53',
        number: '53',
        name: 'Airport — Rajwada',
        color: '#6366f1',
        frequency: 25,
        fare: 15,
        speed: 32,
        busCount: 2,
        description: 'Express airport connector for passengers reaching the city center.',
        stops: [
          { id: 'IS10', name: 'Devi Ahilyabai Airport', lat: 22.7246, lng: 75.8014, amenities: ['restroom', 'parking', 'food'] },
          { id: 'IS11', name: 'Manik Bagh',             lat: 22.7228, lng: 75.8280, amenities: [] },
          { id: 'IS12', name: 'Sangam Nagar',           lat: 22.7210, lng: 75.8445, amenities: ['food'] },
          { id: 'IS1b', name: 'Rajwada',                lat: 22.7196, lng: 75.8577, amenities: ['restroom', 'food'] },
        ],
      },
    ],
  },

  // ─── BHOPAL ──────────────────────────────────────────────
  bhopal: {
    id: 'bhopal',
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    center: [23.2500, 77.4100],
    zoom: 13,
    population: '1.9M',
    established: 1707,
    routes: [
      {
        id: 'B1',
        number: 'B1',
        name: 'ISBT — New Market — MP Nagar',
        color: '#f59e0b',
        frequency: 12,
        fare: 10,
        speed: 22,
        busCount: 4,
        description: 'Spine route from ISBT through the commercial New Market to MP Nagar.',
        stops: [
          { id: 'BS1', name: 'ISBT Nadra Bus Stand', lat: 23.2899, lng: 77.3952, amenities: ['restroom', 'parking', 'food'] },
          { id: 'BS2', name: '10 No Market',          lat: 23.2601, lng: 77.4000, amenities: ['food'] },
          { id: 'BS3', name: 'Lal Ghati',             lat: 23.2480, lng: 77.4068, amenities: [] },
          { id: 'BS4', name: 'New Market',            lat: 23.2330, lng: 77.4117, amenities: ['restroom', 'food'] },
          { id: 'BS5', name: 'MP Nagar Z-1',          lat: 23.2330, lng: 77.4350, amenities: ['restroom', 'parking'] },
        ],
      },
      {
        id: 'B2',
        number: 'B2',
        name: 'Habibganj — DB Mall — Arera Colony',
        color: '#6366f1',
        frequency: 20,
        fare: 8,
        speed: 20,
        busCount: 3,
        description: 'South Bhopal route connecting the station to residential Arera Colony.',
        stops: [
          { id: 'BS6', name: 'Habibganj Station', lat: 23.2296, lng: 77.4356, amenities: ['restroom', 'parking'] },
          { id: 'BS7', name: 'Shahpura',          lat: 23.2200, lng: 77.4355, amenities: [] },
          { id: 'BS8', name: 'DB Mall',           lat: 23.2150, lng: 77.4350, amenities: ['restroom', 'food'] },
          { id: 'BS9', name: 'Arera Colony E-7',  lat: 23.2099, lng: 77.4349, amenities: [] },
        ],
      },
      {
        id: 'B3',
        number: 'B3',
        name: 'Bhopal Junction — TT Nagar',
        color: '#f472b6',
        frequency: 15,
        fare: 8,
        speed: 18,
        busCount: 3,
        description: 'Historic city route from Bhopal Junction to the government TT Nagar area.',
        stops: [
          { id: 'BS10', name: 'Bhopal Junction', lat: 23.2672, lng: 77.4122, amenities: ['restroom', 'parking', 'food'] },
          { id: 'BS11', name: 'Peer Gate',       lat: 23.2570, lng: 77.4090, amenities: [] },
          { id: 'BS12', name: 'Roshanpura',      lat: 23.2450, lng: 77.4065, amenities: ['food'] },
          { id: 'BS13', name: 'TT Nagar',        lat: 23.2326, lng: 77.4057, amenities: ['restroom'] },
        ],
      },
    ],
  },
};

// ─── POST-PROCESS: inject waypoints & stopIndices ────────────
Object.values(CITIES_RAW).forEach(city => {
  city.routes.forEach(route => {
    const result = generateWaypoints(route.stops);
    route.waypoints = result.waypoints;
    route.stopIndices = result.stopIndices;
  });
});

export default CITIES_RAW;
