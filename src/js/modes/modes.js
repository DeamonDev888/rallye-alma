/* ============================================================
   MODES — Système de modes de jeu pour Rallye Alma
   11 parcours : Visite Guidée, Quiz Interactif, Mission Photo, Mode Express,
             Pédagogie, Récits d'Alma, Atelier Créatif, Circuit Saisonnier, Quiz Rapide, Galerie Photo, Tableau Prof
   Refactorisé : helper DRY + DRY par mode
   ============================================================ */

// === SHARED HELPERS ===
function $get(id) { return document.getElementById(id); }

function showView(id, html) {
  const el = $get(id);
  if (!el) return;
  el.innerHTML = html;
  el.style.display = 'block';
}

function hideView(id) {
  const el = $get(id);
  if (el) el.style.display = 'none';
}

function backBtn(modeId) {
  return `<button class="back-btn" onclick="exitMode('${modeId}')">← Quitter</button>`;
}

function progress(current, total) {
  const pct = (current / total) * 100;
  return `
    <div class="progress-info">
      <span>${current}/${total}</span>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
  `;
}

function pickRandom(arr, n) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function getNearestWorks(origin, count, radiusMeters = 2000) {
  return WORKS_DATA
    .map(w => ({ w, dist: getDistance(origin[0], origin[1], w.coords[0], w.coords[1]) }))
    .filter(x => x.dist <= radiusMeters)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, count)
    .map(x => x.w);
}

// === MODE REGISTRY ===
const MODES = {
  guided:    { name: 'Visite Guidée', icon: '🚶', color: '#457B9D', desc: 'Parcours guidé automatique', dur: '60-90 min', works: 10 },
  battle:    { name: 'Quiz Interactif', icon: '⚔️', color: '#E63946', desc: 'Quiz chronometré', dur: '20-30 min', works: 15 },
  photo:     { name: 'Mission Photo', icon: '📸', color: '#F4A261', desc: 'Défis créatifs', dur: '2-3 heures', works: 20 },
  timeattack:{ name: 'Mode Express', icon: '⏱️', color: '#2A9D8F', desc: 'Max œuvres en 30 min', dur: '30 min', works: 50 },
  pedagogy:  { name: 'Pédagogie', icon: '🎓', color: '#8B4513', desc: 'Quiz par niveau scolaire', dur: 'Variable', works: 50 },
  histoires: { name: 'Histoires', icon: '📖', color: '#9B59B6', desc: 'Histoires vraies d\'Alma', dur: '30 min', works: 8 },
  creative:  { name: 'Atelier Créatif', icon: '🎨', color: '#16A085', desc: 'Créez autour des œuvres', dur: '3 heures', works: 10 },
  thematic:  { name: 'Circuit Saisonnier', icon: '❄️', color: '#3498DB', desc: 'Œuvres de la saison', dur: '45 min', works: 12 },
  trivia:    { name: 'Quiz Rapide', icon: '⚡', color: '#E67E22', desc: '10 questions, 60 secondes', dur: '1 min', works: 10 },
  gallery:   { name: 'Galerie Photo', icon: '🖼️', color: '#1ABC9C', desc: 'Tes œuvres préférées', dur: 'Libre', works: 50 },
  teacher:   { name: 'Tableau Prof', icon: '👩‍🏫', color: '#34495E', desc: 'Dashboard enseignant', dur: 'Live', works: 50 }
};

let currentMode = null;

function showModeSelector() {
  const grid = $get('modesGrid');
  if (!grid) return;
  grid.innerHTML = Object.entries(MODES).map(([id, m]) => `
    <article class="mode-card" data-mode="${id}" style="border-left: 4px solid ${m.color}">
      <div class="mode-icon">${m.icon}</div>
      <h3>${m.name}</h3>
      <p class="mode-desc">${m.desc}</p>
      <div class="mode-meta">
        <span class="mode-badge">⏱️ ${m.dur}</span>
        <span class="mode-badge">🏛️ ${m.works} œuvres</span>
      </div>
      <button class="btn-mode-start" data-mode="${id}">Lancer</button>
    </article>
  `).join('');
  grid.querySelectorAll('.btn-mode-start').forEach(btn => {
    btn.addEventListener('click', () => startMode(btn.dataset.mode));
  });
}

function startMode(modeId) {
  currentMode = modeId;
  state.currentMode = { id: modeId, startTime: Date.now(), foundWorks: [], score: 0, completed: false };
  saveState(state);
  switchView(modeId + 'View');
  const starters = {
    guided: startGuided, battle: startBattle, photo: startPhoto, timeattack: startTimeAttack,
    pedagogy: startPedagogy, histoires: startHistoires, creative: startCreative, thematic: startThematic,
    trivia: startTrivia, gallery: startGallery, teacher: startTeacher
  };
  if (starters[modeId]) starters[modeId]();
}

function exitMode() {
  currentMode = null;
  state.currentMode = null;
  saveState(state);
  switchView('modesView');
}

function completeMode() {
  if (!state.currentMode) return;
  state.currentMode.completed = true;
  addPoints(state, 300, 'Parcours terminé');
  showToast('🏆', 'Parcours terminé !', '+300 points');
  updateUI();
  setTimeout(exitMode, 2500);
}

// ============================================================
// MODE 1 — VISITE GUIDÉE
// ============================================================
function startGuided() {
  const start = WORKS_DATA[Math.floor(Math.random() * 10)];
  const works = [start, ...getNearestWorks(start.coords, 9).filter(w => w.id !== start.id)];
  state.currentMode.works = works.map(w => w.id);

  showView('guidedView', `
    <header class="mode-header" style="background:${MODES.guided.color}">
      ${backBtn('guided')}
      <h2>🚶 Visite Guidée d'Alma</h2>
      <p>Suivez le parcours, écoutez l'histoire</p>
    </header>
    <div class="mode-content">
      <div id="guidedProgress">${progress(0, 10)}</div>
      <div class="guided-next" id="guidedNext">
        <h3>📍 Approchez-vous pour commencer</h3>
      </div>
      <div class="guided-current-work" id="guidedCurrentWork" style="display:none">
        <div class="guided-hero">🎯</div>
        <h2 id="guidedTitle"></h2>
        <p id="guidedDesc"></p>
        <button class="btn-secondary" id="guidedNextBtn">Continuer →</button>
      </div>
    </div>
  `);

  $get('guidedNextBtn')?.addEventListener('click', () => nextGuided());
}

function nextGuided() {
  const mode = state.currentMode;
  const idx = mode.foundWorks.length;
  if (idx >= mode.works.length) return completeMode();

  if (idx > 0) {
    const prevId = mode.works[idx - 1];
    const prev = WORKS_DATA.find(w => w.id === prevId);
    if (!state.foundWorks.includes(prevId)) markFound(state, prevId);
    $get('guidedCurrentWork').style.display = 'block';
    $get('guidedNext').style.display = 'none';
    $get('guidedTitle').textContent = prev.name;
    $get('guidedDesc').textContent = prev.description;
  }

  const next = WORKS_DATA.find(w => w.id === mode.works[idx]);
  const distKm = state.currentLocation
    ? (getDistance(state.currentLocation.lat, state.currentLocation.lng, next.coords[0], next.coords[1]) / 1000).toFixed(1)
    : '?';
  $get('guidedProgress').innerHTML = progress(idx, mode.works.length);
  $get('guidedNext').innerHTML = `
    <h3>📍 Prochaine œuvre</h3>
    <p>${next.name} — ${distKm} km</p>
    <button class="btn-secondary" id="guidedNextBtn">J'y suis →</button>
  `;
  $get('guidedNextBtn').onclick = () => nextGuided();
}

// ============================================================
// MODE 2 — QUIZ BATTLE
// ============================================================
function startBattle() {
  showView('battleView', `
    <header class="mode-header" style="background:${MODES.battle.color}">
      ${backBtn('battle')}
      <h2>⚔️ Quiz Interactif</h2>
    </header>
    <div class="mode-content">
      <div class="battle-modes" id="battleLobby">
        <h3>Mode</h3>
        <button class="mode-option" data-battle="solo">🎯 Solo (10 questions)</button>
        <button class="mode-option" data-battle="duel">⚔️ Duel 1v1 (15)</button>
        <button class="mode-option" data-battle="royale">👥 En groupe (3-10)</button>
      </div>
      <div class="battle-quiz" id="battleQuiz" style="display:none">
        <div class="battle-hud">
          <div class="battle-player"><div class="battle-name">VOUS</div><div class="battle-score" id="battleScore1">0</div></div>
          <div class="battle-timer" id="battleTimer">10</div>
          <div class="battle-player"><div class="battle-name">CPU</div><div class="battle-score" id="battleScore2">0</div></div>
        </div>
        <div class="battle-question">
          <h3 id="battleQuestion"></h3>
          <div id="battleChoices" class="battle-choices"></div>
        </div>
      </div>
      <div class="battle-result" id="battleResult" style="display:none"></div>
    </div>
  `);
  document.querySelectorAll('.mode-option').forEach(btn =>
    btn.addEventListener('click', () => startBattleRound(btn.dataset.battle)));
}

function startBattleRound(mode) {
  state.currentMode.battleMode = mode;
  state.currentMode.score1 = 0;
  state.currentMode.score2 = 0;
  state.currentMode.currentQ = 0;
  state.currentMode.totalQ = mode === 'solo' ? 10 : 15;
  $get('battleLobby').style.display = 'none';
  $get('battleQuiz').style.display = 'block';
  nextBattleQuestion();
}

function nextBattleQuestion() {
  const m = state.currentMode;
  if (m.currentQ >= m.totalQ) return endBattle();

  const work = WORKS_DATA[Math.floor(Math.random() * WORKS_DATA.length)];
  if (!work.quiz) return nextBattleQuestion();

  $get('battleQuestion').textContent = work.quiz.question;
  $get('battleChoices').innerHTML = work.quiz.choices.map((c, i) =>
    `<button class="battle-choice" data-choice="${i}" data-correct="${work.quiz.correct}">${String.fromCharCode(65 + i)}. ${c}</button>`
  ).join('');

  let timeLeft = 10;
  $get('battleTimer').textContent = timeLeft;
  if (m.timer) clearInterval(m.timer);
  m.timer = setInterval(() => {
    if (--timeLeft <= 0) {
      clearInterval(m.timer);
      cpuAnswers();
      setTimeout(nextBattleQuestion, 1500);
    } else $get('battleTimer').textContent = timeLeft;
  }, 1000);

  document.querySelectorAll('.battle-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      clearInterval(m.timer);
      const choice = parseInt(btn.dataset.choice);
      const correct = parseInt(btn.dataset.correct);
      btn.classList.add(choice === correct ? 'correct' : 'wrong');
      if (choice === correct) {
        m.score1 += 100;
        $get('battleScore1').textContent = m.score1;
      }
      setTimeout(() => { cpuAnswers(); setTimeout(nextBattleQuestion, 1500); }, 500);
    });
  });
}

function cpuAnswers() {
  const m = state.currentMode;
  if (Math.random() < 0.65) {
    m.score2 += 100;
    $get('battleScore2').textContent = m.score2;
  }
  m.currentQ++;
}

function endBattle() {
  const m = state.currentMode;
  const won = m.score1 > m.score2;
  $get('battleQuiz').style.display = 'none';
  $get('battleResult').style.display = 'block';
  $get('battleResult').innerHTML = `
    <h3>${won ? '🏆 Victoire !' : '💪 Bonne tentative !'}</h3>
    <p>Score final : <strong>${m.score1}</strong> vs <strong>${m.score2}</strong></p>
    <button class="btn-secondary" onclick="exitMode()">Retour aux modes</button>
  `;
  addPoints(state, won ? 200 : 50, 'Quiz Interactif');
}

// ============================================================
// MODE 3 — PHOTO MISSION
// ============================================================
const PHOTO_MISSIONS = [
  'Photo créative avec l\'œuvre',
  'Angle inhabituel',
  'Œuvre + paysage',
  'Selfie avec l\'œuvre',
  'Détail artistique'
];

function startPhoto() {
  const selected = pickRandom(WORKS_DATA, 20).map(w => ({
    ...w,
    mission: PHOTO_MISSIONS[Math.floor(Math.random() * PHOTO_MISSIONS.length)]
  }));
  state.currentMode.photoWorks = selected;
  state.currentMode.photoIdx = 0;

  showView('photoView', `
    <header class="mode-header" style="background:${MODES.photo.color}">
      ${backBtn('photo')}
      <h2>📸 Mission Photo</h2>
      <p>20 œuvres, 20 défis</p>
    </header>
    <div class="mode-content">
      <div class="photo-progress">
        <span id="photoCurrent">1</span>/<span id="photoTotal">20</span>
      </div>
      <div class="photo-mission" id="photoMission"></div>
      <div class="photo-actions">
        <button class="btn-secondary" id="photoCamera">📷 Prendre</button>
        <button class="btn-secondary" id="photoSkip">⏭️ Passer</button>
      </div>
    </div>
  `);
  showNextPhoto();
}

function showNextPhoto() {
  const m = state.currentMode;
  const idx = m.photoIdx;
  if (idx >= m.photoWorks.length) return completeMode();
  const w = m.photoWorks[idx];
  $get('photoCurrent').textContent = idx + 1;
  $get('photoTotal').textContent = m.photoWorks.length;
  $get('photoMission').innerHTML = `
    <div class="photo-work-hero">${w.icon}</div>
    <h3>${w.name}</h3>
    <p class="photo-mission-text">🎯 ${w.mission}</p>
  `;
  $get('photoCamera').onclick = () => {
    addPoints(state, 50, 'Mission Photo');
    savePhoto(state, w.id, 'photo:poc');
    m.photoIdx++;
    showNextPhoto();
  };
  $get('photoSkip').onclick = () => { m.photoIdx++; showNextPhoto(); };
}

// ============================================================
// MODE 4 — TIME ATTACK
// ============================================================
function startTimeAttack() {
  showView('timeattackView', `
    <header class="mode-header" style="background:${MODES.timeattack.color}">
      ${backBtn('timeattack')}
      <h2>⏱️ Mode Express</h2>
      <p>30 min pour trouver le max d'œuvres</p>
    </header>
    <div class="mode-content">
      <div class="ta-timer" id="taTimerText">30:00</div>
      <div class="ta-stats">
        <div class="stat"><div class="stat-label">Œuvres</div><div class="stat-value" id="taCount">0</div></div>
        <div class="stat"><div class="stat-label">Score</div><div class="stat-value" id="taScore">0</div></div>
      </div>
      <div class="ta-categories" id="taCategories">${Object.entries(CATEGORIES).map(([k, c]) =>
        `<div class="ta-cat"><span>${c.icon} ${c.label}</span><span class="ta-cat-count" id="taCat-${k}">0</span></div>`
      ).join('')}</div>
      <button class="btn-secondary" id="taStart">Lancer le chrono</button>
    </div>
  `);
  $get('taStart').onclick = () => {
    const sprintDuration = 30 * 60;
    if (state.currentMode.timer) clearInterval(state.currentMode.timer);
    state.currentMode.startTime = Date.now();
    state.currentMode.timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - state.currentMode.startTime) / 1000);
      const remaining = sprintDuration - elapsed;
      if (remaining <= 0) {
        clearInterval(state.currentMode.timer);
        endTimeAttack();
        return;
      }
      const txt = $get('taTimerText');
      if (txt) txt.textContent =
        `${Math.floor(remaining / 60)}:${(remaining % 60).toString().padStart(2, '0')}`;
    }, 1000);
  };
}

function endTimeAttack() {
  const m = state.currentMode;
  addPoints(state, m.score || 0, 'Mode Express');
  showToast('⏱️', 'Temps écoulé !', `${m.foundWorks.length} œuvres`);
  completeMode();
}

// ============================================================
// MODE 5 — PÉDAGOGIE
// ============================================================
function startPedagogy() {
  showView('pedagogyView', `
    <header class="mode-header" style="background:${MODES.pedagogy.color}">
      ${backBtn('pedagogy')}
      <h2>🎓 Pédagogie</h2>
      <p>Quiz adaptés au curriculum QC</p>
    </header>
    <div class="mode-content">
      <div class="pedago-levels" id="pedagoLevels">
        <h3>Niveau</h3>
        <button class="mode-option" data-level="primaire">📚 Primaire (6-12)</button>
        <button class="mode-option" data-level="secondaire">🎒 Secondaire (13-17)</button>
        <button class="mode-option" data-level="collegial">🎓 Collégial (18+)</button>
      </div>
      <div class="pedago-quiz" id="pedagoQuiz" style="display:none">
        <div class="pedago-progress"><span id="pedagoCurrent">0</span>/<span id="pedagoTotal">15</span></div>
        <div class="pedago-question" id="pedagoQuestion"></div>
        <div class="pedago-choices" id="pedagoChoices"></div>
      </div>
      <div class="pedago-result" id="pedagoResult" style="display:none"></div>
    </div>
  `);
  document.querySelectorAll('[data-level]').forEach(btn =>
    btn.addEventListener('click', () => startPedagogyRound(btn.dataset.level)));
}

function startPedagogyRound(level) {
  state.currentMode.level = level;
  state.currentMode.pedagoScore = 0;
  state.currentMode.pedagoIdx = 0;
  state.currentMode.totalQ = 15;
  $get('pedagoLevels').style.display = 'none';
  $get('pedagoQuiz').style.display = 'block';
  nextPedagogyQuestion();
}

function nextPedagogyQuestion() {
  const m = state.currentMode;
  if (m.pedagoIdx >= m.totalQ) return endPedagogy();
  const work = WORKS_DATA[Math.floor(Math.random() * WORKS_DATA.length)];
  if (!work.quiz) return nextPedagogyQuestion();
  $get('pedagoCurrent').textContent = m.pedagoIdx + 1;
  $get('pedagoQuestion').textContent = work.quiz.question;
  $get('pedagoChoices').innerHTML = work.quiz.choices.map((c, i) =>
    `<button class="pedago-choice" data-choice="${i}" data-correct="${work.quiz.correct}">${String.fromCharCode(65 + i)}. ${c}</button>`
  ).join('');
  document.querySelectorAll('.pedago-choice').forEach(btn =>
    btn.addEventListener('click', () => {
      const choice = parseInt(btn.dataset.choice);
      const correct = parseInt(btn.dataset.correct);
      btn.classList.add(choice === correct ? 'correct' : 'wrong');
      if (choice === correct) {
        m.pedagoScore += 100;
        addPoints(state, 50, 'Quiz Pédagogie');
      }
      setTimeout(() => { m.pedagoIdx++; nextPedagogyQuestion(); }, 1200);
    }));
}

function endPedagogy() {
  const m = state.currentMode;
  const pct = (m.pedagoScore / (m.totalQ * 100)) * 100;
  $get('pedagoQuiz').style.display = 'none';
  $get('pedagoResult').style.display = 'block';
  $get('pedagoResult').innerHTML = `
    <h3>📊 Résultat</h3>
    <div class="result-stat"><span>Niveau</span><strong>${m.level}</strong></div>
    <div class="result-stat"><span>Score</span><strong>${m.pedagoScore}/${m.totalQ * 100}</strong></div>
    <div class="result-stat"><span>Pourcentage</span><strong>${pct.toFixed(0)}%</strong></div>
    <p>${pct >= 80 ? '🏆 Excellent !' : pct >= 60 ? '👍 Bien !' : '📚 À améliorer'}</p>
    <button class="btn-secondary" onclick="exitMode()">Retour</button>
  `;
}

// ============================================================
// MODE 6 — HISTOIRES (NEW)
// ============================================================
// Récits d'Alma : anecdotes, témoignages, événements
function startHistoires() {
  const stories = [
    { title: 'L\'inondation de 1947', content: 'En mai 1947, une inondation catastrophique a submergé une grande partie d\'Alma, forçant l\'évacuation de milliers de résidants. L\'événement a marqué à jamais la communauté et a mené à la construction de nouvelles infrastructures de drainage.' },
    { title: 'L\'usine d\'aluminium', content: 'L\'usine d\'Alma, fondée en 1943, est l\'une des plus anciennes du Québec. Elle a employé des générations d\'Almois et a façonné l\'économie régionale.' },
    { title: 'Le chemin de fer', content: 'Le chemin de fer a été déterminant dans la colonisation d\'Alma au début du 20e siècle, permettant l\'arrivée de milliers de pionniers.' },
    { title: 'Le barrage Isle-Maligne', content: 'Construit en 1925, le barrage Isle-Maligne est l\'un des plus anciens ouvrages hydroélectriques du Québec. Il alimentait initialement l\'usine d\'aluminium.' },
    { title: 'La scierie d\'Alma', content: 'Au 19e siècle, l\'industrie forestière était le moteur économique d\'Alma, avec plusieurs scieries qui employaient des centaines d\'ouvriers.' },
    { title: 'Le couvent des Sœurs', content: 'Fondé en 1912, le couvent des Sœurs du Bon-Conseil a formé plus de 3000 enseignantes qui ont éduqué les générations suivantes.' },
    { title: 'Le 50e anniversaire d\'Alma', content: 'En 1967, Alma a célébré son 50e anniversaire avec festivités, monuments commémoratifs, et la visite de dignitaires provinciaux.' },
    { title: 'La Véloroute des Bleuets', content: 'Inaugurée en 1998, la Véloroute fait le tour du lac Saint-Jean, soit 256 km de piste cyclable qui attire des milliers de touristes annuellement.' }
  ];

  showView('histoiresView', `
    <header class="mode-header" style="background:${MODES.histoires.color}">
      ${backBtn('histoires')}
      <h2>📖 Histoires d'Alma</h2>
      <p>8 récits authentiques</p>
    </header>
    <div class="mode-content">
      <div class="story-list" id="storyList">
        ${stories.map((s, i) => `
          <article class="story-card" data-story="${i}">
            <h3>${s.title}</h3>
            <button class="btn-secondary">Lire</button>
          </article>
        `).join('')}
      </div>
      <div class="story-content" id="storyContent" style="display:none">
        <button class="back-btn" id="storyBack">← Retour aux histoires</button>
        <h2 id="storyTitle"></h2>
        <p id="storyText"></p>
        <button class="btn-secondary" id="storyQuiz">Faire le quiz</button>
      </div>
    </div>
  `);
  document.querySelectorAll('.story-card').forEach(card => {
    card.addEventListener('click', () => showStory(stories, parseInt(card.dataset.story)));
  });
}

function showStory(stories, idx) {
  $get('storyList').style.display = 'none';
  $get('storyContent').style.display = 'block';
  $get('storyTitle').textContent = stories[idx].title;
  $get('storyText').textContent = stories[idx].content;
  $get('storyQuiz').onclick = () => {
    // Quiz simple sur l'histoire
    alert('Quiz à implémenter — fonctionnalité V1.1');
  };
  $get('storyBack').onclick = () => {
    $get('storyList').style.display = 'block';
    $get('storyContent').style.display = 'none';
  };
  addPoints(state, 25, 'Histoire lue');
}

// ============================================================
// MODE 7 — MISSION CRÉATIVE (NEW)
// ============================================================
// Création libre autour des œuvres : poèmes, dessins, photos créatives
function startCreative() {
  const selected = pickRandom(WORKS_DATA, 10);
  const missions = [
    'Écris un poème de 8 vers sur cette œuvre',
    'Dessine l\'œuvre de mémoire',
    'Prends une photo en noir et blanc',
    'Compose un acrostiche avec le nom de l\'œuvre',
    'Imagine une histoire de fiction courte',
    'Crée un haïku (3 vers)',
    'Fais un croquis en 5 minutes',
    'Prends 3 photos sous 3 angles différents',
    'Écris une lettre à l\'œuvre',
    'Compose une chanson courte'
  ];
  state.currentMode.creativeWorks = selected.map((w, i) => ({
    ...w,
    mission: missions[i]
  }));
  state.currentMode.creativeIdx = 0;
  state.currentMode.created = [];

  showView('creativeView', `
    <header class="mode-header" style="background:${MODES.creative.color}">
      ${backBtn('creative')}
      <h2>🎨 Atelier Créatif</h2>
      <p>10 œuvres, 10 missions d'art</p>
    </header>
    <div class="mode-content">
      <div class="creative-progress">
        <span id="creativeCurrent">1</span>/<span id="creativeTotal">10</span>
        · Créations : <span id="creativeCount">0</span>
      </div>
      <div class="creative-mission" id="creativeMission"></div>
      <div class="creative-actions">
        <button class="btn-secondary" id="creativeDone">✓ Terminé</button>
        <button class="btn-secondary" id="creativeSkip">⏭️ Passer</button>
      </div>
    </div>
  `);
  showNextCreative();
}

function showNextCreative() {
  const m = state.currentMode;
  const idx = m.creativeIdx;
  if (idx >= m.creativeWorks.length) return completeMode();
  const w = m.creativeWorks[idx];
  $get('creativeCurrent').textContent = idx + 1;
  $get('creativeTotal').textContent = m.creativeWorks.length;
  $get('creativeCount').textContent = m.created.length;
  $get('creativeMission').innerHTML = `
    <div class="creative-work-hero">${w.icon}</div>
    <h3>${w.name}</h3>
    <p class="creative-mission-text">🎨 ${w.mission}</p>
  `;
  $get('creativeDone').onclick = () => {
    m.created.push({ id: w.id, mission: w.mission, ts: Date.now() });
    m.creativeIdx++;
    addPoints(state, 75, 'Création complétée');
    showNextCreative();
  };
  $get('creativeSkip').onclick = () => { m.creativeIdx++; showNextCreative(); };
}

// ============================================================
// MODE 8 — THÉMATIQUE SAISONNIÈRE (NEW)
// ============================================================
// Le mode s'adapte à la saison actuelle (hiver, printemps, été, automne)
const SEASONAL_THEMES = {
  winter: { icon: '❄️', color: '#3498DB', name: 'Hiver', works: ['patrimoine', 'industrie'] },
  spring: { icon: '🌸', color: '#27AE60', name: 'Printemps', works: ['nature'] },
  summer: { icon: '☀️', color: '#F39C12', name: 'Été', works: ['nature', 'savoir'] },
  autumn: { icon: '🍂', color: '#D35400', name: 'Automne', works: ['nature', 'patrimoine'] }
};

function getCurrentSeason() {
  const m = new Date().getMonth() + 1; // 1-12
  if (m === 12 || m <= 2) return 'winter';
  if (m <= 5) return 'spring';
  if (m <= 8) return 'summer';
  return 'autumn';
}

function startThematic() {
  const season = getCurrentSeason();
  const theme = SEASONAL_THEMES[season];
  const works = WORKS_DATA.filter(w => theme.works.includes(w.category));
  const selected = pickRandom(works, 12);

  state.currentMode.season = season;
  state.currentMode.thematicWorks = selected;

  showView('thematicView', `
    <header class="mode-header" style="background:${theme.color}">
      ${backBtn('thematic')}
      <h2>${theme.icon} Thématique ${theme.name}</h2>
      <p>12 œuvres de saison</p>
    </header>
    <div class="mode-content">
      <div class="thematic-progress"><span id="thematicCurrent">0</span>/<span id="thematicTotal">12</span></div>
      <div class="thematic-list" id="thematicList">
        ${selected.map((w, i) => `
          <article class="thematic-card" data-thematic="${i}">
            <div class="thematic-icon">${w.icon}</div>
            <h3>${w.name}</h3>
            <span>${CATEGORIES[w.category].label}</span>
          </article>
        `).join('')}
      </div>
    </div>
  `);
  document.querySelectorAll('.thematic-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.thematic);
      const work = selected[idx];
      markFound(state, work.id);
      addPoints(state, 50, `Thématique ${theme.name}`);
      $get('thematicCurrent').textContent = state.foundWorks.filter(id => selected.find(w => w.id === id)).length;
      if (parseInt($get('thematicCurrent').textContent) >= 12) completeMode();
    });
  });
}

// ============================================================
// MODE 9 — TRIVIA EXPRESS (NEW)
// ============================================================
function startTrivia() {
  state.currentMode.triviaScore = 0;
  state.currentMode.triviaIdx = 0;
  state.currentMode.totalQ = 10;

  showView('triviaView', `
    <header class="mode-header" style="background:${MODES.trivia.color}">
      ${backBtn('trivia')}
      <h2>⚡ Quiz Rapide</h2>
      <p>10 questions, 60 secondes chacune</p>
    </header>
    <div class="mode-content">
      <div class="trivia-progress">
        <span id="triviaCurrent">0</span>/<span id="triviaTotal">10</span>
        · Score : <span id="triviaScore">0</span>
      </div>
      <div class="trivia-question" id="triviaQuestion"></div>
      <div class="trivia-choices" id="triviaChoices"></div>
    </div>
  `);
  nextTriviaQuestion();
}

function nextTriviaQuestion() {
  const m = state.currentMode;
  if (m.triviaIdx >= m.totalQ) return endTrivia();
  const work = WORKS_DATA[Math.floor(Math.random() * WORKS_DATA.length)];
  if (!work.quiz) return nextTriviaQuestion();
  $get('triviaCurrent').textContent = m.triviaIdx + 1;
  $get('triviaTotal').textContent = m.totalQ;
  $get('triviaQuestion').textContent = work.quiz.question;
  $get('triviaChoices').innerHTML = work.quiz.choices.map((c, i) =>
    `<button class="trivia-choice" data-choice="${i}" data-correct="${work.quiz.correct}">${String.fromCharCode(65 + i)}. ${c}</button>`
  ).join('');

  let timeLeft = 6;
  if (m.triviaTimer) clearInterval(m.triviaTimer);
  m.triviaTimer = setInterval(() => {
    if (--timeLeft <= 0) {
      clearInterval(m.triviaTimer);
      m.triviaIdx++;
      nextTriviaQuestion();
    }
  }, 1000);

  document.querySelectorAll('.trivia-choice').forEach(btn =>
    btn.addEventListener('click', () => {
      clearInterval(m.triviaTimer);
      const choice = parseInt(btn.dataset.choice);
      const correct = parseInt(btn.dataset.correct);
      btn.classList.add(choice === correct ? 'correct' : 'wrong');
      if (choice === correct) {
        m.triviaScore += 100;
        $get('triviaScore').textContent = m.triviaScore;
        addPoints(state, 50, 'Quiz Rapide');
      }
      setTimeout(() => { m.triviaIdx++; nextTriviaQuestion(); }, 800);
    }));
}

function endTrivia() {
  const m = state.currentMode;
  const max = m.totalQ * 100;
  const pct = (m.triviaScore / max) * 100;
  addPoints(state, m.triviaScore, 'Quiz Rapide complété');
  showToast('⚡', 'Trivia terminée !', `${m.triviaScore}/${max} (${pct.toFixed(0)}%)`);
  completeMode();
}

// ============================================================
// MODE 10 — GALERIE PHOTO (NEW)
// ============================================================
function startGallery() {
  // Show all found works as a personal gallery
  const foundWorks = state.foundWorks
    .map(id => WORKS_DATA.find(w => w.id === id))
    .filter(w => w);

  showView('galleryView', `
    <header class="mode-header" style="background:${MODES.gallery.color}">
      ${backBtn('gallery')}
      <h2>🖼️ Galerie Photo</h2>
      <p>${foundWorks.length} œuvre${foundWorks.length > 1 ? 's' : ''} découverte${foundWorks.length > 1 ? 's' : ''}</p>
    </header>
    <div class="mode-content">
      <div class="gallery-stats">
        <span>Photos : ${Object.keys(state.photosTaken).length}</span>
        <span>Partages : ${state.shareCount}</span>
        <span>Favoris : ${state.foundWorks.length}</span>
      </div>
      <div class="gallery-grid" id="galleryGrid">
        ${foundWorks.length === 0
          ? '<p class="empty-msg">Aucune œuvre découverte encore. Explore Alma !</p>'
          : foundWorks.map(w => `
            <article class="gallery-card">
              <div class="gallery-icon">${w.icon}</div>
              <h3>${w.name}</h3>
              <span>${CATEGORIES[w.category].label}</span>
            </article>
          `).join('')}
      </div>
    </div>
  `);
}

// ============================================================
// MODE 11 — TABLEAU PROF (NEW)
// ============================================================
function startTeacher() {
  // Simulated dashboard for a teacher tracking students
  const studentStats = (state.teacherStats && state.teacherStats.length)
    ? state.teacherStats
    : generateMockStudents();

  if (!state.teacherStats) state.teacherStats = studentStats;

  showView('teacherView', `
    <header class="mode-header" style="background:${MODES.teacher.color}">
      ${backBtn('teacher')}
      <h2>👩‍🏫 Tableau Prof</h2>
      <p>${studentStats.length} élèves dans la classe</p>
    </header>
    <div class="mode-content">
      <div class="teacher-stats">
        <div class="teacher-stat">
          <div class="stat-label">Élèves actifs</div>
          <div class="stat-value">${studentStats.filter(s => s.lastActive > Date.now() - 3600000).length}/${studentStats.length}</div>
        </div>
        <div class="teacher-stat">
          <div class="stat-label">Œuvres totales</div>
          <div class="stat-value">${studentStats.reduce((sum, s) => sum + s.worksFound, 0)}</div>
        </div>
      </div>
      <div class="teacher-table">
        ${studentStats.map((s, i) => `
          <article class="teacher-row" data-student="${i}">
            <div class="teacher-name">${s.name}</div>
            <div class="teacher-bar">
              <div class="teacher-bar-fill" style="width:${(s.worksFound / 50) * 100}%"></div>
            </div>
            <div class="teacher-count">${s.worksFound}/50</div>
            <div class="teacher-score">${s.score} pts</div>
          </article>
        `).join('')}
      </div>
      <button class="btn-secondary" id="teacherExport">📥 Exporter CSV</button>
    </div>
  `);
  $get('teacherExport').onclick = exportTeacherCSV;
}

function generateMockStudents() {
  const names = ['Alice', 'Bob', 'Charlie', 'Daria', 'Eve', 'Frank', 'Grace', 'Hugo'];
  return names.map(name => ({
    name,
    worksFound: Math.floor(Math.random() * 50),
    score: Math.floor(Math.random() * 5000),
    lastActive: Date.now() - Math.floor(Math.random() * 7200000)
  }));
}

function exportTeacherCSV() {
  const students = state.teacherStats || [];
  const csv = 'Nom,Oeuvres,Score,Activite\n' +
    students.map(s =>
      `${s.name},${s.worksFound},${s.score},${new Date(s.lastActive).toLocaleString('fr-CA')}`
    ).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rallye-alma-classe-${Date.now()}.csv`;
  a.click();
  showToast('📥', 'CSV exporté !', `${students.length} élèves`);
}
