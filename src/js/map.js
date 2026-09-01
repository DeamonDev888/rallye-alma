/* ============================================================
   MAP — Carte interactive avec Leaflet
   POC : utilise OpenStreetMap (gratuit, souverain-friendly)
   ============================================================ */

let map = null;
let userMarker = null;
let workMarkers = [];
let watchId = null;

const ALMA_CENTER = [48.5505, -71.6528];

function initMap() {
  if (!document.getElementById('map')) return;

  // Use Leaflet (free, no API key needed)
  if (typeof L === 'undefined') {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setupMap();
    document.head.appendChild(script);
  } else {
    setupMap();
  }
}

function setupMap() {
  map = L.map('map', {
    center: ALMA_CENTER,
    zoom: 14,
    zoomControl: false
  });

  // OpenStreetMap tiles (gratuit, libre)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19
  }).addTo(map);

  // Add work markers
  WORKS_DATA.forEach(work => {
    const isFound = state.foundWorks.includes(work.id);
    const icon = L.divIcon({
      className: '',
      html: `<div class="custom-marker ${isFound ? 'found' : ''}">${work.icon}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker(work.coords, { icon })
      .addTo(map)
      .bindPopup(`
        <strong>${work.name}</strong><br>
        <small>${CATEGORIES[work.category].label}</small><br>
        <p style="margin-top: 8px; font-size: 13px;">${work.description.substring(0, 100)}...</p>
        <button onclick="showWorkDetail(${work.id})" style="margin-top: 8px; padding: 4px 12px; background: var(--color-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
          Voir détails
        </button>
      `);
    workMarkers.push(marker);
  });

  // Locate button
  const locateBtn = document.getElementById('locateBtn');
  if (locateBtn) {
    locateBtn.addEventListener('click', locateUser);
  }

  // Start geolocation
  startGeolocation();
}

function locateUser() {
  if (!navigator.geolocation) {
    showToast('⚠️', 'Géolocalisation indisponible', null);
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      state.currentLocation = { lat: latitude, lng: longitude };
      saveState(state);

      if (userMarker) map.removeLayer(userMarker);
      userMarker = L.circleMarker([latitude, longitude], {
        radius: 8,
        color: '#457B9D',
        fillColor: '#457B9D',
        fillOpacity: 0.8
      }).addTo(map).bindPopup('📍 Vous êtes ici');

      map.setView([latitude, longitude], 16);
      showToast('📍', 'Position trouvée', null);
    },
    err => {
      showToast('❌', 'Erreur de géolocalisation', err.message);
    },
    { enableHighAccuracy: true }
  );
}

function startGeolocation() {
  if (!navigator.geolocation) return;
  watchId = navigator.geolocation.watchPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      state.currentLocation = { lat: latitude, lng: longitude };
      checkProximity(latitude, longitude);
    },
    err => console.warn(err),
    { enableHighAccuracy: true, maximumAge: 5000 }
  );
}

function checkProximity(lat, lng) {
  const PROXIMITY_METERS = 100;
  for (const work of WORKS_DATA) {
    const dist = getDistance(lat, lng, work.coords[0], work.coords[1]);
    if (dist <= PROXIMITY_METERS && !state.foundWorks.includes(work.id)) {
      markFound(state, work.id);
      showToast('🎉', `Nouvelle œuvre trouvée !`, work.name);
      showProximityAlert(work);
      // Refresh markers
      updateMapMarkers();
      // Check badges
      const newBadges = checkBadges(state, WORKS_DATA);
      for (const badge of newBadges) {
        unlockBadge(state, badge.id);
        showToast('🎖️', `Badge débloqué !`, badge.name);
      }
      updateUI();
    }
  }
}

function showProximityAlert(work) {
  const alert = document.getElementById('proximityAlert');
  alert.innerHTML = `
    <h3>${work.icon} ${work.name}</h3>
    <p>${work.description.substring(0, 120)}...</p>
    <button onclick="showWorkDetail(${work.id}); document.getElementById('proximityAlert').classList.remove('visible');">Découvrir l'histoire</button>
  `;
  alert.classList.add('visible');
  setTimeout(() => alert.classList.remove('visible'), 8000);
}

function updateMapMarkers() {
  // Refresh marker colors
  workMarkers.forEach((marker, i) => {
    const work = WORKS_DATA[i];
    const isFound = state.foundWorks.includes(work.id);
    const newIcon = L.divIcon({
      className: '',
      html: `<div class="custom-marker ${isFound ? 'found' : ''}">${work.icon}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    marker.setIcon(newIcon);
  });
}

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // m
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(Δφ/2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}