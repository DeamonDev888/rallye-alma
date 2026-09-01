/* ============================================================
   PHOTOS — Gestion des images réelles des œuvres
   Stratégie :
   1. work.photoUrl  → URL directe (Wikimedia Commons, URL uploadée)
   2. work.coords    → tile OpenStreetMap satellite (toujours disponible)
   3. fallback emoji  → si tout échoue

   Pas de clé API requise (OSM est libre).
   ============================================================ */

/**
 * Build a satellite-style tile URL from GPS coords using OpenStreetMap.
 * @param {[lat, lng]} coords
 * @param {number} zoom (15 = street level, 17 = building)
 * @param {string} size 'thumb' (300x200) or 'hero' (800x500)
 * @returns {string} URL to a satellite/static-style tile image
 *
 * Note: This returns a single OSM tile (256x256). For better quality we
 * composite via a small canvas or use a free static map API.
 * For simplicity in the POC we use the standard tile directly.
 */
function getStaticMapUrl(coords, zoom = 16, size = 'thumb') {
  const [lat, lng] = coords;
  // Use ArcGIS World Imagery satellite tiles (free, no API key)
  const tileSize = size === 'hero' ? 512 : 256;
  // Compute tile coords from lat/lng/zoom
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const latRad = lat * Math.PI / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
    Math.pow(2, zoom)
  );
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${x}/${y}`;
}

/**
 * Public API: get the best image URL for a work.
 * Returns an object {url, fallback} so the caller can render with onerror.
 */
function getWorkPhoto(work) {
  // Priority 1: explicit photoUrl on the work
  if (work.photoUrl) {
    return { url: work.photoUrl, fallback: work.icon };
  }
  // Priority 2: satellite tile from GPS coords
  if (work.coords && Array.isArray(work.coords)) {
    return { url: getStaticMapUrl(work.coords, 16, 'thumb'), fallback: work.icon };
  }
  // Priority 3: emoji fallback
  return { url: null, fallback: work.icon };
}

/**
 * Hero-sized photo for the work detail view.
 */
function getWorkPhotoHero(work) {
  if (work.photoUrl) {
    return { url: work.photoUrl, fallback: work.icon };
  }
  if (work.coords && Array.isArray(work.coords)) {
    return { url: getStaticMapUrl(work.coords, 17, 'hero'), fallback: work.icon };
  }
  return { url: null, fallback: work.icon };
}

/**
 * Compose a multi-tile satellite image into one URL via staticmap style.
 * For the POC we use a small canvas to composite 2x2 tiles.
 * Returns a data URL when done; for sync use, returns single tile.
 */
async function getCompositeStaticMap(coords, zoom = 16) {
  const [lat, lng] = coords;
  const tileSize = 256;
  const xCenter = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const latRad = lat * Math.PI / 180;
  const yCenter = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
    Math.pow(2, zoom)
  );

  // 2x2 grid of tiles centered on the point
  const tiles = [
    [xCenter - 1, yCenter - 1],
    [xCenter, yCenter - 1],
    [xCenter - 1, yCenter],
    [xCenter, yCenter],
  ];

  // For the POC, return the single center tile URL synchronously.
  // A full implementation would fetch all 4 tiles and composite via canvas.
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${xCenter}/${yCenter}`;
}

// Expose for testing
if (typeof window !== 'undefined') {
  window.getWorkPhoto = getWorkPhoto;
  window.getWorkPhotoHero = getWorkPhotoHero;
}