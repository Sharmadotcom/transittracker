// ============================================================
// TransitTrack — Main App Controller v2
// Orchestrates: Map, simulation, trip planner, favorites,
// weather, particle canvas, keyboard shortcuts, premium features
// ============================================================

import CITIES, { AMENITY_ICONS, WEATHER_DATA, WEATHER_ICONS } from './data/routes.js';
import { BusTracker } from './simulation/tracker.js';

// ── TRANSLATIONS DATA ────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    logoTrack: "Track",
    allRoutes: "Routes",
    activeBuses: "Live Buses",
    planYourTrip: "Trip Planner",
    tickets: "Tickets",
    alerts: "Alerts",
    allRoutesLabel: "All Routes",
    activeBusesLabel: "Active Buses",
    planYourTripLabel: "Plan Your Trip",
    bookTransitPassLabel: "Book Transit Pass",
    serviceAlertsLabel: "Service Alerts",
    fromLabel: "From",
    toLabel: "To",
    findRoutesBtn: "Find Routes",
    selectRouteLabel: "Select Route",
    fromStopLabel: "From Stop",
    toStopLabel: "To Stop",
    estFareLabel: "Estimated Fare:",
    bookPassBtnLabel: "Book Digital Pass",
    passengerLabel: "Passenger",
    routeLabel: "Route",
    fromStopPass: "From",
    toStopPass: "To",
    dateLabel: "Date",
    farePaidLabel: "Fare Paid",
    cancelPassBtn: "Cancel Pass",
    departureBoardLabel: "Departure Board (Live ETAs)",
    stopFacilitiesLabel: "Stop Facilities",
    statusLabel: "Status",
    speedLabel: "Speed",
    busIdLabel: "Bus ID",
    fareLabel: "Fare",
    routeProgressLabel: "Route Progress",
    nextStopLabel: "Next Stop",
    lowCrowdLabel: "Low crowd",
    modCrowdLabel: "Moderate crowd",
    highCrowdLabel: "High crowd",
    arrivingNowLabel: "Arriving now",
    arrivingInLabel: "Arrives in",
    noBusesHeadingLabel: "No buses heading here shortly",
    nextBusInLabel: "Next bus in",
    lowBwModeBadge: "Low-BW Mode",
    activePill: "active",
    onTimePill: "on-time",
    savedLabel: "Saved",
    searchPlaceholder: "Search routes, stops…",
    trafficBtn: "Traffic",
    upiTitle: "Select UPI App",
    gpay: "Google Pay",
    phonepe: "PhonePe",
    paytm: "Paytm UPI",
    waitingChoice: "Waiting for choice...",
    cancelPaymentBtn: "Cancel Payment",
    tourWelcomeTitle: "Welcome to TransitTrack",
    tourWelcomeBody: "Track live buses, find routes, book passes and navigate Indian tier-2 cities seamlessly.",
    tourSearchTitle: "Smart Transit Search",
    tourSearchBody: "Use the search bar or press '/' key to look up any routes, stops, or cities instantly.",
    tourMapTitle: "Interactive Live Map",
    tourMapBody: "Switch between Dark Transit, Streets, or Satellite overlays and check traffic congestion.",
    tourDeparturesTitle: "Live Departures & Seats",
    tourDeparturesBody: "Click any stop to view live countdown ETAs, or click a bus to inspect seat occupancy.",
    tourPassTitle: "Digital Ticketing",
    tourPassBody: "Book digital transit passes, simulate UPI payments and generate canvas QR tickets instantly.",
    navMap: "Live Map",
    navAnalytics: "Analytics",
    navSupport: "Support",
    navAbout: "About",
    analyTitle: "Transit Analytics Dashboard",
    analySubtitle: "Real-time scheduling adherence and route logistics metrics.",
    lblSpeed: "Average Operational Speed",
    lblDelay: "Average Route Delay",
    lblReliability: "Reliability Index",
    lblEmissions: "CO2 Offset Today",
    lblCongestion: "Hourly Congestion Profile",
    lblHeadway: "Route Headway Adherence",
    faqTitle: "Frequently Asked Questions",
    feedbackTitle: "Submit Feedback / Report Delay",
    lblSubject: "Subject",
    lblName: "Your Name",
    lblMsg: "Details / Description",
    aboutTitle: "TransitTrack Smart Commuting",
    aboutSubtitle: "Pioneering real-time municipal logistics tracking for Indian metropolitan transit agencies.",
    aboutEcoSavings: "Simulated Carbon Savings"
  },
  hi: {
    logoTrack: "ट्रैक",
    allRoutes: "मार्ग",
    activeBuses: "लाइव बसें",
    planYourTrip: "यात्रा योजना",
    tickets: "टिकट",
    alerts: "अलर्ट",
    allRoutesLabel: "सभी मार्ग",
    activeBusesLabel: "सक्रिय बसें",
    planYourTripLabel: "अपनी यात्रा की योजना बनाएं",
    bookTransitPassLabel: "पास बुक करें",
    serviceAlertsLabel: "सेवा अलर्ट",
    fromLabel: "कहाँ से",
    toLabel: "कहाँ तक",
    findRoutesBtn: "मार्ग खोजें",
    selectRouteLabel: "मार्ग चुनें",
    fromStopLabel: "शुरुआती स्टॉप",
    toStopLabel: "गंतव्य स्टॉप",
    estFareLabel: "अनुमानित किराया:",
    bookPassBtnLabel: "डिजिटल पास बुक करें",
    passengerLabel: "यात्री",
    routeLabel: "मार्ग",
    fromStopPass: "प्रस्थान",
    toStopPass: "गंतव्य",
    dateLabel: "तिथि",
    farePaidLabel: "भुगतान किया",
    cancelPassBtn: "पास रद्द करें",
    departureBoardLabel: "लाइव आगमन बोर्ड (ETAs)",
    stopFacilitiesLabel: "स्टॉप सुविधाएं",
    statusLabel: "स्थिति",
    speedLabel: "गति",
    busIdLabel: "बस आईडी",
    fareLabel: "किराया",
    routeProgressLabel: "मार्ग प्रगति",
    nextStopLabel: "अगला स्टॉप",
    lowCrowdLabel: "कम भीड़",
    modCrowdLabel: "मध्यम भीड़",
    highCrowdLabel: "अधिक भीड़",
    arrivingNowLabel: "अभी आ रही है",
    arrivingInLabel: "आगमन",
    noBusesHeadingLabel: "जल्द ही कोई बस नहीं आ रही है",
    nextBusInLabel: "अगली बस",
    lowBwModeBadge: "कम बैंडविड्थ",
    activePill: "सक्रिय",
    onTimePill: "समय पर",
    savedLabel: "सहेजें",
    searchPlaceholder: "मार्ग, स्टॉप खोजें…",
    trafficBtn: "यातायात",
    upiTitle: "UPI ऐप चुनें",
    gpay: "गूगल पे",
    phonepe: "फ़ोन पे",
    paytm: "पेटीएम UPI",
    waitingChoice: "विकल्प चुनने की प्रतीक्षा है...",
    cancelPaymentBtn: "भुगतान रद्द करें",
    tourWelcomeTitle: "ट्रांजिटट्रैक में आपका स्वागत है",
    tourWelcomeBody: "लाइव बसों को ट्रैक करें, मार्ग ढूंढें, पास बुक करें और भारतीय शहरों में यात्रा आसान बनाएं।",
    tourSearchTitle: "स्मार्ट ट्रांजिट खोज",
    tourSearchBody: "किसी भी मार्ग, स्टॉप या शहर को खोजने के लिए खोज बार का उपयोग करें या '/' दबाएं।",
    tourMapTitle: "इंटरएक्टिव लाइव मैप",
    tourMapBody: "डार्क ट्रांजिट, सामान्य सड़कों या सैटेलाइट मैप में बदलें और लाइव यातायात देखें।",
    tourDeparturesTitle: "लाइव आगमन और सीटें",
    tourDeparturesBody: "लाइव आगमन देखने के लिए स्टॉप पर क्लिक करें या सीटों की स्थिति देखने के लिए बस पर क्लिक करें।",
    tourPassTitle: "डिजिटल टिकटिंग",
    tourPassBody: "डिजिटल ट्रांजिट पास बुक करें, UPI भुगतान करें और तत्काल QR कोड टिकट बनाएं।",
    navMap: "लाइव मैप",
    navAnalytics: "विश्लेषण",
    navSupport: "सहायता",
    navAbout: "हमारे बारे में",
    analyTitle: "ट्रांजिट विश्लेषण डैशबोर्ड",
    analySubtitle: "वास्तविक समय समय सारणी अनुपालन और मार्ग रसद मीट्रिक।",
    lblSpeed: "औसत परिचालन गति",
    lblDelay: "औसत मार्ग विलंब",
    lblReliability: "विश्वसनीयता सूचकांक",
    lblEmissions: "कार्बन उत्सर्जन बचत आज",
    lblCongestion: "प्रति घंटा यातायात प्रोफाइल",
    lblHeadway: "मार्ग हेडवे अनुपालन",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    feedbackTitle: "प्रतिक्रिया सबमिट करें / देरी की रिपोर्ट करें",
    lblSubject: "विषय",
    lblName: "आपका नाम",
    lblMsg: "विवरण / स्पष्टीकरण",
    aboutTitle: "ट्रांजिटट्रैक स्मार्ट आवागमन",
    aboutSubtitle: "भारतीय महानगरीय परिवहन एजेंसियों के लिए वास्तविक समय रसद ट्रैकिंग।",
    aboutEcoSavings: "सिम्युलेटेड कार्बन बचत"
  },
  mr: {
    logoTrack: "ट्रॅक",
    allRoutes: "मार्ग",
    activeBuses: "लाइव्ह बसेस",
    planYourTrip: "प्रवास नियोजन",
    tickets: "तिकीट",
    alerts: "अलर्ट",
    allRoutesLabel: "सर्व मार्ग",
    activeBusesLabel: "सक्रिय बसेस",
    planYourTripLabel: "प्रवासाचे नियोजन करा",
    bookTransitPassLabel: "पास बुक करा",
    serviceAlertsLabel: "सेवा अलर्ट",
    fromLabel: "कुठून",
    toLabel: "कुठे",
    findRoutesBtn: "मार्ग शोधा",
    selectRouteLabel: "मार्ग निवडा",
    fromStopLabel: "सुरूवातीचे थांबा",
    toStopLabel: "शेवटचा थांबा",
    estFareLabel: "अंदाजे भाडे:",
    bookPassBtnLabel: "डिजिटल पास बुक करा",
    passengerLabel: "प्रवासी",
    routeLabel: "मार्ग",
    fromStopPass: "प्रस्थान",
    toStopPass: "गंतव्य",
    dateLabel: "तारीख",
    farePaidLabel: "भरलेले भाडे",
    cancelPassBtn: "पास रद्द करा",
    departureBoardLabel: "वेळापत्रक (आगमन)",
    stopFacilitiesLabel: "थांबा सुविधा",
    statusLabel: "स्थिती",
    speedLabel: "वेग",
    busIdLabel: "बस आयडी",
    fareLabel: "भाडे",
    routeProgressLabel: "मार्ग प्रगती",
    nextStopLabel: "पुढील थांबा",
    lowCrowdLabel: "कमी गर्दी",
    modCrowdLabel: "मध्यम गर्दी",
    highCrowdLabel: "जास्त गर्दी",
    arrivingNowLabel: "आता येत आहे",
    arrivingInLabel: "येईल",
    noBusesHeadingLabel: "लवकरच कोणतीही बस येत नाही",
    nextBusInLabel: "पुढील बस",
    lowBwModeBadge: "कमी बँडविड्थ",
    activePill: "सक्रिय",
    onTimePill: "वेळेवर",
    savedLabel: "साठवले",
    searchPlaceholder: "मार्ग, थांबा शोधा…",
    trafficBtn: "वाहतूक",
    upiTitle: "UPI ॲप निवडा",
    gpay: "गुगल पे",
    phonepe: "फोन पे",
    paytm: "पेटीएम UPI",
    waitingChoice: "निवडीची प्रतीक्षा आहे...",
    cancelPaymentBtn: "पेमेंट रद्द करा",
    tourWelcomeTitle: "ट्रान्झिटट्रॅक मध्ये आपले स्वागत आहे",
    tourWelcomeBody: "थेट बसेस ट्रॅक करा, मार्ग शोधा, पास बुक करा आणि भारतीय शहरांमध्ये सहज प्रवास करा.",
    tourSearchTitle: "स्मार्ट ट्रान्झिट शोध",
    tourSearchBody: "कोणताही मार्ग, थांबा किंवा शहर शोधण्यासाठी शोध पट्टी वापरा किंवा '/' की दाबा.",
    tourMapTitle: "परस्परसंवादी थेट नकाशा",
    tourMapBody: "डार्क ट्रान्झिट, रस्ते किंवा उपग्रह नकाशे बदला आणि थेट रहदारी तपासा.",
    tourDeparturesTitle: "थेट आगमन आणि जागा",
    tourDeparturesBody: "थेट आगमन पाहण्यासाठी थांब्यावर क्लिक करा किंवा बसमधील जागांची स्थिती पाहण्यासाठी बसवर क्लिक करा.",
    tourPassTitle: "डिजिटल तिकीट",
    tourPassBody: "थेट डिजिटल पास बुक करा, UPI पेमेंट करा आणि तात्काळ QR तिकीट तयार करा.",
    navMap: "थेट नकाशा",
    navAnalytics: "विश्लेषण",
    navSupport: "मदत",
    navAbout: "माहिती",
    analyTitle: "प्रवास विश्लेषण डॅशबोर्ड",
    analySubtitle: "थेट वेळेचे वेळापत्रक पालन आणि मार्ग लॉजिस्टिक आकडेवारी.",
    lblSpeed: "सरासरी वेग",
    lblDelay: "सरासरी मार्ग विलंब",
    lblReliability: "विश्वसनीयता निर्देशांक",
    lblEmissions: "आजची कार्बन उत्सर्जन बचत",
    lblCongestion: "ताशी रहदारी प्रोफाइल",
    lblHeadway: "मार्ग वेळापत्रक पालन",
    faqTitle: "नेहमी विचारले जाणारे प्रश्न",
    feedbackTitle: "अभिप्राय सबमिट करा / विलंबाची नोंद करा",
    lblSubject: "विषय",
    lblName: "तुमचे नाव",
    lblMsg: "तपशील / वर्णन",
    aboutTitle: "ट्रान्झिटट्रॅक स्मार्ट प्रवास",
    aboutSubtitle: "भारतीय शहर परिवहन संस्थांसाठी थेट लॉजिस्टिक ट्रॅकिंग.",
    aboutEcoSavings: "कार्बन उत्सर्जनातील बचत"
  }
};

// ── Constants ────────────────────────────────────────────────
const CROWD_LABELS = ['Low crowd', 'Moderate crowd', 'High crowd'];
const STATUS_LABELS = { moving: 'Moving', 'at-stop': 'At stop', delayed: 'Delayed' };
const ALERTS = [
  'Route N1 — Minor delays at CBS due to road work. Expected clearance: 6:00 PM',
  'Route I51 — Bus frequency increased to every 8 min during peak hours (5–8 PM)',
  'Route B1 — Temporary detour via Lal Ghati until further notice',
  'All routes — Diwali special service extended till midnight on 1st Nov',
  'Route N3 — Satpur MIDC stop temporarily shifted 200m east',
  'City-wide — 3 new electric buses added to service from Monday',
];

// SVG icon helpers (no emoji)
const ICONS = {
  bus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="22" height="16" rx="3"/><path d="M1 10h22"/><circle cx="7" cy="21" r="2"/><circle cx="17" cy="21" r="2"/></svg>`,
  stop: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`,
  city: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6"/><line x1="15" y1="6" x2="15" y2="6"/><line x1="9" y1="10" x2="9" y2="10"/><line x1="15" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="9" y2="14"/><line x1="15" y1="14" x2="15" y2="14"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  starFill: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  arrow: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`,
  walking: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="2"/><path d="M10 22l2-7 3 3v6"/><path d="M14 13l-3-3-3 6"/></svg>`,
};

// ── TransitApp ───────────────────────────────────────────────
class TransitApp {
  constructor() {
    this.map = null;
    this.tracker = new BusTracker();
    this.currentCityId = 'nashik';
    this.selectedBusId = null;
    this.activeRouteId = null;
    this.lowBandwidth = false;
    this.unsubscribe = null;

    this.currentLanguage = 'en';
    this.activePass = null;
    this.trafficOverlayActive = false;
    this.mapTheme = 'dark';
    this.tourStep = 0;
    this.tileLayers = {};

    /** @type {Map<string, L.Marker>} */
    this.busMarkers = new Map();
    /** @type {Map<string, { from: L.LatLng, to: L.LatLng, startTs: number }>} */
    this.animations = new Map();

    /** @type {Map<string, L.Polyline>} */
    this.routeLines = new Map();
    /** @type {Map<string, L.CircleMarker>} */
    this.stopCircles = new Map();

    /** @type {Map<string, BusState>} Holds latest snapshot keyed by id */
    this.busState = new Map();

    this._rafId = null;
    this._animActive = false;

    // Favorites stored in localStorage
    this.favorites = this._loadFavorites();

    // Weather state
    this.weatherIdx = 0;
    this._weatherInterval = null;

    // Particle canvas
    this.particles = [];
    this._particleRafId = null;
  }

  // ── Initialization ───────────────────────────────────────

  async init() {
    this.initMap();
    this.initUI();
    this.initKeyboardShortcuts();
    this.loadCity(this.currentCityId);
    this.startClock();
    this.buildTicker();
    this.startWeather();
    this.renderFavorites();
    this.startEcoSavingsCounter();

    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('./sw.js');
      } catch (_) { /* ignore in file:// */ }
    }

    // Hide loading screen
    setTimeout(() => {
      const lo = document.getElementById('loading-overlay');
      lo.classList.add('hidden');
      setTimeout(() => lo.remove(), 400);
    }, 800);
  }

  // ── Map Setup ────────────────────────────────────────────

  initMap() {
    const city = CITIES[this.currentCityId];
    this.map = L.map('map', {
      center: city.center,
      zoom: city.zoom,
      zoomControl: false,
      attributionControl: true,
    });

    this.tileLayers = {
      dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
      }),
      light: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }),
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19
      })
    };

    // Add default theme
    this.tileLayers[this.mapTheme].addTo(this.map);
    this.map.getContainer().classList.add('dark-map');

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Close bus card when clicking map
    this.map.on('click', () => this.hideBusCard());

    // Start particle canvas
    this.initParticleCanvas();
  }

  // ── Particle Canvas ─────────────────────────────────────

  initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resize();
    window.addEventListener('resize', resize);

    this._particleCtx = ctx;
    this._particleCanvas = canvas;
    this._startParticleLoop();
  }

  _spawnParticles() {
    const city = CITIES[this.currentCityId];
    if (!city || !this.map) return;

    // Spawn particles along route waypoints
    city.routes.forEach(route => {
      if (Math.random() > 0.15) return; // don't spam
      const wps = route.waypoints;
      const startIdx = Math.floor(Math.random() * (wps.length - 1));
      const start = this.map.latLngToContainerPoint(L.latLng(wps[startIdx]));
      const end = this.map.latLngToContainerPoint(L.latLng(wps[Math.min(startIdx + 3, wps.length - 1)]));

      this.particles.push({
        x: start.x,
        y: start.y,
        tx: end.x,
        ty: end.y,
        progress: 0,
        speed: 0.005 + Math.random() * 0.01,
        color: route.color,
        size: 1.5 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.4,
      });
    });

    // Cap particles
    if (this.particles.length > 100) {
      this.particles = this.particles.slice(-80);
    }
  }

  _startParticleLoop() {
    const ctx = this._particleCtx;
    const canvas = this._particleCanvas;
    if (!ctx || !canvas) return;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      this._spawnParticles();

      this.particles = this.particles.filter(p => {
        p.progress += p.speed;
        if (p.progress >= 1) return false;

        const x = p.x + (p.tx - p.x) * p.progress;
        const y = p.y + (p.ty - p.y) * p.progress;

        // Fade in/out
        const fade = p.progress < 0.2 ? p.progress / 0.2 :
                     p.progress > 0.8 ? (1 - p.progress) / 0.2 : 1;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * fade;
        ctx.fill();
        ctx.globalAlpha = 1;

        return true;
      });

      this._particleRafId = requestAnimationFrame(draw);
    };

    this._particleRafId = requestAnimationFrame(draw);
  }

  // ── Load City ───────────────────────────────────────────

  loadCity(cityId) {
    const city = CITIES[cityId];
    if (!city) return;
    this.currentCityId = cityId;

    // Stop existing tracker
    if (this.unsubscribe) this.unsubscribe();
    this.tracker.stop();

    // Clear markers
    this.clearMapLayers();
    this.hideBusCard();
    this.activeRouteId = null;
    this.particles = [];

    // Fly map to city
    this.map.flyTo(city.center, city.zoom, { duration: 1 });

    // Draw routes and stops
    city.routes.forEach(r => this.drawRoute(r));

    // Init & start tracker
    this.tracker.initCity(city.routes);
    this.tracker.start();

    // Initial snapshot draw
    const initial = this.tracker.getSnapshot();
    initial.forEach(b => { this.busState.set(b.id, b); });
    this.renderBusMarkers(initial);

    // Subscribe to updates
    this.unsubscribe = this.tracker.subscribe(buses => {
      buses.forEach(b => { this.busState.set(b.id, b); });
      this.scheduleBusAnimations(buses);
      this.updateSidebarBuses(buses);
      this.updateMapStats(buses);
      this.updateLBMView(buses);
      this.updateFavoriteETAs();
      // If bus card open, refresh it
      if (this.selectedBusId) {
        const b = this.busState.get(this.selectedBusId);
        if (b) this.populateBusCard(b, city.routes.find(r => r.id === b.routeId));
      }
    });

    // Update sidebar
    this.renderSidebar(city);
    this.updateCityHeader(city);
    this.renderAlerts(cityId);
    this.populateTripPlanner(city);
    this.populateTicketSelectors(city);

    // LBM
    this.updateLBMCity(city);

    // Weather
    this.updateWeather();

    // Analytics route filter and chart updates
    this.populateAnalyticsRouteFilter();
    const activeNav = document.querySelector('#app-nav .nav-item.active');
    if (activeNav && activeNav.dataset.page === 'analytics') {
      this.updateAnalytics();
    }

    this.showToast(`Loaded ${city.name} — ${city.routes.reduce((s,r)=>s+r.busCount,0)} buses tracking`);
  }

  // ── Map Layer Drawing ────────────────────────────────────

  clearMapLayers() {
    this.routeLines.forEach(l => l.remove());
    this.stopCircles.forEach(m => m.remove());
    this.busMarkers.forEach(m => m.remove());
    this.routeLines.clear();
    this.stopCircles.clear();
    this.busMarkers.clear();
    this.animations.clear();
    this.busState.clear();
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
  }

  drawRoute(route) {
    // Route polyline
    const line = L.polyline(route.waypoints, {
      color: route.color,
      weight: 3,
      opacity: 0.5,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(this.map);
    this.routeLines.set(route.id, line);

    // Stop circle markers
    route.stops.forEach((stop, si) => {
      const isTerminal = si === 0 || si === route.stops.length - 1;
      const circle = L.circleMarker([stop.lat, stop.lng], {
        radius: isTerminal ? 7 : 4,
        color: route.color,
        fillColor: '#111215',
        fillOpacity: 1,
        weight: isTerminal ? 2.5 : 2,
        interactive: true,
      }).addTo(this.map)
        .bindPopup(this.buildStopPopup(stop, route), { maxWidth: 220, className: '' });

      circle.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        this.onStopClick(stop, route);
      });

      this.stopCircles.set(stop.id, circle);
    });
  }

  buildStopPopup(stop, route) {
    const busesHere = Array.from(this.busState.values()).filter(b =>
      b.routeId === route.id && b.nextStop === stop.name && b.nextStopEta !== null
    );
    const amenities = stop.amenities.map(a => AMENITY_ICONS[a] || '').join(' ');
    let html = `<div class="popup-stop-name">${stop.name}</div>`;
    if (amenities) html += `<div style="font-size:0.72rem;margin-bottom:5px;color:var(--text-dim)">${amenities}</div>`;
    if (busesHere.length) {
      busesHere.forEach(b => {
        const eta = b.nextStopEta < 1 ? '<1 min' : `${Math.round(b.nextStopEta)} min`;
        html += `<div class="popup-bus-row">
          <span class="popup-bus-id" style="color:${b.routeColor}">${b.id}</span>
          <span class="popup-eta">ETA: ${eta}</span>
        </div>`;
      });
    } else {
      html += `<div style="font-size:0.72rem;color:var(--text-dim)">No buses heading here shortly</div>`;
    }
    return html;
  }

  // ── Bus Markers ──────────────────────────────────────────

  renderBusMarkers(buses) {
    buses.forEach(bus => {
      if (!this.busMarkers.has(bus.id)) {
        const marker = this.createBusMarker(bus);
        this.busMarkers.set(bus.id, marker);
      }
    });
    if (!this._animActive) this.startRenderLoop();
  }

  createBusMarker(bus) {
    const icon = this.buildBusIcon(bus);
    const marker = L.marker([bus.lat, bus.lng], { icon, zIndexOffset: 200 })
      .addTo(this.map)
      .on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        const city = CITIES[this.currentCityId];
        const route = city.routes.find(r => r.id === bus.routeId);
        this.onBusClick(bus.id, route);
      });
    return marker;
  }

  buildBusIcon(bus) {
    const isAtStop = bus.status === 'at-stop';
    return L.divIcon({
      className: '',
      html: `<div class="bus-marker-wrap">
        <div class="bus-pulse" style="color:${bus.routeColor}"></div>
        <div class="bus-icon ${isAtStop ? 'at-stop' : ''}" style="background:${bus.routeColor}" data-bus="${bus.id}">
          ${bus.routeNumber}
        </div>
      </div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -18],
    });
  }

  // ── Animation System (smooth 60fps marker movement) ──────

  scheduleBusAnimations(buses) {
    buses.forEach(bus => {
      const marker = this.busMarkers.get(bus.id);
      if (!marker) return;
      const from = marker.getLatLng();
      const to = L.latLng(bus.lat, bus.lng);

      // Don't animate if very close (no movement)
      if (from.distanceTo(to) < 0.1) return;

      this.animations.set(bus.id, { from, to, startTs: performance.now() });

      // Also refresh icon for status changes
      const newIcon = this.buildBusIcon(bus);
      marker.setIcon(newIcon);
    });
  }

  startRenderLoop() {
    this._animActive = true;
    const ANIM_DURATION = 1800;

    const step = (now) => {
      this.animations.forEach((anim, busId) => {
        const marker = this.busMarkers.get(busId);
        if (!marker) { this.animations.delete(busId); return; }

        const elapsed = now - anim.startTs;
        const t = Math.min(elapsed / ANIM_DURATION, 1);
        // Ease-out cubic for natural deceleration
        const e = 1 - Math.pow(1 - t, 3);

        const lat = anim.from.lat + (anim.to.lat - anim.from.lat) * e;
        const lng = anim.from.lng + (anim.to.lng - anim.from.lng) * e;
        marker.setLatLng([lat, lng]);

        if (t >= 1) this.animations.delete(busId);
      });

      this._rafId = requestAnimationFrame(step);
    };

    this._rafId = requestAnimationFrame(step);
  }

  // ── Bus Click / Card ─────────────────────────────────────

  onBusClick(busId, route) {
    this.selectedBusId = busId;
    const bus = this.busState.get(busId);
    if (!bus || !route) return;
    this.populateBusCard(bus, route);
    document.getElementById('bus-info-card').classList.add('visible');

    // Reset seat map layout visibility on click
    document.getElementById('bic-seat-map-panel').style.display = 'none';
    document.getElementById('bic-seat-map-btn').classList.remove('active');

    // Pan map toward bus
    this.map.panTo([bus.lat, bus.lng], { animate: true, duration: 0.4 });

    // Highlight route
    this.highlightRoute(bus.routeId);
  }

  populateBusCard(bus, route) {
    const card = document.getElementById('bus-info-card');
    if (!card.classList.contains('visible')) return;

    document.getElementById('bic-badge').textContent = bus.routeNumber;
    document.getElementById('bic-badge').style.background = bus.routeColor + '20';
    document.getElementById('bic-badge').style.color = bus.routeColor;
    document.getElementById('bic-badge').style.border = `1px solid ${bus.routeColor}40`;

    document.getElementById('bic-name').textContent = bus.routeName;
    document.getElementById('bic-status').textContent = STATUS_LABELS[bus.status] || bus.status;
    document.getElementById('bic-speed').textContent = `${bus.speed} km/h`;
    document.getElementById('bic-id').textContent = bus.id;
    document.getElementById('bic-fare').textContent = `₹${route?.fare ?? '—'}`;

    document.getElementById('bic-next-stop').textContent = bus.nextStop || 'End of line';
    const etaMin = bus.nextStopEta;
    document.getElementById('bic-next-eta').textContent =
      etaMin == null ? '—' :
      etaMin < 0.5 ? 'Arriving now' :
      `Arrives in ${Math.round(etaMin)} min (~${(bus.distanceToNextStop * 1000).toFixed(0)}m)`;

    const crowdLabels = CROWD_LABELS;
    document.getElementById('bic-crowd-label').textContent = crowdLabels[bus.crowdLevel];
    const crowdBar = document.getElementById('bic-crowd-bar');
    crowdBar.className = `crowd-bar crowd-${bus.crowdLevel}`;

    // Route progress bar
    this.updateRouteProgress(bus, route);

    // Refresh seat occupancy grid if visible
    if (document.getElementById('bic-seat-map-panel').style.display === 'block') {
      this.renderSeatMap(bus);
    }
  }

  // ── Route Progress Visualization ─────────────────────────

  updateRouteProgress(bus, route) {
    const stopsContainer = document.getElementById('route-progress-stops');
    const fillEl = document.getElementById('route-progress-fill');
    const busEl = document.getElementById('route-progress-bus');

    if (!stopsContainer || !route) return;

    const stops = route.stops;
    const totalStops = stops.length;

    // Build stop dots
    stopsContainer.innerHTML = '';
    stops.forEach((stop, i) => {
      const dot = document.createElement('div');
      dot.className = 'rp-stop';
      dot.style.color = route.color;

      // Determine if this stop has been passed
      const stopWpIdx = route.stopIndices[i];
      if (bus.direction === 1) {
        if (stopWpIdx < bus.waypointIdx) {
          dot.classList.add('passed');
        } else if (stopWpIdx === bus.waypointIdx || (bus.nextStop === stop.name)) {
          // current or next
        }
      } else {
        if (stopWpIdx > bus.waypointIdx) {
          dot.classList.add('passed');
        }
      }
      stopsContainer.appendChild(dot);
    });

    // Calculate bus position along the route as a percentage
    const totalWp = route.waypoints.length - 1;
    const currentProgress = totalWp > 0 ? (bus.waypointIdx + bus.segProgress) / totalWp : 0;
    const percent = Math.max(0, Math.min(100, currentProgress * 100));

    fillEl.style.width = `${percent}%`;
    fillEl.style.background = route.color;

    busEl.style.left = `calc(${percent}% - 3px)`;
    busEl.style.background = route.color;
    busEl.style.boxShadow = `0 0 6px ${route.color}60`;
  }

  hideBusCard() {
    document.getElementById('bus-info-card').classList.remove('visible');
    this.selectedBusId = null;
    this.resetRouteHighlight();
  }

  // ── Route Highlighting ───────────────────────────────────

  highlightRoute(routeId) {
    this.routeLines.forEach((line, id) => {
      line.setStyle({
        opacity: id === routeId ? 0.9 : 0.15,
        weight: id === routeId ? 5 : 2,
      });
    });
  }

  resetRouteHighlight() {
    this.routeLines.forEach(line => {
      line.setStyle({ opacity: 0.5, weight: 3 });
    });
  }

  // ── Stop Click ───────────────────────────────────────────

  onStopClick(stop, route) {
    this.highlightRoute(route.id);
    this.showStopDetails(stop, route);
  }

  // ── Sidebar Rendering ────────────────────────────────────

  renderSidebar(city) {
    this.renderRouteList(city);
    this.updateSidebarBuses(this.tracker.getSnapshot());
  }

  renderRouteList(city) {
    const container = document.getElementById('routes-list');
    container.innerHTML = '';

    city.routes.forEach(route => {
      const card = document.createElement('div');
      card.className = 'route-card';
      card.id = `route-card-${route.id}`;
      card.style.setProperty('--route-color', route.color);
      card.setAttribute('data-route', route.id);

      // Inject style for before element
      const styleKey = `route-color-${route.id}`;
      if (!document.getElementById(styleKey)) {
        const s = document.createElement('style');
        s.id = styleKey;
        s.textContent = `#route-card-${route.id}::before { background: ${route.color}; }`;
        document.head.appendChild(s);
      }

      const busesOnRoute = this.tracker.getSnapshot().filter(b => b.routeId === route.id);
      const soonest = busesOnRoute
        .filter(b => b.nextStopEta != null)
        .sort((a, b) => a.nextStopEta - b.nextStopEta)[0];
      const nextEta = soonest ? (soonest.nextStopEta < 1 ? '<1 min' : `${Math.round(soonest.nextStopEta)} min`) : '—';

      const isFav = this.favorites.routes.includes(route.id);

      card.innerHTML = `
        <div class="route-header">
          <div class="route-badge" style="background:${route.color}18;color:${route.color};border:1px solid ${route.color}30">
            ${route.number}
          </div>
          <div class="route-name">${route.name}</div>
          <div class="route-actions">
            <button class="route-fav-btn ${isFav ? 'is-fav' : ''}" data-fav-route="${route.id}" title="Save route">
              ${isFav ? ICONS.starFill : ICONS.star}
            </button>
            <span class="route-arrow">${ICONS.arrow}</span>
          </div>
        </div>
        <div class="route-meta">
          <span class="meta-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Every ${route.frequency} min
          </span>
          <span class="meta-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            ₹${route.fare}
          </span>
          <span class="meta-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="22" height="16" rx="2"/>
            </svg>
            ${route.busCount} buses
          </span>
          <span class="next-bus-chip" style="background:${route.color}12;color:${route.color}">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            ${nextEta}
          </span>
        </div>

        <!-- Expandable stops list -->
        <div class="route-stops">
          <div class="section-label" style="padding:0 0 6px">Stops</div>
          ${route.stops.map((stop, si) => {
            const isLast = si === route.stops.length - 1;
            const amenities = stop.amenities.map(a => AMENITY_ICONS[a] || '').join(' ');
            const isStopFav = this.favorites.stops.includes(stop.id);
            return `
              <div class="stop-item" data-stop="${stop.id}" data-route="${route.id}">
                <div class="stop-dot-wrap">
                  <div class="stop-dot" style="color:${route.color}"></div>
                  ${!isLast ? '<div class="stop-connector"></div>' : ''}
                </div>
                <div class="stop-info">
                  <div class="stop-name">${stop.name}</div>
                  ${amenities ? `<div class="stop-amenities">${amenities}</div>` : ''}
                </div>
                <button class="stop-fav-btn ${isStopFav ? 'is-fav' : ''}" data-fav-stop="${stop.id}" title="Save stop">
                  ${isStopFav ? ICONS.starFill : ICONS.star}
                </button>
                <span class="stop-eta-badge" data-stop-eta="${stop.id}">—</span>
              </div>`;
          }).join('')}
        </div>
      `;

      // Route fav button
      card.querySelector('.route-fav-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFavoriteRoute(route.id);
        // Re-render the button
        const btn = card.querySelector('.route-fav-btn');
        const isFavNow = this.favorites.routes.includes(route.id);
        btn.classList.toggle('is-fav', isFavNow);
        btn.innerHTML = isFavNow ? ICONS.starFill : ICONS.star;
      });

      // Stop fav buttons
      card.addEventListener('click', (e) => {
        const favBtn = e.target.closest('.stop-fav-btn');
        if (favBtn) {
          e.stopPropagation();
          const stopId = favBtn.dataset.favStop;
          this.toggleFavoriteStop(stopId);
          const isFavNow = this.favorites.stops.includes(stopId);
          favBtn.classList.toggle('is-fav', isFavNow);
          favBtn.innerHTML = isFavNow ? ICONS.starFill : ICONS.star;
          return;
        }

        const stopItem = e.target.closest('.stop-item');
        if (stopItem) {
          const stopId = stopItem.dataset.stop;
          const stop = route.stops.find(s => s.id === stopId);
          if (stop) this.onStopClick(stop, route);
          return;
        }
        this.toggleRouteCard(route.id, card);
      });

      container.appendChild(card);
    });
  }

  toggleRouteCard(routeId, card) {
    const wasActive = card.classList.contains('active');

    // Close all cards
    document.querySelectorAll('.route-card.active').forEach(c => c.classList.remove('active'));

    if (!wasActive) {
      card.classList.add('active');
      this.activeRouteId = routeId;
      this.highlightRoute(routeId);
      this.updateStopEtas(routeId);

      // Pan to route
      const line = this.routeLines.get(routeId);
      if (line) this.map.flyToBounds(line.getBounds(), { padding: [40, 40], maxZoom: 15, duration: 0.7 });
    } else {
      this.activeRouteId = null;
      this.resetRouteHighlight();
    }
  }

  updateStopEtas(routeId) {
    const route = CITIES[this.currentCityId].routes.find(r => r.id === routeId);
    if (!route) return;

    route.stops.forEach(stop => {
      const badge = document.querySelector(`[data-stop-eta="${stop.id}"]`);
      if (!badge) return;

      const nearest = Array.from(this.busState.values())
        .filter(b => b.routeId === routeId && b.nextStop === stop.name && b.nextStopEta != null)
        .sort((a, b) => a.nextStopEta - b.nextStopEta)[0];

      if (nearest) {
        const eta = nearest.nextStopEta < 0.5 ? 'Now' :
                    nearest.nextStopEta < 1 ? '<1 min' :
                    `${Math.round(nearest.nextStopEta)} min`;
        badge.textContent = eta;
        badge.style.background = 'var(--green-soft)';
        badge.style.color = 'var(--green)';
      } else {
        badge.textContent = '—';
        badge.style.background = '';
        badge.style.color = '';
      }
    });
  }

  updateSidebarBuses(buses) {
    const container = document.getElementById('buses-list');
    if (!container) return;
    container.innerHTML = '';

    buses.sort((a, b) => (a.routeId > b.routeId ? 1 : -1)).forEach(bus => {
      const card = document.createElement('div');
      card.className = 'live-bus-card';
      card.id = `bus-card-${bus.id}`;

      const etaText = bus.nextStopEta == null ? '—' :
        bus.nextStopEta < 0.5 ? 'Now' :
        bus.nextStopEta < 1 ? '<1' :
        Math.round(bus.nextStopEta).toString();
      const etaUnit = bus.nextStopEta == null ? '' :
        bus.nextStopEta < 0.5 ? '' : 'min';

      card.innerHTML = `
        <div class="bus-card-header">
          <div class="bus-id-badge" style="background:${bus.routeColor}18;color:${bus.routeColor}">
            ${bus.id}
          </div>
          <div class="bus-card-route">${bus.routeName}</div>
          <div class="bus-status-pill status-${bus.status}">
            ${STATUS_LABELS[bus.status]}
          </div>
        </div>
        <div class="bus-card-body">
          <div class="bus-next-stop">
            <span>Next stop</span>
            <strong>${bus.nextStop || 'End of line'}</strong>
          </div>
          <div style="text-align:center">
            <div class="bus-eta-large">${etaText}</div>
            <div class="bus-eta-label">${etaUnit}</div>
          </div>
        </div>
        <div class="crowd-row">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
          </svg>
          ${CROWD_LABELS[bus.crowdLevel]}
          <div class="crowd-bar crowd-${bus.crowdLevel}">
            <div class="crowd-seg"></div>
            <div class="crowd-seg"></div>
            <div class="crowd-seg"></div>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        const route = CITIES[this.currentCityId].routes.find(r => r.id === bus.routeId);
        this.onBusClick(bus.id, route);
        // Flip to map view if on mobile
        document.getElementById('sidebar')?.classList.remove('expanded');
      });

      container.appendChild(card);
    });
  }

  // ── Stats Update ─────────────────────────────────────────

  updateMapStats(buses) {
    const stats = this.tracker.getStats();
    document.getElementById('map-stat-buses').textContent = stats.total;
    document.getElementById('map-stat-ontime').textContent = `${stats.onTimePercent}%`;
    document.getElementById('stat-buses').textContent = stats.total;
    document.getElementById('stat-ontime').textContent = `${stats.onTimePercent}%`;

    // Update stop ETAs if a route is active
    if (this.activeRouteId) {
      this.updateStopEtas(this.activeRouteId);
    }
  }

  // ── City Header ──────────────────────────────────────────

  updateCityHeader(city) {
    document.getElementById('city-display-name').textContent = city.name;
    document.getElementById('city-state').textContent = city.state;
    document.getElementById('stat-routes').textContent = city.routes.length;
    const totalBuses = city.routes.reduce((s, r) => s + r.busCount, 0);
    document.getElementById('stat-buses').textContent = totalBuses;
    document.getElementById('lbm-city-name').textContent = city.name;
  }

  // ── Alerts Panel ─────────────────────────────────────────

  renderAlerts(cityId) {
    const container = document.getElementById('alerts-list');
    container.innerHTML = '';

    const cityAlerts = ALERTS.filter(a => {
      if (cityId === 'nashik') return a.includes('N') || a.includes('city-wide') || a.includes('City-wide') || a.includes('new electric');
      if (cityId === 'indore') return a.includes('I5') || a.includes('City-wide') || a.includes('new electric');
      return a.includes('B') || a.includes('City-wide') || a.includes('new electric');
    });

    const all = cityAlerts.length ? cityAlerts : ALERTS.slice(0, 3);

    all.forEach((alert) => {
      const div = document.createElement('div');
      div.style.cssText = `
        padding:10px 12px;
        margin-bottom:6px;
        border-radius:var(--radius);
        background:var(--surface);
        border:1px solid var(--border);
        border-left:3px solid var(--yellow);
        font-size:0.78rem;
        line-height:1.5;
        color:var(--text-muted);
      `;
      div.innerHTML = `<span style="color:var(--yellow);font-weight:600">Alert </span>${alert}`;
      container.appendChild(div);
    });
  }

  // ── Ticker ───────────────────────────────────────────────

  buildTicker() {
    const content = ALERTS.join('  —  ');
    const ticker = document.getElementById('ticker-content');
    // Duplicate for seamless loop
    ticker.innerHTML = `<span class="ticker-item">${content}</span><span class="ticker-item">${content}</span>`;
  }

  // ── Weather System ───────────────────────────────────────

  startWeather() {
    this.updateWeather();
    // Rotate weather every 30 seconds
    this._weatherInterval = setInterval(() => {
      this.weatherIdx++;
      this.updateWeather();
    }, 30000);
  }

  updateWeather() {
    const data = WEATHER_DATA[this.currentCityId];
    if (!data) return;
    const w = data[this.weatherIdx % data.length];

    const iconEl = document.getElementById('weather-icon');
    const tempEl = document.getElementById('weather-temp');
    const labelEl = document.getElementById('weather-label');

    if (iconEl) iconEl.innerHTML = WEATHER_ICONS[w.condition] || '';
    if (tempEl) tempEl.textContent = `${w.temp}°`;
    if (labelEl) labelEl.textContent = w.label;
  }

  // ── Trip Planner ─────────────────────────────────────────

  populateTripPlanner(city) {
    const fromSelect = document.getElementById('planner-from');
    const toSelect = document.getElementById('planner-to');
    if (!fromSelect || !toSelect) return;

    // Gather all unique stops
    const allStops = new Map();
    city.routes.forEach(route => {
      route.stops.forEach(stop => {
        if (!allStops.has(stop.name)) {
          allStops.set(stop.name, { ...stop, routes: [route] });
        } else {
          allStops.get(stop.name).routes.push(route);
        }
      });
    });

    const stopNames = Array.from(allStops.keys()).sort();
    const optionsHtml = stopNames.map(name => `<option value="${name}">${name}</option>`).join('');

    fromSelect.innerHTML = optionsHtml;
    toSelect.innerHTML = optionsHtml;

    // Set second stop as default destination
    if (stopNames.length > 1) {
      toSelect.selectedIndex = stopNames.length - 1;
    }
  }

  findTrips(fromName, toName) {
    if (fromName === toName) return [];
    const city = CITIES[this.currentCityId];
    const results = [];

    // Direct routes: routes that contain both stops
    city.routes.forEach(route => {
      const fromIdx = route.stops.findIndex(s => s.name === fromName);
      const toIdx = route.stops.findIndex(s => s.name === toName);

      if (fromIdx !== -1 && toIdx !== -1) {
        const stopCount = Math.abs(toIdx - fromIdx);
        // Estimate time: distance between stops / route speed
        const totalDist = this._routeDistBetweenStops(route, fromIdx, toIdx);
        const timeMin = Math.round((totalDist / route.speed) * 60);

        results.push({
          type: 'Direct',
          duration: timeMin,
          fare: route.fare,
          steps: [{ route, from: fromName, to: toName, stops: stopCount }],
        });
      }
    });

    // Transfer routes: find routes with common stops
    city.routes.forEach(route1 => {
      city.routes.forEach(route2 => {
        if (route1.id === route2.id) return;
        const from1 = route1.stops.findIndex(s => s.name === fromName);
        if (from1 === -1) return;
        const to2 = route2.stops.findIndex(s => s.name === toName);
        if (to2 === -1) return;

        // Find common transfer stop
        route1.stops.forEach(s1 => {
          const transferIdx2 = route2.stops.findIndex(s2 => s2.name === s1.name);
          if (transferIdx2 === -1) return;

          const stops1 = Math.abs(route1.stops.indexOf(s1) - from1);
          const stops2 = Math.abs(to2 - transferIdx2);

          const dist1 = this._routeDistBetweenStops(route1, from1, route1.stops.indexOf(s1));
          const dist2 = this._routeDistBetweenStops(route2, transferIdx2, to2);
          const time1 = (dist1 / route1.speed) * 60;
          const time2 = (dist2 / route2.speed) * 60;
          const totalTime = Math.round(time1 + time2 + 3); // +3 min transfer wait

          // Avoid duplicate trips with same transfer
          const key = `${route1.id}-${s1.name}-${route2.id}`;
          if (results.find(r => r._key === key)) return;

          results.push({
            type: 'Transfer',
            _key: key,
            duration: totalTime,
            fare: route1.fare + route2.fare,
            steps: [
              { route: route1, from: fromName, to: s1.name, stops: stops1 },
              { route: route2, from: s1.name, to: toName, stops: stops2 },
            ],
            transferStop: s1.name,
          });
        });
      });
    });

    // Sort by duration
    results.sort((a, b) => a.duration - b.duration);
    return results.slice(0, 5);
  }

  _routeDistBetweenStops(route, idx1, idx2) {
    const wp = route.waypoints;
    const si = route.stopIndices;
    const start = si[Math.min(idx1, idx2)];
    const end = si[Math.max(idx1, idx2)];
    let dist = 0;
    for (let i = start; i < end && i < wp.length - 1; i++) {
      const R = 6371;
      const dLat = (wp[i+1][0] - wp[i][0]) * Math.PI / 180;
      const dLng = (wp[i+1][1] - wp[i][1]) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 + Math.cos(wp[i][0]*Math.PI/180) * Math.cos(wp[i+1][0]*Math.PI/180) * Math.sin(dLng/2)**2;
      dist += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
    return dist;
  }

  renderTripResults(results) {
    const container = document.getElementById('trip-results');
    if (!container) return;

    if (!results.length) {
      container.innerHTML = `<div class="trip-empty">No routes found between these stops. Try different locations.</div>`;
      return;
    }

    container.innerHTML = results.map(trip => `
      <div class="trip-card">
        <div class="trip-card-header">
          <div class="trip-duration">${trip.duration} min</div>
          <div class="trip-type">${trip.type}</div>
        </div>
        <div class="trip-steps">
          ${trip.steps.map((step, i) => `
            ${i > 0 ? `<span class="trip-walk">${ICONS.walking} Transfer at ${trip.transferStop}</span><span class="trip-step-arrow">${ICONS.arrow}</span>` : ''}
            <span class="trip-step">
              <span class="trip-step-badge" style="background:${step.route.color}18;color:${step.route.color}">${step.route.number}</span>
              ${step.from} → ${step.to}
              <span style="color:var(--text-dim)">(${step.stops} stops)</span>
            </span>
          `).join('')}
        </div>
        <div style="margin-top:6px;font-size:0.72rem;color:var(--text-dim)">Fare: ₹${trip.fare}</div>
      </div>
    `).join('');
  }

  // ── Favorites System ─────────────────────────────────────

  _loadFavorites() {
    try {
      const saved = localStorage.getItem('transittrack-favorites');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return { routes: [], stops: [] };
  }

  _saveFavorites() {
    try {
      localStorage.setItem('transittrack-favorites', JSON.stringify(this.favorites));
    } catch (_) {}
  }

  toggleFavoriteRoute(routeId) {
    const idx = this.favorites.routes.indexOf(routeId);
    if (idx === -1) {
      this.favorites.routes.push(routeId);
      this.showToast(`Route saved`);
    } else {
      this.favorites.routes.splice(idx, 1);
      this.showToast(`Route removed from saved`);
    }
    this._saveFavorites();
    this.renderFavorites();
  }

  toggleFavoriteStop(stopId) {
    const idx = this.favorites.stops.indexOf(stopId);
    if (idx === -1) {
      this.favorites.stops.push(stopId);
      this.showToast(`Stop saved`);
    } else {
      this.favorites.stops.splice(idx, 1);
      this.showToast(`Stop removed from saved`);
    }
    this._saveFavorites();
    this.renderFavorites();
  }

  renderFavorites() {
    const section = document.getElementById('favorites-section');
    const list = document.getElementById('favorites-list');
    if (!section || !list) return;

    const hasItems = this.favorites.routes.length > 0 || this.favorites.stops.length > 0;
    section.classList.toggle('has-items', hasItems);
    if (!hasItems) { list.innerHTML = ''; return; }

    let html = '';

    // Favorite routes
    this.favorites.routes.forEach(routeId => {
      const city = CITIES[this.currentCityId];
      const route = city?.routes.find(r => r.id === routeId);
      if (!route) return;

      html += `<div class="fav-chip" data-fav-type="route" data-fav-id="${routeId}">
        <span style="color:${route.color};font-weight:700">${route.number}</span>
        <span>${route.name.split('—')[0].trim()}</span>
        <span class="fav-remove" data-remove-route="${routeId}" title="Remove">&times;</span>
      </div>`;
    });

    // Favorite stops
    this.favorites.stops.forEach(stopId => {
      const city = CITIES[this.currentCityId];
      let stop = null, route = null;
      city?.routes.forEach(r => {
        const s = r.stops.find(s => s.id === stopId);
        if (s) { stop = s; route = r; }
      });
      if (!stop) return;

      // Get ETA
      const nearest = Array.from(this.busState.values())
        .filter(b => b.nextStop === stop.name && b.nextStopEta != null)
        .sort((a, b) => a.nextStopEta - b.nextStopEta)[0];
      const etaText = nearest ? (nearest.nextStopEta < 1 ? '<1m' : `${Math.round(nearest.nextStopEta)}m`) : '';

      html += `<div class="fav-chip" data-fav-type="stop" data-fav-id="${stopId}">
        <span style="width:6px;height:6px;border-radius:50%;background:${route.color};flex-shrink:0"></span>
        <span>${stop.name}</span>
        ${etaText ? `<span class="fav-eta">${etaText}</span>` : ''}
        <span class="fav-remove" data-remove-stop="${stopId}" title="Remove">&times;</span>
      </div>`;
    });

    list.innerHTML = html;

    // Event listeners for remove buttons
    list.querySelectorAll('[data-remove-route]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFavoriteRoute(btn.dataset.removeRoute);
        // Re-render route card fav button if visible
        const cardBtn = document.querySelector(`[data-fav-route="${btn.dataset.removeRoute}"]`);
        if (cardBtn) {
          cardBtn.classList.remove('is-fav');
          cardBtn.innerHTML = ICONS.star;
        }
      });
    });

    list.querySelectorAll('[data-remove-stop]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFavoriteStop(btn.dataset.removeStop);
        const cardBtn = document.querySelector(`[data-fav-stop="${btn.dataset.removeStop}"]`);
        if (cardBtn) {
          cardBtn.classList.remove('is-fav');
          cardBtn.innerHTML = ICONS.star;
        }
      });
    });

    // Click on fav chip to pan
    list.querySelectorAll('.fav-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        if (e.target.classList.contains('fav-remove')) return;
        const type = chip.dataset.favType;
        const id = chip.dataset.favId;
        if (type === 'route') {
          const card = document.getElementById(`route-card-${id}`);
          if (card) {
            document.getElementById('tab-routes')?.click();
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            this.toggleRouteCard(id, card);
          }
        } else if (type === 'stop') {
          const marker = this.stopCircles.get(id);
          if (marker) {
            this.map.panTo(marker.getLatLng());
            marker.openPopup();
          }
        }
      });
    });
  }

  updateFavoriteETAs() {
    if (this.favorites.stops.length === 0) return;
    // Debounce: only re-render if we have fav stops
    this.renderFavorites();
  }

  // ── Low-Bandwidth Mode ───────────────────────────────────

  updateLBMCity(city) {
    document.getElementById('lbm-city-name').textContent = city.name;
  }

  updateLBMView(buses) {
    if (!this.lowBandwidth) return;
    const container = document.getElementById('lbm-content');
    const city = CITIES[this.currentCityId];
    container.innerHTML = '';

    city.routes.forEach(route => {
      const section = document.createElement('div');
      section.className = 'lbm-route-section';

      const routeBuses = buses.filter(b => b.routeId === route.id);
      const crowdDots = ['var(--green)', 'var(--yellow)', 'var(--red)'];

      section.innerHTML = `
        <div class="lbm-route-title">
          <div class="lbm-route-dot" style="background:${route.color}"></div>
          Route ${route.number} — ${route.name}
          <span style="margin-left:auto;font-size:0.72rem;font-weight:400;color:var(--text-dim)">₹${route.fare} / Every ${route.frequency}min</span>
        </div>
        ${routeBuses.map(b => {
          const eta = b.nextStopEta == null ? '—' :
            b.nextStopEta < 0.5 ? 'Arriving' :
            b.nextStopEta < 1 ? '<1 min' :
            `${Math.round(b.nextStopEta)} min`;
          return `<div class="lbm-bus-row">
            <span class="lbm-bus-id" style="color:${b.routeColor}">${b.id}</span>
            <span class="lbm-status">Next: <strong>${b.nextStop || 'End of line'}</strong></span>
            <span class="lbm-eta">${eta}</span>
            <span class="lbm-crowd-text"><span class="lbm-crowd-dot" style="background:${crowdDots[b.crowdLevel]}"></span></span>
          </div>`;
        }).join('')}
      `;
      container.appendChild(section);
    });
  }

  // ── UI Events ────────────────────────────────────────────

  initUI() {
    // Navigation page switching
    document.querySelectorAll('#app-nav .nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchPage(btn.dataset.page);
      });
    });

    // City selector
    document.getElementById('city-selector').addEventListener('change', e => {
      this.loadCity(e.target.value);
    });

    // Bus info card close
    document.getElementById('bic-close').addEventListener('click', () => this.hideBusCard());

    // Sidebar toggle
    document.getElementById('sidebar-toggle').addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      const btn = document.getElementById('sidebar-toggle');
      sidebar.classList.toggle('hidden-sidebar');
      btn.classList.toggle('active');
    });

    // Tab switching
    document.querySelectorAll('.sidebar-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-tab').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const panelId = `panel-${tab.dataset.tab}`;
        const panel = document.getElementById(panelId);
        if (panel) panel.style.display = 'block';
      });
    });

    // Low-bandwidth toggle
    document.getElementById('lbm-toggle').addEventListener('click', () => {
      this.lowBandwidth = !this.lowBandwidth;
      const btn = document.getElementById('lbm-toggle');
      const mapWrap = document.getElementById('map-wrap');
      const lbmView = document.getElementById('lbm-view');

      btn.classList.toggle('active', this.lowBandwidth);
      btn.setAttribute('aria-pressed', String(this.lowBandwidth));
      mapWrap.classList.toggle('lbm-hidden', this.lowBandwidth);
      lbmView.classList.toggle('active', this.lowBandwidth);

      if (this.lowBandwidth) {
        const buses = this.tracker.getSnapshot();
        this.updateLBMView(buses);
        this.showToast('Low-bandwidth mode: text-only view active');
      } else {
        this.showToast('Map view restored');
      }
    });

    // Search
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (query.length < 2) { searchResults.classList.remove('visible'); return; }
      this.runSearch(query, searchResults);
    });

    searchInput.addEventListener('blur', () => {
      setTimeout(() => searchResults.classList.remove('visible'), 200);
    });

    // Trip planner
    document.getElementById('planner-swap-btn')?.addEventListener('click', () => {
      const from = document.getElementById('planner-from');
      const to = document.getElementById('planner-to');
      const temp = from.value;
      from.value = to.value;
      to.value = temp;
    });

    document.getElementById('planner-go-btn')?.addEventListener('click', () => {
      const from = document.getElementById('planner-from')?.value;
      const to = document.getElementById('planner-to')?.value;
      if (from && to) {
        const results = this.findTrips(from, to);
        this.renderTripResults(results);
      }
    });

    // Mobile sidebar drag handle
    const sidebar = document.getElementById('sidebar');
    let touchStartY = 0;

    sidebar.addEventListener('touchstart', e => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    sidebar.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].clientY - touchStartY;
      if (delta < -30) sidebar.classList.add('expanded');
      else if (delta > 30) sidebar.classList.remove('expanded');
    }, { passive: true });

    // Language switcher
    document.getElementById('lang-selector')?.addEventListener('change', (e) => {
      this.switchLanguage(e.target.value);
    });

    // Map style and traffic layers
    document.getElementById('btn-traffic-toggle')?.addEventListener('click', () => {
      this.toggleTrafficOverlay();
    });

    document.getElementById('btn-theme-menu')?.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('map-theme-dropdown')?.classList.toggle('visible');
    });

    document.addEventListener('click', () => {
      document.getElementById('map-theme-dropdown')?.classList.remove('visible');
    });

    document.querySelectorAll('#map-theme-dropdown .theme-opt').forEach(opt => {
      opt.addEventListener('click', (e) => {
        this.setMapTheme(e.target.dataset.theme);
      });
    });

    // Bus seat map toggle
    document.getElementById('bic-seat-map-btn')?.addEventListener('click', () => {
      this.toggleSeatMap();
    });

    // Stop details back button
    document.getElementById('stop-details-back-btn')?.addEventListener('click', () => {
      this.closeStopDetails();
    });

    // Pass booking events
    document.getElementById('ticket-book-btn')?.addEventListener('click', () => {
      this.startPassBooking();
    });

    document.getElementById('ticket-cancel-btn')?.addEventListener('click', () => {
      this.cancelPass();
    });

    document.querySelectorAll('.pay-app').forEach(app => {
      app.addEventListener('click', (e) => {
        this.processUPIPayment(e.currentTarget.dataset.payApp);
      });
    });

    document.getElementById('payment-cancel-btn')?.addEventListener('click', () => {
      this.cancelPayment();
    });

    // Onboarding tour events
    document.getElementById('tour-toggle-btn')?.addEventListener('click', () => {
      this.startTour();
    });

    document.getElementById('tour-close-btn')?.addEventListener('click', () => {
      this.endTour();
    });

    document.getElementById('tour-skip-btn')?.addEventListener('click', () => {
      this.endTour();
    });

    document.getElementById('tour-next-btn')?.addEventListener('click', () => {
      this.nextTourStep();
    });

    // Analytics Route Filter change
    document.getElementById('analytics-route-filter')?.addEventListener('change', () => {
      this.updateAnalytics();
    });

    // FAQ Accordion toggles
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const isActive = item?.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (item && !isActive) {
          item.classList.add('active');
        }
      });
    });

    // Support Form submit
    const feedbackForm = document.getElementById('support-feedback-form');
    feedbackForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('feedback-name')?.value;
      const subject = document.getElementById('feedback-subject')?.value;
      const msg = document.getElementById('feedback-msg')?.value;
      if (name && msg) {
        this.showToast(this.currentLanguage === 'hi' ? "प्रतिक्रिया सफलतापूर्वक सबमिट की गई!" : this.currentLanguage === 'mr' ? "अभिप्राय यशस्वीरित्या सबमिट केला!" : "Feedback submitted successfully!");
        feedbackForm.reset();
      }
    });
  }

  // ── Keyboard Shortcuts ───────────────────────────────────

  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Don't trigger if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          e.target.blur();
        }
        return;
      }

      const shortcutsOverlay = document.getElementById('shortcuts-overlay');

      switch(e.key) {
        case '1':
          document.getElementById('tab-routes')?.click();
          break;
        case '2':
          document.getElementById('tab-buses')?.click();
          break;
        case '3':
          document.getElementById('tab-planner')?.click();
          break;
        case '4':
          document.getElementById('tab-alerts')?.click();
          break;
        case '/':
          e.preventDefault();
          document.getElementById('search-input')?.focus();
          break;
        case 'Escape':
          this.hideBusCard();
          shortcutsOverlay?.classList.remove('visible');
          break;
        case 'f':
        case 'F':
          // Toggle favorites visibility
          const section = document.getElementById('favorites-section');
          if (section?.classList.contains('has-items')) {
            section.style.display = section.style.display === 'none' ? 'block' : '';
          }
          break;
        case '?':
          shortcutsOverlay?.classList.toggle('visible');
          break;
      }
    });

    // Close shortcuts overlay on click outside
    document.getElementById('shortcuts-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'shortcuts-overlay') {
        e.target.classList.remove('visible');
      }
    });
  }

  // ── Search ───────────────────────────────────────────────

  runSearch(query, container) {
    const results = [];
    const city = CITIES[this.currentCityId];

    // Search routes
    city.routes.forEach(route => {
      if (route.name.toLowerCase().includes(query) ||
          route.number.toLowerCase().includes(query)) {
        results.push({ type: 'route', label: `Route ${route.number}`, sub: route.name, color: route.color, route });
      }
    });

    // Search stops
    city.routes.forEach(route => {
      route.stops.forEach(stop => {
        if (stop.name.toLowerCase().includes(query)) {
          results.push({ type: 'stop', label: stop.name, sub: `Route ${route.number}`, color: route.color, stop, route });
        }
      });
    });

    // Search other cities
    Object.values(CITIES).forEach(c => {
      if (c.id !== this.currentCityId && c.name.toLowerCase().includes(query)) {
        results.push({ type: 'city', label: c.name, sub: c.state, color: '#2dd4bf', city: c });
      }
    });

    if (!results.length) {
      container.innerHTML = `<div style="padding:10px 14px;color:var(--text-dim);font-size:0.8rem">No results for "${query}"</div>`;
      container.classList.add('visible');
      return;
    }

    container.innerHTML = results.slice(0, 8).map(r => `
      <div class="search-result-item" data-type="${r.type}" data-id="${r.route?.id || r.city?.id || ''}">
        <div class="search-icon-sm" style="background:${r.color}20;color:${r.color}">
          ${r.type === 'route' ? ICONS.bus : r.type === 'stop' ? ICONS.stop : ICONS.city}
        </div>
        <div>
          <div class="search-result-name">${r.label}</div>
          <div class="search-result-sub">${r.sub}</div>
        </div>
      </div>
    `).join('');

    container.classList.add('visible');

    container.querySelectorAll('.search-result-item').forEach((el, i) => {
      el.addEventListener('mousedown', () => {
        const result = results[i];
        if (result.type === 'city') {
          document.getElementById('city-selector').value = result.city.id;
          this.loadCity(result.city.id);
        } else if (result.type === 'route') {
          const card = document.getElementById(`route-card-${result.route.id}`);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            this.toggleRouteCard(result.route.id, card);
          }
          // Switch to routes tab
          document.getElementById('tab-routes')?.click();
        } else if (result.type === 'stop') {
          this.onStopClick(result.stop, result.route);
          const marker = this.stopCircles.get(result.stop.id);
          if (marker) {
            this.map.panTo([result.stop.lat, result.stop.lng]);
            marker.openPopup();
          }
        }
        container.classList.remove('visible');
        document.getElementById('search-input').value = '';
      });
    });
  }

  // ── Clock ────────────────────────────────────────────────

  startClock() {
    const update = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      const el = document.getElementById('map-clock');
      if (el) el.textContent = `${h}:${m}`;
    };
    update();
    setInterval(update, 30000);
  }

  // ── Page Switcher & Routing ──────────────────────────────
  switchPage(pageId) {
    document.querySelectorAll('#app-nav .nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === pageId);
    });

    const mainView = document.getElementById('main');
    const pages = document.querySelectorAll('.app-page');
    
    pages.forEach(p => p.style.display = 'none');

    if (pageId === 'map') {
      mainView.style.display = 'flex';
      if (this.map) {
        setTimeout(() => {
          this.map.invalidateSize();
        }, 100);
      }
    } else {
      mainView.style.display = 'none';
      const activePage = document.getElementById(`page-${pageId}`);
      if (activePage) {
        activePage.style.display = 'block';
        if (pageId === 'analytics') {
          this.updateAnalytics();
        }
      }
    }
    
    // Auto-expand/collapse mobile view styling
    document.getElementById('sidebar')?.classList.remove('expanded');
  }

  // ── Analytics Methods ────────────────────────────────────
  populateAnalyticsRouteFilter() {
    const routeFilter = document.getElementById('analytics-route-filter');
    if (!routeFilter) return;
    const city = CITIES[this.currentCityId];
    routeFilter.innerHTML = '<option value="all">All Routes</option>' + 
      city.routes.map(r => `<option value="${r.id}">Route ${r.number}</option>`).join('');
  }

  updateAnalytics() {
    const filterVal = document.getElementById('analytics-route-filter')?.value || 'all';
    const city = CITIES[this.currentCityId];
    if (!city) return;
    
    let routes = city.routes;
    if (filterVal !== 'all') {
      routes = city.routes.filter(r => r.id === filterVal);
    }
    
    if (routes.length === 0) return;

    let totalSpeed = 0;
    let totalDelay = 0;
    let totalReliability = 0;
    let totalBusCount = 0;

    routes.forEach(r => {
      totalSpeed += r.speed;
      const seed = r.number.charCodeAt(0) + r.number.charCodeAt(r.number.length - 1);
      const delay = 0.8 + Math.abs(Math.sin(seed)) * 1.6;
      const reliability = 93.5 + Math.abs(Math.cos(seed)) * 5.0;
      totalDelay += delay;
      totalReliability += reliability;
      totalBusCount += r.busCount;
    });

    const avgSpeed = (totalSpeed / routes.length).toFixed(1);
    const avgDelay = (totalDelay / routes.length).toFixed(1);
    const avgReliability = (totalReliability / routes.length).toFixed(1);
    const emissions = Math.round(totalBusCount * 41.2);

    const speedEl = document.getElementById('an-val-speed');
    if (speedEl) speedEl.textContent = `${avgSpeed} km/h`;
    
    const delayEl = document.getElementById('an-val-delay');
    if (delayEl) {
      delayEl.textContent = `+${avgDelay} min`;
      delayEl.style.color = parseFloat(avgDelay) > 1.8 ? 'var(--red)' : 'var(--yellow)';
    }
    
    const relEl = document.getElementById('an-val-reliability');
    if (relEl) relEl.textContent = `${avgReliability}%`;
    
    const emEl = document.getElementById('an-val-emissions');
    if (emEl) emEl.textContent = `${emissions} kg`;

    const chart = document.getElementById('bar-chart-adherence');
    if (chart) {
      chart.innerHTML = routes.map(r => {
        const seed = r.number.charCodeAt(0) + r.number.charCodeAt(r.number.length - 1);
        const rel = Math.round(91 + Math.abs(Math.sin(seed * 2.3)) * 8);
        const bg = rel >= 95 ? 'var(--green)' : 'var(--yellow)';
        return `
          <div class="bar-col">
            <div class="bar-val-label">${rel}%</div>
            <div class="bar-fill-track"><div class="bar-fill-amount" style="height:${rel}%; background:${bg}"></div></div>
            <div class="bar-axis-name">${r.number}</div>
          </div>
        `;
      }).join('');
    }
  }

  // ── Eco Savings Counter ──────────────────────────────────
  startEcoSavingsCounter() {
    let val = 12408.20;
    const el = document.getElementById('eco-savings-counter');
    if (!el) return;
    
    if (this._ecoInterval) clearInterval(this._ecoInterval);
    this._ecoInterval = setInterval(() => {
      val += 0.02 + Math.random() * 0.03;
      el.textContent = `${val.toLocaleString(this.currentLanguage === 'hi' ? 'hi-IN' : this.currentLanguage === 'mr' ? 'mr-IN' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg CO2`;
    }, 1000);
  }

  // ── Toast Notifications ──────────────────────────────────

  showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('out');
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }

  // ── Translation Engine ──────────────────────────────────
  switchLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    this.currentLanguage = lang;
    const dict = TRANSLATIONS[lang];

    // Header updates
    const logoLink = document.getElementById('logo-link');
    if (logoLink) {
      logoLink.innerHTML = `<div class="logo-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <rect x="1" y="3" width="22" height="16" rx="3"/><path d="M1 10h22"/><circle cx="7" cy="21" r="2"/><circle cx="17" cy="21" r="2"/>
        </svg>
      </div>
      Transit<span>${dict.logoTrack}</span>`;
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = dict.searchPlaceholder;

    const lbmToggle = document.getElementById('lbm-toggle');
    if (lbmToggle) {
      lbmToggle.querySelector('span:not(.toggle-dot)').textContent = this.lowBandwidth ? dict.lowBwModeBadge : "Low-BW";
    }

    // Sidebar tab buttons
    document.getElementById('tab-routes').textContent = dict.allRoutes;
    document.getElementById('tab-buses').textContent = dict.activeBuses;
    document.getElementById('tab-planner').textContent = dict.planYourTrip;
    document.getElementById('tab-tickets').textContent = dict.tickets;
    document.getElementById('tab-alerts').textContent = dict.alerts;

    // Sidebar panels labels
    document.querySelector('#panel-routes .section-label').textContent = dict.allRoutesLabel;
    document.querySelector('#panel-buses .section-label').textContent = dict.activeBusesLabel;
    document.querySelector('#panel-planner .section-label').textContent = dict.planYourTripLabel;
    document.querySelector('#panel-tickets .section-label').textContent = dict.bookTransitPassLabel;
    document.querySelector('#panel-alerts .section-label').textContent = dict.serviceAlertsLabel;

    // Planner labels
    document.querySelector('label[for="planner-from"]').textContent = dict.fromLabel;
    document.querySelector('label[for="planner-to"]').textContent = dict.toLabel;
    document.getElementById('planner-go-btn').textContent = dict.findRoutesBtn;

    // Ticket labels
    document.querySelector('label[for="ticket-route"]').textContent = dict.selectRouteLabel;
    document.querySelector('label[for="ticket-from"]').textContent = dict.fromStopLabel;
    document.querySelector('label[for="ticket-to"]').textContent = dict.toStopLabel;
    document.querySelector('.ticket-fare-estimate span').textContent = dict.estFareLabel;
    document.getElementById('ticket-book-btn').textContent = dict.bookPassBtnLabel;

    // Digital Pass Labels
    document.querySelector('.ticket-brand').textContent = `TransitTrack ${dict.tickets}`;
    document.querySelector('.ticket-col:nth-child(1) .t-lbl').textContent = dict.passengerLabel;
    document.querySelectorAll('.ticket-col .t-lbl')[1].textContent = dict.routeLabel;
    document.querySelectorAll('.ticket-col .t-lbl')[2].textContent = dict.fromStopPass;
    document.querySelectorAll('.ticket-col .t-lbl')[3].textContent = dict.toStopPass;
    document.querySelectorAll('.ticket-col .t-lbl')[4].textContent = dict.dateLabel;
    document.querySelectorAll('.ticket-col .t-lbl')[5].textContent = dict.farePaidLabel;
    document.getElementById('ticket-cancel-btn').textContent = dict.cancelPassBtn;

    // Map traffic label
    const trafficLabel = document.getElementById('btn-traffic-label');
    if (trafficLabel) trafficLabel.textContent = dict.trafficBtn;

    // Translate top navigation link text
    const navMap = document.getElementById('nav-map');
    if (navMap) navMap.textContent = dict.navMap;
    const navAnaly = document.getElementById('nav-analytics');
    if (navAnaly) navAnaly.textContent = dict.navAnalytics;
    const navSupp = document.getElementById('nav-support');
    if (navSupp) navSupp.textContent = dict.navSupport;
    const navAb = document.getElementById('nav-about');
    if (navAb) navAb.textContent = dict.navAbout;

    // Translate Analytics page text
    const analyTitle = document.getElementById('analy-title');
    if (analyTitle) analyTitle.textContent = dict.analyTitle;
    const analySubtitle = document.getElementById('analy-subtitle');
    if (analySubtitle) analySubtitle.textContent = dict.analySubtitle;
    const lblSpeed = document.getElementById('an-lbl-speed');
    if (lblSpeed) lblSpeed.textContent = dict.lblSpeed;
    const lblDelay = document.getElementById('an-lbl-delay');
    if (lblDelay) lblDelay.textContent = dict.lblDelay;
    const lblReliability = document.getElementById('an-lbl-reliability');
    if (lblReliability) lblReliability.textContent = dict.lblReliability;
    const lblEmissions = document.getElementById('an-lbl-emissions');
    if (lblEmissions) lblEmissions.textContent = dict.lblEmissions;
    const lblCongestion = document.getElementById('chart-lbl-congestion');
    if (lblCongestion) lblCongestion.textContent = dict.lblCongestion;
    const lblHeadway = document.getElementById('chart-lbl-headway');
    if (lblHeadway) lblHeadway.textContent = dict.lblHeadway;

    // Translate Support page text
    const faqTitle = document.getElementById('support-faq-title');
    if (faqTitle) faqTitle.textContent = dict.faqTitle;
    const feedbackTitle = document.getElementById('support-form-title');
    if (feedbackTitle) feedbackTitle.textContent = dict.feedbackTitle;
    const lblSubject = document.getElementById('lbl-feedback-subject');
    if (lblSubject) lblSubject.textContent = dict.lblSubject;
    const lblName = document.getElementById('lbl-feedback-name');
    if (lblName) lblName.textContent = dict.lblName;
    const lblMsg = document.getElementById('lbl-feedback-msg');
    if (lblMsg) lblMsg.textContent = dict.lblMsg;
    const btnSubmit = document.getElementById('feedback-submit-btn');
    if (btnSubmit) btnSubmit.textContent = dict.currentLanguage === 'hi' ? 'अनुरोध सबमिट करें' : dict.currentLanguage === 'mr' ? 'विनंती सबमिट करा' : 'Submit Request';

    // Translate About page text
    const aboutTitle = document.getElementById('about-title');
    if (aboutTitle) aboutTitle.textContent = dict.aboutTitle;
    const aboutSubtitle = document.getElementById('about-subtitle');
    if (aboutSubtitle) aboutSubtitle.textContent = dict.aboutSubtitle;
    const ecoLbl = document.getElementById('eco-lbl');
    if (ecoLbl) ecoLbl.textContent = dict.aboutEcoSavings;

    // Refresh dynamic analytics values & carbon counter formatting
    this.updateAnalytics();
    this.startEcoSavingsCounter();

    // Refresh dynamic layouts
    const city = CITIES[this.currentCityId];
    if (city) {
      this.updateCityHeader(city);
      this.renderSidebar(city);
    }
    const currentBuses = this.tracker.getSnapshot();
    this.updateSidebarBuses(currentBuses);
    this.updateLBMView(currentBuses);
    this.renderFavorites();

    this.showToast(lang === 'hi' ? 'भाषा बदली गई: हिन्दी' : lang === 'mr' ? 'भाषा बदलली: मराठी' : 'Language switched to English');
  }

  // ── Ticket Pass Generator ──────────────────────────────
  populateTicketSelectors(city) {
    const routeSelect = document.getElementById('ticket-route');
    const fromSelect = document.getElementById('ticket-from');
    const toSelect = document.getElementById('ticket-to');
    if (!routeSelect || !fromSelect || !toSelect) return;

    routeSelect.innerHTML = city.routes.map(r => `<option value="${r.id}">Route ${r.number} — ${r.name}</option>`).join('');
    
    const updateStops = () => {
      const routeId = routeSelect.value;
      const route = city.routes.find(r => r.id === routeId);
      if (!route) return;
      
      const stopsHtml = route.stops.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
      fromSelect.innerHTML = stopsHtml;
      toSelect.innerHTML = stopsHtml;
      if (route.stops.length > 1) {
        toSelect.selectedIndex = route.stops.length - 1;
      }
      this.updateTicketFare(route);
    };

    routeSelect.addEventListener('change', updateStops);
    fromSelect.addEventListener('change', () => this.updateTicketFare(city.routes.find(r => r.id === routeSelect.value)));
    toSelect.addEventListener('change', () => this.updateTicketFare(city.routes.find(r => r.id === routeSelect.value)));
    
    updateStops();
  }

  updateTicketFare(route) {
    const fromSelect = document.getElementById('ticket-from');
    const toSelect = document.getElementById('ticket-to');
    const fareEl = document.getElementById('ticket-fare-amount');
    if (!fromSelect || !toSelect || !fareEl || !route) return;

    const idx1 = route.stops.findIndex(s => s.id === fromSelect.value);
    const idx2 = route.stops.findIndex(s => s.id === toSelect.value);
    if (idx1 === -1 || idx2 === -1 || idx1 === idx2) {
      fareEl.textContent = `₹0`;
      return;
    }
    const count = Math.abs(idx2 - idx1);
    const fare = Math.max(5, count * 3 + 2);
    fareEl.textContent = `₹${fare}`;
  }

  startPassBooking() {
    const routeSelect = document.getElementById('ticket-route');
    const fromSelect = document.getElementById('ticket-from');
    const toSelect = document.getElementById('ticket-to');
    const city = CITIES[this.currentCityId];
    const route = city.routes.find(r => r.id === routeSelect.value);

    const fromStop = route.stops.find(s => s.id === fromSelect.value);
    const toStop = route.stops.find(s => s.id === toSelect.value);

    if (fromStop.id === toStop.id) {
      this.showToast("From and To stops cannot be the same");
      return;
    }

    const fareText = document.getElementById('ticket-fare-amount').textContent;
    this._pendingBooking = {
      routeNumber: route.number,
      routeColor: route.color,
      fromName: fromStop.name,
      toName: toStop.name,
      fare: fareText,
      date: new Date().toLocaleDateString(this.currentLanguage === 'hi' ? 'hi-IN' : this.currentLanguage === 'mr' ? 'mr-IN' : 'en-US')
    };

    // Show mock UPI payment modal
    const modal = document.getElementById('payment-modal');
    const statusMsg = document.getElementById('payment-status-message');
    const dict = TRANSLATIONS[this.currentLanguage];
    modal.style.display = 'flex';
    statusMsg.textContent = dict.waitingChoice;
    document.getElementById('payment-title-label').textContent = dict.upiTitle;
    document.getElementById('payment-cancel-btn').textContent = dict.cancelPaymentBtn;
  }

  processUPIPayment(appName) {
    const statusMsg = document.getElementById('payment-status-message');
    const dict = TRANSLATIONS[this.currentLanguage];
    statusMsg.innerHTML = `<span style="color:var(--accent)">Contacting ${appName}... Authorization pending...</span>`;
    
    // Disable clicks during mock payment
    document.querySelectorAll('.pay-app').forEach(el => el.style.pointerEvents = 'none');

    setTimeout(() => {
      if (!this._pendingBooking) return; // cancelled
      statusMsg.innerHTML = `<span style="color:var(--green)">Payment Successful! Generating pass...</span>`;
      
      setTimeout(() => {
        this.generateDigitalPass();
        document.getElementById('payment-modal').style.display = 'none';
        document.querySelectorAll('.pay-app').forEach(el => el.style.pointerEvents = '');
      }, 1000);
    }, 1500);
  }

  cancelPayment() {
    this._pendingBooking = null;
    document.getElementById('payment-modal').style.display = 'none';
    document.querySelectorAll('.pay-app').forEach(el => el.style.pointerEvents = '');
    this.showToast("Payment cancelled");
  }

  generateDigitalPass() {
    if (!this._pendingBooking) return;
    this.activePass = this._pendingBooking;
    this._pendingBooking = null;

    // Save active pass to state
    document.getElementById('pass-route-badge').textContent = this.activePass.routeNumber;
    document.getElementById('pass-route-badge').style.background = this.activePass.routeColor + '20';
    document.getElementById('pass-route-badge').style.color = this.activePass.routeColor;
    document.getElementById('pass-from-stop').textContent = this.activePass.fromName;
    document.getElementById('pass-to-stop').textContent = this.activePass.toName;
    document.getElementById('pass-date').textContent = this.activePass.date;
    document.getElementById('pass-fare').textContent = this.activePass.fare;

    // Render Canvas QR
    this.drawMockQR('ticket-qr', `TransitPass|${this.activePass.routeNumber}|${this.activePass.fromName}|${this.activePass.toName}|${this.activePass.fare}`);

    document.getElementById('tickets-booking-view').style.display = 'none';
    document.getElementById('tickets-pass-view').style.display = 'block';
    this.showToast("Pass generated successfully");
  }

  cancelPass() {
    this.activePass = null;
    document.getElementById('tickets-pass-view').style.display = 'none';
    document.getElementById('tickets-booking-view').style.display = 'block';
    this.showToast("Pass cancelled");
  }

  drawMockQR(canvasId, textData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    const modules = 21;
    const scale = size / modules;

    const drawFinder = (x, y) => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(x * scale, y * scale, 7 * scale, 7 * scale);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((x + 1) * scale, (y + 1) * scale, 5 * scale, 5 * scale);
      ctx.fillStyle = '#000000';
      ctx.fillRect((x + 2) * scale, (y + 2) * scale, 3 * scale, 3 * scale);
    };

    drawFinder(0, 0);
    drawFinder(14, 0);
    drawFinder(0, 14);

    let hash = 0;
    for (let i = 0; i < textData.length; i++) {
      hash += textData.charCodeAt(i);
    }

    ctx.fillStyle = '#000000';
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        if (r < 8 && c < 8) continue;
        if (r < 8 && c >= 13) continue;
        if (r >= 13 && c < 8) continue;

        const bit = Math.abs(Math.sin((r * 13 + c * 37 + hash) * 1.5)) > 0.5;
        if (bit) {
          ctx.fillRect(c * scale, r * scale, scale, scale);
        }
      }
    }
  }

  // ── Stop departures detail panel ──────────────────────────
  showStopDetails(stop, route) {
    const dict = TRANSLATIONS[this.currentLanguage];
    document.getElementById('sd-stop-name').textContent = stop.name;
    document.getElementById('sd-stop-city').textContent = CITIES[this.currentCityId].name;

    // Display Facilities
    const facilitiesList = document.getElementById('sd-facilities');
    facilitiesList.innerHTML = '';
    const facilityDict = {
      parking: { label: this.currentLanguage === 'hi' ? 'पार्किंग' : this.currentLanguage === 'mr' ? 'पार्किंग' : 'Parking', icon: AMENITY_ICONS.parking },
      restroom: { label: this.currentLanguage === 'hi' ? 'शौचालय' : this.currentLanguage === 'mr' ? 'शौचालय' : 'Restrooms', icon: AMENITY_ICONS.restroom },
      food: { label: this.currentLanguage === 'hi' ? 'भोजन' : this.currentLanguage === 'mr' ? 'खाद्यपदार्थ' : 'Dining', icon: AMENITY_ICONS.food }
    };

    stop.amenities.forEach(a => {
      const item = facilityDict[a];
      if (!item) return;
      const card = document.createElement('div');
      card.className = 'sd-facility-card';
      card.innerHTML = `${item.icon}<span>${item.label}</span>`;
      facilitiesList.appendChild(card);
    });

    if (stop.amenities.length === 0) {
      facilitiesList.innerHTML = `<div style="grid-column: span 3; color: var(--text-dim); font-size: 0.76rem; text-align: center;">No local facilities at this stop</div>`;
    }

    // Departure list
    const depList = document.getElementById('sd-departures');
    depList.innerHTML = '';

    const busesHeading = Array.from(this.busState.values()).filter(
      b => b.routeId === route.id && b.nextStop === stop.name && b.nextStopEta != null
    );

    if (busesHeading.length > 0) {
      busesHeading.forEach(b => {
        const etaText = b.nextStopEta < 0.5 ? dict.arrivingNowLabel : `${dict.arrivingInLabel} ${Math.round(b.nextStopEta)} min`;
        const div = document.createElement('div');
        div.className = 'sd-dep-row';
        div.innerHTML = `
          <div class="sd-dep-route-info">
            <span class="sd-dep-badge" style="background:${b.routeColor}18;color:${b.routeColor}">${b.routeNumber}</span>
            <span class="sd-dep-name">${b.id}</span>
          </div>
          <span class="sd-dep-eta">${etaText}</span>
        `;
        depList.appendChild(div);
      });
    } else {
      // scheduled fallback
      const div = document.createElement('div');
      div.className = 'sd-dep-row';
      div.innerHTML = `
        <div class="sd-dep-route-info">
          <span class="sd-dep-badge" style="background:${route.color}18;color:${route.color}">${route.number}</span>
          <span class="sd-dep-name">${dict.nextBusInLabel}</span>
        </div>
        <span class="sd-dep-eta">${route.frequency} min (Sched)</span>
      `;
      depList.appendChild(div);
    }

    // Tab view panel switching
    document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
    document.getElementById('panel-stop-details').style.display = 'block';
  }

  closeStopDetails() {
    document.getElementById('panel-stop-details').style.display = 'none';
    // restore active tab
    const activeTabBtn = document.querySelector('.sidebar-tab.active');
    if (activeTabBtn) {
      const panelId = `panel-${activeTabBtn.dataset.tab}`;
      const panel = document.getElementById(panelId);
      if (panel) panel.style.display = 'block';
    }
    this.resetRouteHighlight();
  }

  // ── Seat Layout map ──────────────────────────────────────
  toggleSeatMap() {
    const panel = document.getElementById('bic-seat-map-panel');
    const btn = document.getElementById('bic-seat-map-btn');
    const isHidden = panel.style.display === 'none';
    panel.style.display = isHidden ? 'block' : 'none';
    btn.classList.toggle('active', isHidden);

    if (isHidden && this.selectedBusId) {
      const bus = this.busState.get(this.selectedBusId);
      if (bus) this.renderSeatMap(bus);
    }
  }

  renderSeatMap(bus) {
    const grid = document.getElementById('seat-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const rows = 6;
    let seed = 0;
    for (let i = 0; i < bus.id.length; i++) seed += bus.id.charCodeAt(i);

    const getSeatState = (seatNum) => {
      if (seatNum === 1 || seatNum === 2) {
        return 'accessible';
      }
      const prob = bus.crowdLevel === 0 ? 0.2 : bus.crowdLevel === 1 ? 0.6 : 0.9;
      const val = Math.abs(Math.sin(seatNum * 43.1 + seed * 9.7));
      return val < prob ? 'occupied' : 'available';
    };

    let seatCounter = 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= 5; c++) {
        if (c === 3) {
          const aisle = document.createElement('div');
          aisle.className = 'seat-aisle';
          grid.appendChild(aisle);
        } else {
          const seat = document.createElement('div');
          const seatNum = seatCounter++;
          const state = getSeatState(seatNum);
          
          seat.className = `seat ${state}`;
          seat.title = `Seat ${seatNum}: ${state === 'accessible' ? 'Handicap priority' : state === 'occupied' ? 'Occupied' : 'Vacant'}`;
          
          seat.addEventListener('click', () => {
            if (state === 'available') {
              seat.className = 'seat occupied';
              seat.title = `Seat ${seatNum}: Occupied by you`;
              this.showToast(`Seat ${seatNum} reserved temporarily`);
            } else if (state === 'occupied' && seat.title.includes('you')) {
              seat.className = 'seat available';
              seat.title = `Seat ${seatNum}: Vacant`;
              this.showToast(`Seat ${seatNum} reservation cancelled`);
            } else {
              this.showToast(`Seat ${seatNum} is currently ${state === 'accessible' ? 'priority seating' : 'occupied'}`);
            }
          });

          grid.appendChild(seat);
        }
      }
    }
  }

  // ── Onboarding Interactive Tour ──────────────────────────
  startTour() {
    this.tourStep = 0;
    document.getElementById('tour-overlay').style.display = 'flex';
    this.renderTourStep();
  }

  endTour() {
    document.getElementById('tour-overlay').style.display = 'none';
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
    this.showToast("App onboarding tour finished");
  }

  nextTourStep() {
    this.tourStep++;
    if (this.tourStep >= 5) {
      this.endTour();
    } else {
      this.renderTourStep();
    }
  }

  renderTourStep() {
    const dict = TRANSLATIONS[this.currentLanguage];
    const steps = [
      {
        title: dict.tourWelcomeTitle,
        body: dict.tourWelcomeBody,
        highlightId: 'logo-link'
      },
      {
        title: dict.tourSearchTitle,
        body: dict.tourSearchBody,
        highlightId: 'header-search'
      },
      {
        title: dict.tourMapTitle,
        body: dict.tourMapBody,
        highlightId: 'map-controls'
      },
      {
        title: dict.tourDeparturesTitle,
        body: dict.tourDeparturesBody,
        highlightId: 'sidebar'
      },
      {
        title: dict.tourPassTitle,
        body: dict.tourPassBody,
        highlightId: 'tab-tickets'
      }
    ];

    const step = steps[this.tourStep];
    if (!step) return;

    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));

    const highlightTarget = document.getElementById(step.highlightId);
    if (highlightTarget) {
      highlightTarget.classList.add('tour-highlight');
      if (step.highlightId === 'tab-tickets') {
        highlightTarget.click();
      }
    }

    document.getElementById('tour-step-title').textContent = step.title;
    document.getElementById('tour-body-text').textContent = step.body;
    document.getElementById('tour-step-progress').textContent = `Step ${this.tourStep + 1} of 5`;
    document.getElementById('tour-next-btn').textContent = this.tourStep === 4 ? (this.currentLanguage === 'hi' ? 'पूरा करें' : this.currentLanguage === 'mr' ? 'पूर्ण करा' : 'Finish') : (this.currentLanguage === 'hi' ? 'आगे' : this.currentLanguage === 'mr' ? 'पुढे' : 'Next');
  }

  // ── Route refresh logic ──────────────────────────────────
  refreshRouteLines() {
    const city = CITIES[this.currentCityId];
    if (!city) return;
    city.routes.forEach(route => {
      const line = this.routeLines.get(route.id);
      if (!line) return;
      if (this.trafficOverlayActive) {
        let trafficColor = 'var(--green)';
        if (route.number.includes('1') || route.number.includes('51')) {
          trafficColor = 'var(--red)';
        } else if (route.number.includes('2') || route.number.includes('52')) {
          trafficColor = 'var(--yellow)';
        }
        line.setStyle({ color: trafficColor, opacity: 0.8, weight: 4.5 });
      } else {
        line.setStyle({ color: route.color, opacity: 0.5, weight: 3 });
      }
    });
  }

  // ── Map Theme update ─────────────────────────────────────
  setMapTheme(themeId) {
    if (!this.tileLayers[themeId] || !this.map) return;
    Object.values(this.tileLayers).forEach(layer => {
      if (this.map.hasLayer(layer)) {
        this.map.removeLayer(layer);
      }
    });
    this.tileLayers[themeId].addTo(this.map);
    this.mapTheme = themeId;

    const container = this.map.getContainer();
    if (themeId === 'dark') {
      container.classList.add('dark-map');
    } else {
      container.classList.remove('dark-map');
    }

    document.querySelectorAll('#map-theme-dropdown .theme-opt').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.theme === themeId);
    });
    this.showToast(this.currentLanguage === 'hi' ? `नक्शा शैली बदली गई` : this.currentLanguage === 'mr' ? `नकाशा शैली बदलली` : `Map theme updated: ${themeId}`);
  }

  toggleTrafficOverlay() {
    this.trafficOverlayActive = !this.trafficOverlayActive;
    const btn = document.getElementById('btn-traffic-toggle');
    btn.classList.toggle('active', this.trafficOverlayActive);
    this.refreshRouteLines();
    this.showToast(this.trafficOverlayActive ? "Traffic overlay active" : "Traffic overlay hidden");
  }
}

// ── Bootstrap ─────────────────────────────────────────────────
const app = new TransitApp();

document.addEventListener('DOMContentLoaded', () => {
  app.init().catch(console.error);
});
