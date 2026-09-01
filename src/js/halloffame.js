/* ============================================================
   HALL OF FAME — Classements mondial + classe/groupe
   - localStorage: scores par joueur (persistants)
   - Top mondial: agrège tous les scores (par participant)
   - Top classe/groupe: agrège par code de classe
   ============================================================ */

const HOF_KEY = 'rallye-alma-hof-v1';

function loadHOF() {
  try {
    const stored = localStorage.getItem(HOF_KEY);
    if (!stored) return { players: {}, classes: {} };
    return JSON.parse(stored);
  } catch (e) {
    return { players: {}, classes: {} };
  }
}

function saveHOF(hof) {
  try {
    localStorage.setItem(HOF_KEY, JSON.stringify(hof));
  } catch (e) {}
}

// Submit a score (call this from main app when a run completes)
function submitScore(playerName, classCode, score) {
  const hof = loadHOF();
  // Per-player aggregate
  if (!hof.players[playerName]) {
    hof.players[playerName] = { name: playerName, totalScore: 0, runs: 0, lastSeen: 0 };
  }
  hof.players[playerName].totalScore += score;
  hof.players[playerName].runs += 1;
  hof.players[playerName].lastSeen = Date.now();

  // Per-class aggregate
  if (classCode) {
    if (!hof.classes[classCode]) {
      hof.classes[classCode] = { code: classCode, members: 0, totalScore: 0, scores: [] };
    }
    hof.classes[classCode].members += 1;
    hof.classes[classCode].totalScore += score;
    hof.classes[classCode].scores.push({ player: playerName, score, ts: Date.now() });
  }
  saveHOF(hof);
  return hof;
}

function getTopPlayers(limit = 20) {
  const hof = loadHOF();
  return Object.values(hof.players)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit);
}

function getTopClasses(limit = 10) {
  const hof = loadHOF();
  return Object.values(hof.classes)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit);
}

function renderHallOfFame(targetId) {
  const top = $get(targetId);
  if (!top) return;
  const players = getTopPlayers(10);
  const classes = getTopClasses(5);

  top.innerHTML = `
    <div class="hof-submit">
      <h3>📝 Soumettre mon score</h3>
      <form id="hofSubmitForm">
        <input type="text" id="hofName" placeholder="Ton prenom ou pseudo" required>
        <input type="text" id="hofClass" placeholder="Code de classe (ex: POLY-301)" required>
        <button type="submit">Soumettre mon score actuel (${state.points} pts)</button>
      </form>
    </div>
    <div class="hof-section">
      <h3>🌍 Top mondial (joueurs)</h3>
      ${players.length === 0 ? '<p class="hof-empty">Aucun score pour l\u2019instant. Sois le premier\u00a0!</p>' : `
        <ol class="hof-list">
          ${players.map((p, i) => `
            <li class="hof-rank rank-${i+1}">
              <span class="hof-rank-num">#${i+1}</span>
              <span class="hof-name">${escapeHtml(p.name)}</span>
              <span class="hof-score">${p.totalScore} <small>pts (${p.runs} runs)</small></span>
            </li>
          `).join('')}
        </ol>
      `}
    </div>
    <div class="hof-section">
      <h3>🏫 Top classes / groupes</h3>
      ${classes.length === 0 ? '<p class="hof-empty">Aucune classe enregistre\u00e9e encore.</p>' : `
        <ol class="hof-list">
          ${classes.map((c, i) => `
            <li class="hof-rank rank-${i+1}">
              <span class="hof-rank-num">#${i+1}</span>
              <span class="hof-name">Classe ${escapeHtml(c.code)}</span>
              <span class="hof-score">${c.totalScore} <small>pts (${c.members} membres)</small></span>
            </li>
          `).join('')}
        </ol>
      `}
    </div>
  `;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// Expose for testing
if (typeof window !== 'undefined') {
  window.submitScore = submitScore;
  window.getTopPlayers = getTopPlayers;
  window.getTopClasses = getTopClasses;
}

// Wire up the submit form (call once on DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('hofSubmitForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('hofName').value.trim();
      const klass = document.getElementById('hofClass').value.trim();
      if (!name) return;
      submitScore(name, klass, state.points);
      showToast('🏆', 'Score soumis !', `${name} - ${state.points} pts`);
      renderHallOfFame('hofContent');
    });
  }
});
