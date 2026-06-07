// ============================================================
// TransitTrack — GPS Simulation Engine
// Moves buses along pre-defined routes in real time.
// Uses Haversine distance for accurate speed-based movement.
// ============================================================

export class BusTracker {
  constructor() {
    /** @type {Map<string, BusState>} */
    this.buses = new Map();
    /** @type {Map<string, RouteData>} */
    this.routes = new Map();
    /** @type {Set<Function>} */
    this.listeners = new Set();
    this._intervalId = null;
    this.TICK_MS = 2000; // update interval
  }

  // ── Haversine distance (km) ───────────────────────────────
  _dist(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // ── Linear interpolation between two waypoints ───────────
  _lerp(wp1, wp2, t) {
    return [
      wp1[0] + (wp2[0] - wp1[0]) * t,
      wp1[1] + (wp2[1] - wp1[1]) * t,
    ];
  }

  // ── Initialize buses for all routes in a city ────────────
  initCity(routes) {
    this.stop();
    this.buses.clear();
    this.routes.clear();

    routes.forEach(route => {
      this.routes.set(route.id, route);
      const total = route.waypoints.length;

      for (let i = 0; i < route.busCount; i++) {
        const busId = `${route.id}-B${i + 1}`;
        // Distribute buses evenly along route
        const wpIdx = Math.floor((i / route.busCount) * (total - 1));

        this.buses.set(busId, {
          id: busId,
          routeId: route.id,
          routeNumber: route.number,
          routeName: route.name,
          routeColor: route.color,
          waypointIdx: wpIdx,
          segProgress: 0,      // 0-1: progress within current segment
          direction: 1,        // 1 = forward, -1 = reverse
          lat: route.waypoints[wpIdx][0],
          lng: route.waypoints[wpIdx][1],
          speed: route.speed,  // km/h
          crowdLevel: Math.floor(Math.random() * 3), // 0=low,1=med,2=high
          status: 'moving',    // 'moving' | 'at-stop' | 'delayed'
          atStopTimer: 0,      // ticks remaining at stop
          lastStop: null,
          nextStop: null,
          nextStopEta: null,   // minutes
          distanceToNextStop: null, // km
          bearing: 0,          // degrees for rotation
        });
      }
    });
  }

  // ── Advance a single bus by one simulation tick ───────────
  _advanceBus(bus) {
    const route = this.routes.get(bus.routeId);
    if (!route) return;

    // If dwelling at a stop, count down
    if (bus.atStopTimer > 0) {
      bus.atStopTimer--;
      bus.status = 'at-stop';
      return;
    }
    bus.status = 'moving';

    const { waypoints, stopIndices } = route;
    const totalWp = waypoints.length;

    // Distance to move this tick (km)
    const moveKm = (bus.speed / 3600) * (this.TICK_MS / 1000);
    let remaining = moveKm;

    while (remaining > 0) {
      const curWp = waypoints[bus.waypointIdx];
      const nextIdx = bus.waypointIdx + bus.direction;

      // Boundary: reverse direction
      if (nextIdx < 0 || nextIdx >= totalWp) {
        bus.direction *= -1;
        bus.segProgress = 0;
        continue;
      }

      const nextWp = waypoints[nextIdx];
      const segLen = this._dist(curWp[0], curWp[1], nextWp[0], nextWp[1]);

      if (segLen === 0) {
        bus.waypointIdx = nextIdx;
        bus.segProgress = 0;
        continue;
      }

      const distToEnd = (1 - bus.segProgress) * segLen;

      if (remaining >= distToEnd) {
        remaining -= distToEnd;
        bus.waypointIdx = nextIdx;
        bus.segProgress = 0;

        // Check if we landed on a stop waypoint
        if (stopIndices.includes(nextIdx)) {
          const stopPos = stopIndices.indexOf(nextIdx);
          bus.lastStop = route.stops[stopPos]?.name ?? null;
          bus.atStopTimer = 1; // dwell 1 tick (~2s)
          bus.status = 'at-stop';
          remaining = 0;
        }
      } else {
        bus.segProgress += remaining / segLen;
        remaining = 0;
      }
    }

    // Compute interpolated position
    const curWp = waypoints[bus.waypointIdx];
    const nextIdx2 = bus.waypointIdx + bus.direction;

    if (nextIdx2 >= 0 && nextIdx2 < totalWp && bus.segProgress > 0) {
      const nextWp = waypoints[nextIdx2];
      const [lat, lng] = this._lerp(curWp, nextWp, bus.segProgress);
      bus.lat = lat;
      bus.lng = lng;

      // Bearing for marker rotation
      bus.bearing = this._bearing(curWp[0], curWp[1], nextWp[0], nextWp[1]);
    } else {
      bus.lat = curWp[0];
      bus.lng = curWp[1];
    }

    // Update ETA to next stop in direction of travel
    this._updateEta(bus, route);

    // Randomly fluctuate crowd level (very infrequently)
    if (Math.random() < 0.008) {
      bus.crowdLevel = Math.min(2, Math.max(0, bus.crowdLevel + (Math.random() < 0.5 ? 1 : -1)));
    }
  }

  // ── Compute compass bearing ───────────────────────────────
  _bearing(lat1, lng1, lat2, lng2) {
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const y = Math.sin(dLng) * Math.cos(lat2 * Math.PI / 180);
    const x =
      Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
      Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLng);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  }

  // ── Calculate ETA to the next stop ───────────────────────
  _updateEta(bus, route) {
    const { waypoints, stopIndices, stops } = route;

    // Find next stop in direction of travel
    const currentIdx = bus.waypointIdx;
    let nextStopWpIdx = -1;
    let nextStopDataIdx = -1;

    if (bus.direction === 1) {
      for (let si = 0; si < stopIndices.length; si++) {
        if (stopIndices[si] > currentIdx) {
          nextStopWpIdx = stopIndices[si];
          nextStopDataIdx = si;
          break;
        }
      }
    } else {
      for (let si = stopIndices.length - 1; si >= 0; si--) {
        if (stopIndices[si] < currentIdx) {
          nextStopWpIdx = stopIndices[si];
          nextStopDataIdx = si;
          break;
        }
      }
    }

    if (nextStopWpIdx === -1) {
      bus.nextStop = null;
      bus.nextStopEta = null;
      bus.distanceToNextStop = null;
      return;
    }

    // Sum distances along waypoints from current position to next stop
    let distKm = 0;
    const startIdx = currentIdx;
    const step = bus.direction;

    for (let i = startIdx; i !== nextStopWpIdx; i += step) {
      const ni = i + step;
      if (ni < 0 || ni >= waypoints.length) break;
      distKm += this._dist(
        waypoints[i][0], waypoints[i][1],
        waypoints[ni][0], waypoints[ni][1]
      );
    }

    // Subtract progress already made in current segment
    if (bus.segProgress > 0) {
      const nxt = currentIdx + step;
      if (nxt >= 0 && nxt < waypoints.length) {
        const segLen = this._dist(
          waypoints[currentIdx][0], waypoints[currentIdx][1],
          waypoints[nxt][0], waypoints[nxt][1]
        );
        distKm -= bus.segProgress * segLen;
      }
    }

    distKm = Math.max(0, distKm);

    bus.distanceToNextStop = distKm;
    bus.nextStop = stops[nextStopDataIdx]?.name ?? null;
    bus.nextStopEta = distKm > 0 ? (distKm / bus.speed) * 60 : 0; // minutes
  }

  // ── Simulation loop ───────────────────────────────────────
  start() {
    if (this._intervalId) return;
    this._intervalId = setInterval(() => {
      this.buses.forEach(bus => this._advanceBus(bus));
      const snapshot = this.getSnapshot();
      this.listeners.forEach(fn => fn(snapshot));
    }, this.TICK_MS);
  }

  stop() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  // ── Get current state snapshot (deep copy for safety) ────
  getSnapshot() {
    return Array.from(this.buses.values()).map(b => ({ ...b }));
  }

  // ── Subscribe to position updates ────────────────────────
  /** @returns {Function} unsubscribe */
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  // ── Stats for UI ─────────────────────────────────────────
  getStats() {
    const buses = this.getSnapshot();
    const onTime = buses.filter(b => b.status !== 'delayed').length;
    return {
      total: buses.length,
      moving: buses.filter(b => b.status === 'moving').length,
      atStop: buses.filter(b => b.status === 'at-stop').length,
      onTimePercent: buses.length > 0 ? Math.round((onTime / buses.length) * 100) : 100,
    };
  }
}
