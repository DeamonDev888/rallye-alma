/* ============================================================
   STORAGE — Gestion du localStorage
   Progression utilisateur, badges, points, quiz complétés
   ============================================================ */

const STORAGE_KEY = 'rallye-alma-v1';

const defaultState = {
  points: 0,
  foundWorks: [],          // IDs des œuvres trouvées
  badges: [],              // IDs des badges obtenus
  quizCompleted: {},       // { workId: { correct: 0, total: 0 } }
  currentLocation: null,   // { lat, lng }
  visitedAt: {},           // { workId: timestamp }
  photosTaken: {},         // { workId: photoUrl (base64) }
  shareCount: 0
};

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(stored) };
  } catch (e) {
    console.warn('Storage corrupted, resetting:', e);
    return { ...defaultState };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Save failed:', e);
  }
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return { ...defaultState };
}

// === POINTS ===
function addPoints(state, points, reason) {
  state.points += points;
  console.log(`+${points} points: ${reason}`);
  saveState(state);
  return state;
}

// === ŒUVRE TROUVÉE ===
function markFound(state, workId) {
  if (!state.foundWorks.includes(workId)) {
    state.foundWorks.push(workId);
    state.visitedAt[workId] = Date.now();
    addPoints(state, 100, `Œuvre #${workId} trouvée`);
  }
  return state;
}

function isFound(state, workId) {
  return state.foundWorks.includes(workId);
}

// === QUIZ ===
function recordQuiz(state, workId, correct) {
  if (!state.quizCompleted[workId]) {
    state.quizCompleted[workId] = { correct: 0, total: 0 };
  }
  state.quizCompleted[workId].total++;
  if (correct) {
    state.quizCompleted[workId].correct++;
    addPoints(state, 50, 'Quiz réussi');
  }
  saveState(state);
  return state;
}

// === BADGES ===
function unlockBadge(state, badgeId) {
  if (!state.badges.includes(badgeId)) {
    state.badges.push(badgeId);
    addPoints(state, 200, `Badge "${badgeId}" débloqué`);
  }
  return state;
}

// === PHOTO ===
function savePhoto(state, workId, photoDataUrl) {
  state.photosTaken[workId] = photoDataUrl;
  addPoints(state, 25, 'Photo prise');
  saveState(state);
  return state;
}

// === SHARE ===
function incrementShare(state) {
  state.shareCount++;
  addPoints(state, 25, 'Partage sur les réseaux');
  saveState(state);
  return state;
}