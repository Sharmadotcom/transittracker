// ============================================================
// TransitTrack — Main App Controller
// Orchestrates: Leaflet map, bus simulation, UI panels, search
// ============================================================

import CITIES, { AMENITY_ICONS } from './data/routes.js';
import { BusTracker } from './simulation/tracker.js';

// ── Constants ────────────────────────────────────────────────
const CROWD_LABELS = ['Low crowd', 'Moderate crowd', 'High crowd'];
const STATUS_LABELS = { moving: 'Moving', 'at-stop': 'At stop', delayed: 'Delayed' };
const ALERTS = [
  'Route N1 — Minor delays at CBS due to road work • Expected clearance: 6:00 PM',
  'Route I51 — Bus frequency increased to every 8 min during peak hours (5–8 PM)',
  'Route B1 — Temporary detour via Lal Ghati until further notice',
  'All routes — Diwali special service extended till midnight on 1st Nov',
  'Route N3 — Satpur MIDC stop temporarily shifted 200m east',
  'City-wide — 3 new electric buses added to service from Monday',
];

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
  }

  // ── Initialization ───────────────────────────────────────

  async init() {
    this.initMap();
    this.initUI();
    this.loadCity(this.currentCityId);
    this.startClock();
    this.buildTicker();

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
      setTimeout(() => lo.remove(), 500);
    }, 900);
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

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(this.map);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Close bus card when clicking map
    this.map.on('click', () => this.hideBusCard());
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

    // Fly map to city
    this.map.flyTo(city.center, city.zoom, { duration: 1.2 });

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

    // LBM
    this.updateLBMCity(city);

    this.showToast(`📍 Loaded ${city.name} — ${city.routes.reduce((s,r)=>s+r.busCount,0)} buses tracking live`);
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
      weight: 4,
      opacity: 0.65,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(this.map);
    this.routeLines.set(route.id, line);

    // Stop circle markers
    route.stops.forEach((stop, si) => {
      const isTerminal = si === 0 || si === route.stops.length - 1;
      const circle = L.circleMarker([stop.lat, stop.lng], {
        radius: isTerminal ? 8 : 5,
        color: route.color,
        fillColor: '#0D1117',
        fillOpacity: 1,
        weight: isTerminal ? 3 : 2,
        interactive: true,
      }).addTo(this.map)
        .bindPopup(this.buildStopPopup(stop, route), { maxWidth: 240, className: '' });

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
    if (amenities) html += `<div style="font-size:0.75rem;margin-bottom:6px;color:var(--text-muted)">${amenities}</div>`;
    if (busesHere.length) {
      busesHere.forEach(b => {
        const eta = b.nextStopEta < 1 ? '<1 min' : `${Math.round(b.nextStopEta)} min`;
        html += `<div class="popup-bus-row">
          <span class="popup-bus-id" style="color:${b.routeColor}">${b.id}</span>
          <span class="popup-eta">ETA: ${eta}</span>
        </div>`;
      });
    } else {
      html += `<div style="font-size:0.75rem;color:var(--text-muted)">No buses heading here shortly</div>`;
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
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      popupAnchor: [0, -20],
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
    const ANIM_DURATION = 1800; // slightly less than tick interval

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

    // Pan map toward bus
    this.map.panTo([bus.lat, bus.lng], { animate: true, duration: 0.5 });

    // Highlight route
    this.highlightRoute(bus.routeId);
  }

  populateBusCard(bus, route) {
    const card = document.getElementById('bus-info-card');
    if (!card.classList.contains('visible')) return;

    document.getElementById('bic-badge').textContent = bus.routeNumber;
    document.getElementById('bic-badge').style.background = bus.routeColor + '33';
    document.getElementById('bic-badge').style.color = bus.routeColor;
    document.getElementById('bic-badge').style.border = `1px solid ${bus.routeColor}55`;

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
        opacity: id === routeId ? 1 : 0.2,
        weight: id === routeId ? 6 : 3,
      });
    });
  }

  resetRouteHighlight() {
    this.routeLines.forEach(line => {
      line.setStyle({ opacity: 0.65, weight: 4 });
    });
  }

  // ── Stop Click ───────────────────────────────────────────

  onStopClick(stop, route) {
    // Highlight the route
    this.highlightRoute(route.id);

    // Show toast with ETA info
    const busesEnRoute = Array.from(this.busState.values()).filter(
      b => b.routeId === route.id && b.nextStop === stop.name
    );
    if (busesEnRoute.length > 0) {
      const first = busesEnRoute[0];
      const eta = first.nextStopEta < 1 ? '<1 min' : `${Math.round(first.nextStopEta)} min`;
      this.showToast(`🚏 ${stop.name} — Next bus in ${eta}`);
    } else {
      this.showToast(`🚏 ${stop.name} — ${route.name}`);
    }
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
      card.style.setProperty('color', route.color, '');
      // Left border via ::before pseudo
      card.style.cssText += `--route-color:${route.color}`;
      card.querySelector?.('.route-card::before');
      // Apply left border color
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

      card.innerHTML = `
        <div class="route-header">
          <div class="route-badge" style="background:${route.color}22;color:${route.color};border:1px solid ${route.color}44">
            ${route.number}
          </div>
          <div class="route-name">${route.name}</div>
          <svg class="route-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
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
          <span class="next-bus-chip" style="background:${route.color}18;color:${route.color}">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            ${nextEta}
          </span>
        </div>

        <!-- Expandable stops list -->
        <div class="route-stops">
          <div class="section-label" style="padding:0 0 8px">Stops</div>
          ${route.stops.map((stop, si) => {
            const isLast = si === route.stops.length - 1;
            const amenities = stop.amenities.map(a => AMENITY_ICONS[a] || '').join(' ');
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
                <span class="stop-eta-badge" data-stop-eta="${stop.id}">—</span>
              </div>`;
          }).join('')}
        </div>
      `;

      card.addEventListener('click', (e) => {
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
      if (line) this.map.flyToBounds(line.getBounds(), { padding: [40, 40], maxZoom: 15, duration: 0.8 });
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
        badge.style.background = 'rgba(63,185,80,0.15)';
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
          <div class="bus-id-badge" style="background:${bus.routeColor}22;color:${bus.routeColor}">
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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

    all.forEach((alert, i) => {
      const div = document.createElement('div');
      div.style.cssText = `
        padding:12px 14px;
        margin-bottom:8px;
        border-radius:var(--radius);
        background:var(--surface);
        border:1px solid var(--border);
        border-left:3px solid var(--yellow);
        font-size:0.82rem;
        line-height:1.5;
        color:var(--text-muted);
      `;
      div.innerHTML = `<span style="color:var(--yellow);font-weight:600">⚠ </span>${alert}`;
      container.appendChild(div);
    });
  }

  // ── Ticker ───────────────────────────────────────────────

  buildTicker() {
    const content = ALERTS.join(' • ⸻ • ');
    const ticker = document.getElementById('ticker-content');
    // Duplicate for seamless loop
    ticker.innerHTML = `<span class="ticker-item">${content}</span><span class="ticker-item">${content}</span>`;
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
      section.innerHTML = `
        <div class="lbm-route-title">
          <div class="lbm-route-dot" style="background:${route.color}"></div>
          Route ${route.number} — ${route.name}
          <span style="margin-left:auto;font-size:0.75rem;font-weight:400;color:var(--text-muted)">₹${route.fare} • Every ${route.frequency}min</span>
        </div>
        ${routeBuses.map(b => {
          const eta = b.nextStopEta == null ? '—' :
            b.nextStopEta < 0.5 ? 'Arriving' :
            b.nextStopEta < 1 ? '<1 min' :
            `${Math.round(b.nextStopEta)} min`;
          const crowdEmoji = ['🟢', '🟡', '🔴'][b.crowdLevel];
          return `<div class="lbm-bus-row">
            <span class="lbm-bus-id" style="color:${b.routeColor}">${b.id}</span>
            <span class="lbm-status">→ <strong>${b.nextStop || 'End of line'}</strong></span>
            <span class="lbm-eta">${eta}</span>
            <span class="lbm-crowd-text">${crowdEmoji}</span>
          </div>`;
        }).join('')}
      `;
      container.appendChild(section);
    });
  }

  // ── UI Events ────────────────────────────────────────────

  initUI() {
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
        this.showToast('📶 Low-bandwidth mode: map hidden, text-only view active');
      } else {
        this.showToast('🗺️ Map view restored');
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
        results.push({ type: 'city', label: c.name, sub: c.state, color: '#6C63FF', city: c });
      }
    });

    if (!results.length) {
      container.innerHTML = `<div style="padding:12px 16px;color:var(--text-muted);font-size:0.83rem">No results for "${query}"</div>`;
      container.classList.add('visible');
      return;
    }

    container.innerHTML = results.slice(0, 8).map(r => `
      <div class="search-result-item" data-type="${r.type}" data-id="${r.route?.id || r.city?.id || ''}">
        <div class="search-icon-sm" style="background:${r.color}33;color:${r.color}">
          ${r.type === 'route' ? '🚌' : r.type === 'stop' ? '🚏' : '🏙️'}
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

  // ── Toast Notifications ──────────────────────────────────

  showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('out');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// ── Bootstrap ─────────────────────────────────────────────────
const app = new TransitApp();

document.addEventListener('DOMContentLoaded', () => {
  app.init().catch(console.error);
});
