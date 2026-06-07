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
        color: '#6C63FF',
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
        color: '#00D9A3',
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
        color: '#FFB347',
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
        color: '#FF6B9D',
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
        color: '#00D9A3',
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
        color: '#6C63FF',
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
        color: '#FFB347',
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
        color: '#6C63FF',
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
        color: '#FF6B9D',
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

// Amenity icon map
export const AMENITY_ICONS = {
  parking: '🅿️',
  restroom: '🚻',
  food: '🍽️',
};
