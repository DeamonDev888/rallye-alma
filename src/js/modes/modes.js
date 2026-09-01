/* ============================================================
   MODES — Système de modes de jeu
   5 modes : Visite Guidée, Quiz Battle, Photo Mission,
             Time Attack, Pédagogie
   ============================================================ */

const MODES = {
  guided: {
    id: "guided",
    name: "Visite Guidée",
    icon: "🚶",
    color: "#457B9D",
    description: "Suivez un parcours automatique avec narration audio",
    duration: "60-90 min",
    works: 10,
    level: "Tous",
    features: [
      "Audio narré pour chaque œuvre",
      "GPS guide le parcours",
      "Pas de quiz — focus histoire",
      "Idéal pour familles"
    ]
  },
  battle: {
    id: "battle",
    name: "Quiz Battle",
    icon: "⚔️",
    color: "#E63946",
    description: "Affrontez une autre classe en quiz rapide",
    duration: "20-30 min",
    works: 15,
    level: "Secondaire",
    features: [
      "1v1 ou équipe vs équipe",
      "Questions chronométrées (10s)",
      "Classement live",
      "Mode Battle Royale (3-10 classes)"
    ]
  },
  photo: {
    id: "photo",
    name: "Photo Mission",
    icon: "📸",
    color: "#F4A261",
    description: "Relevez des défis créatifs devant chaque œuvre",
    duration: "2-3 heures",
    works: 20,
    level: "Primaire+",
    features: [
      "Mission créative par œuvre",
      "Galerie des meilleures photos",
      "Vote du public",
      "AR filters disponibles"
    ]
  },
  timeattack: {
    id: "timeattack",
    name: "Time Attack",
    icon: "⏱️",
    color: "#2A9D8F",
    description: "Trouvez le max d'œuvres en temps limité",
    duration: "30 min ou 2h",
    works: 50,
    level: "Tous",
    features: [
      "Chronomètre par catégorie",
      "Bonus temps pour les œuvres rares",
      "Classement par temps",
      "Mode Sprint (30min) ou Marathon (2h)"
    ]
  },
  pedagogy: {
    id: "pedagogy",
    name: "Pédagogie",
    icon: "🎓",
    color: "#8B4513",
    description: "Quiz adaptés au niveau scolaire avec progression",
    duration: "Selon niveau",
    works: 50,
    level: "Primaire / Secondaire / Collégial",
    features: [
      "3 niveaux : Primaire (6-12), Secondaire (13-17), Collégial (18+)",
      "Questions adaptées au curriculum QC",
      "Rapport de progression par compétence",
      "Compatible avec bulletin scolaire"
    ]
  }
};

let currentMode = null;

function showModeSelector() {
  const grid = document.getElementById('modesGrid');
  if (!grid) return;

  grid.innerHTML = Object.values(MODES).map(mode => `
    <article class="mode-card" data-mode="${mode.id}" style="border-left: 4px solid ${mode.color}">
      <div class="mode-icon">${mode.icon}</div>
      <h3>${mode.name}</h3>
      <p class="mode-desc">${mode.description}</p>
      <div class="mode-meta">
        <span class="mode-badge">⏱️ ${mode.duration}</span>
        <span class="mode-badge">🏛️ ${mode.works} œuvres</span>
        <span class="mode-badge">📚 ${mode.level}</span>
      </div>
      <button class="btn-mode-start" data-mode="${mode.id}">
        Démarrer
      </button>
    </article>
  `).join('');

  // Bind start buttons
  grid.querySelectorAll('.btn-mode-start').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      startMode(btn.dataset.mode);
    });
  });
}

function startMode(modeId) {
  const mode = MODES[modeId];
  if (!mode) return;

  currentMode = mode;
  state.currentMode = {
    id: modeId,
    startTime: Date.now(),
    foundWorks: [],
    score: 0,
    completed: false
  };

  saveState(state);
  switchView(modeId + 'View');

  // Dispatch to mode-specific starter
  if (modeId === 'guided') startGuidedMode();
  else if (modeId === 'battle') startBattleMode();
  else if (modeId === 'photo') startPhotoMode();
  else if (modeId === 'timeattack') startTimeAttackMode();
  else if (modeId === 'pedagogy') startPedagogyMode();
}

// === MODE: VISITE GUIDÉE ===
function startGuidedMode() {
  const mode = state.currentMode;
  // Pick 10 works close to a starting point
  const startWork = WORKS_DATA[Math.floor(Math.random() * 10)];
  const guidedWorks = [startWork];

  // Find nearby works
  for (const work of WORKS_DATA) {
    if (guidedWorks.length >= 10) break;
    const dist = getDistance(startWork.coords[0], startWork.coords[1],
                              work.coords[0], work.coords[1]);
    if (dist < 2000) guidedWorks.push(work);
  }

  mode.works = guidedWorks.map(w => w.id);

  // Show guided UI
  const guidedView = document.getElementById('guidedView');
  if (!guidedView) return;

  guidedView.innerHTML = `
    <header class="mode-header" style="background: ${MODES.guided.color}">
      <button class="back-btn" onclick="exitMode()">← Quitter</button>
      <h2>🚶 Visite Guidée d'Alma</h2>
      <p>Suivez le parcours, écoutez l'histoire</p>
    </header>
    <div class="mode-content">
      <div class="guided-progress">
        <div class="progress-info">
          <span id="guidedCurrent">1</span>/<span id="guidedTotal">10</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" id="guidedProgressFill"></div></div>
      </div>
      <div class="guided-next" id="guidedNext">
        <h3>📍 Prochaine œuvre</h3>
        <p>Approchez-vous pour commencer</p>
      </div>
      <div class="guided-current-work" id="guidedCurrentWork" style="display:none">
        <div class="guided-hero">🎯</div>
        <h2 id="guidedTitle"></h2>
        <p id="guidedDesc"></p>
        <button class="btn-secondary" id="guidedNextBtn">Continuer →</button>
      </div>
    </div>
  `;

  showNextGuidedWork();
}

function showNextGuidedWork() {
  const mode = state.currentMode;
  const idx = mode.foundWorks.length;
  if (idx >= mode.works.length) {
    completeMode();
    return;
  }

  document.getElementById('guidedCurrent').textContent = idx + 1;
  document.getElementById('guidedTotal').textContent = mode.works.length;
  const pct = (idx / mode.works.length) * 100;
  document.getElementById('guidedProgressFill').style.width = pct + '%';

  if (idx > 0) {
    const prevWork = WORKS_DATA.find(w => w.id === mode.works[idx - 1]);
    document.getElementById('guidedCurrentWork').style.display = 'block';
    document.getElementById('guidedNext').style.display = 'none';
    document.getElementById('guidedTitle').textContent = prevWork.name;
    document.getElementById('guidedDesc').textContent = prevWork.description;
  }

  const nextWorkId = mode.works[idx];
  const nextWork = WORKS_DATA.find(w => w.id === nextWorkId);
  document.getElementById('guidedNext').innerHTML = `
    <h3>📍 Prochaine œuvre</h3>
    <p>${nextWork.name} — ${(getDistanceFromCurrent(nextWork.coords[0], nextWork.coords[1]) / 1000).toFixed(1)} km</p>
  `;
}

// === MODE: QUIZ BATTLE ===
function startBattleMode() {
  const battleView = document.getElementById('battleView');
  if (!battleView) return;

  battleView.innerHTML = `
    <header class="mode-header" style="background: ${MODES.battle.color}">
      <button class="back-btn" onclick="exitMode()">← Quitter</button>
      <h2>⚔️ Quiz Battle</h2>
      <p>Affrontez en quiz rapide</p>
    </header>
    <div class="mode-content">
      <div class="battle-lobby" id="battleLobby">
        <h3>Choisissez votre mode</h3>
        <div class="battle-modes">
          <button class="mode-option" data-battle="solo">🎯 Solo (10 questions)</button>
          <button class="mode-option" data-battle="duel">⚔️ Duel 1v1 (15 questions)</button>
          <button class="mode-option" data-battle="royale">👥 Battle Royale (3-10 joueurs)</button>
        </div>
      </div>
      <div class="battle-quiz" id="battleQuiz" style="display:none">
        <div class="battle-hud">
          <div class="battle-player" id="battlePlayer1">
            <div class="battle-name">VOUS</div>
            <div class="battle-score" id="battleScore1">0</div>
          </div>
          <div class="battle-timer" id="battleTimer">10</div>
          <div class="battle-player" id="battlePlayer2">
            <div class="battle-name">CPU</div>
            <div class="battle-score" id="battleScore2">0</div>
          </div>
        </div>
        <div class="battle-question">
          <h3 id="battleQuestion"></h3>
          <div id="battleChoices" class="battle-choices"></div>
        </div>
      </div>
      <div class="battle-result" id="battleResult" style="display:none"></div>
    </div>
  `;

  document.querySelectorAll('.mode-option').forEach(btn => {
    btn.addEventListener('click', () => startBattleRound(btn.dataset.battle));
  });
}

function startBattleRound(mode) {
  state.currentMode.battleMode = mode;
  state.currentMode.score1 = 0;
  state.currentMode.score2 = 0;
  state.currentMode.currentQ = 0;
  state.currentMode.totalQ = mode === 'solo' ? 10 : 15;

  document.getElementById('battleLobby').style.display = 'none';
  document.getElementById('battleQuiz').style.display = 'block';

  nextBattleQuestion();
}

function nextBattleQuestion() {
  const mode = state.currentMode;
  if (mode.currentQ >= mode.totalQ) {
    endBattle();
    return;
  }

  // Random work question
  const work = WORKS_DATA[Math.floor(Math.random() * WORKS_DATA.length)];
  if (!work.quiz) return nextBattleQuestion();

  document.getElementById('battleQuestion').textContent = work.quiz.question;
  document.getElementById('battleChoices').innerHTML = work.quiz.choices.map((c, i) => `
    <button class="battle-choice" data-choice="${i}" data-correct="${work.quiz.correct}">
      ${String.fromCharCode(65 + i)}. ${c}
    </button>
  `).join('');

  // Timer
  let timeLeft = 10;
  document.getElementById('battleTimer').textContent = timeLeft;
  const timer = setInterval(() => {
    timeLeft--;
    document.getElementById('battleTimer').textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      cpuAnswers();
    }
  }, 1000);
  mode.timer = timer;

  // Bind choices
  document.querySelectorAll('.battle-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      clearInterval(mode.timer);
      const choice = parseInt(btn.dataset.choice);
      const correct = parseInt(btn.dataset.correct);

      btn.classList.add(choice === correct ? 'correct' : 'wrong');
      if (choice === correct) {
        mode.score1 += 100;
        document.getElementById('battleScore1').textContent = mode.score1;
      }

      // CPU answers
      setTimeout(() => {
        cpuAnswers();
        setTimeout(() => nextBattleQuestion(), 1500);
      }, 500);
    });
  });
}

function cpuAnswers() {
  const mode = state.currentMode;
  const correct = Math.random() < 0.65; // 65% accuracy
  if (correct) {
    mode.score2 += 100;
    document.getElementById('battleScore2').textContent = mode.score2;
  }
  mode.currentQ++;
}

function endBattle() {
  const mode = state.currentMode;
  const won = mode.score1 > mode.score2;
  document.getElementById('battleQuiz').style.display = 'none';
  const result = document.getElementById('battleResult');
  result.style.display = 'block';
  result.innerHTML = `
    <h3>${won ? '🏆 Victoire !' : '💪 Bonne tentative !'}</h3>
    <p>Score final : <strong>${mode.score1}</strong> vs <strong>${mode.score2}</strong></p>
    <button class="btn-secondary" onclick="exitMode()">Retour aux modes</button>
  `;
  addPoints(state, won ? 200 : 50, 'Quiz Battle');
}

// === MODE: PHOTO MISSION ===
function startPhotoMode() {
  const photoView = document.getElementById('photoView');
  if (!photoView) return;

  // Pick 20 random works with creative missions
  const missions = [
    "Prends une photo créative avec l'œuvre",
    "Photographie l'œuvre sous un angle inhabituel",
    "Capture l'œuvre avec le paysage en arrière-plan",
    "Fais un selfie avec l'œuvre",
    "Photographie un détail artistique de l'œuvre"
  ];

  const selectedWorks = [...WORKS_DATA]
    .sort(() => Math.random() - 0.5)
    .slice(0, 20)
    .map(w => ({
      ...w,
      mission: missions[Math.floor(Math.random() * missions.length)]
    }));

  state.currentMode.photoWorks = selectedWorks;
  state.currentMode.photoIdx = 0;

  photoView.innerHTML = `
    <header class="mode-header" style="background: ${MODES.photo.color}">
      <button class="back-btn" onclick="exitMode()">← Quitter</button>
      <h2>📸 Photo Mission</h2>
      <p>20 œuvres, 20 défis créatifs</p>
    </header>
    <div class="mode-content">
      <div class="photo-progress">
        <span id="photoCurrent">1</span>/<span id="photoTotal">20</span>
      </div>
      <div class="photo-mission" id="photoMission"></div>
      <div class="photo-actions">
        <button class="btn-secondary" id="photoCamera">📷 Prendre photo</button>
        <button class="btn-secondary" id="photoSkip">⏭️ Passer</button>
      </div>
    </div>
  `;

  showNextPhoto();
}

function showNextPhoto() {
  const mode = state.currentMode;
  const idx = mode.photoIdx;
  if (idx >= mode.photoWorks.length) {
    completeMode();
    return;
  }
  const w = mode.photoWorks[idx];
  document.getElementById('photoCurrent').textContent = idx + 1;
  document.getElementById('photoTotal').textContent = mode.photoWorks.length;
  document.getElementById('photoMission').innerHTML = `
    <div class="photo-work-hero">${w.icon}</div>
    <h3>${w.name}</h3>
    <p class="photo-mission-text">🎯 ${w.mission}</p>
  `;

  document.getElementById('photoCamera').onclick = () => {
    addPoints(state, 50, 'Photo Mission');
    savePhoto(state, w.id, 'photo:poc');
    mode.photoIdx++;
    showNextPhoto();
  };
  document.getElementById('photoSkip').onclick = () => {
    mode.photoIdx++;
    showNextPhoto();
  };
}

// === MODE: TIME ATTACK ===
function startTimeAttackMode() {
  const taView = document.getElementById('timeattackView');
  if (!taView) return;

  const sprintDuration = 30 * 60; // 30 min for sprint

  taView.innerHTML = `
    <header class="mode-header" style="background: ${MODES.timeattack.color}">
      <button class="back-btn" onclick="exitMode()">← Quitter</button>
      <h2>⏱️ Time Attack</h2>
      <p>Trouvez le plus d'œuvres en 30 minutes</p>
    </header>
    <div class="mode-content">
      <div class="ta-timer" id="taTimer">30:00</div>
      <div class="ta-stats">
        <div class="stat">
          <div class="stat-label">Œuvres</div>
          <div class="stat-value" id="taCount">0</div>
        </div>
        <div class="stat">
          <div class="stat-label">Score</div>
          <div class="stat-value" id="taScore">0</div>
        </div>
      </div>
      <div class="ta-categories" id="taCategories"></div>
      <button class="btn-secondary" id="taStart">Démarrer le chrono</button>
    </div>
  `;

  document.getElementById('taCategories').innerHTML = Object.entries(CATEGORIES).map(([k, c]) => `
    <div class="ta-cat">
      <span>${c.icon} ${c.label}</span>
      <span class="ta-cat-count" id="taCat-${k}">0</span>
    </div>
  `).join('');

  document.getElementById('taStart').onclick = () => {
    state.currentMode.startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - state.currentMode.startTime) / 1000);
      const remaining = sprintDuration - elapsed;
      if (remaining <= 0) {
        clearInterval(timer);
        endTimeAttack();
        return;
      }
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      document.getElementById('taTimer').textContent =
        `${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
  };
}

function endTimeAttack() {
  const mode = state.currentMode;
  const score = mode.score || 0;
  const count = mode.foundWorks.length;
  addPoints(state, score, 'Time Attack terminé');
  completeMode();
  showToast('⏱️', 'Temps écoulé !', `${count} œuvres, ${score} points`);
}

// === MODE: PÉDAGOGIE ===
function startPedagogyMode() {
  const pedagoView = document.getElementById('pedagogyView');
  if (!pedagoView) return;

  pedagoView.innerHTML = `
    <header class="mode-header" style="background: ${MODES.pedagogy.color}">
      <button class="back-btn" onclick="exitMode()">← Quitter</button>
      <h2>🎓 Pédagogie</h2>
      <p>Quiz adaptés au curriculum QC</p>
    </header>
    <div class="mode-content">
      <div class="pedago-levels">
        <h3>Choisissez votre niveau</h3>
        <button class="mode-option" data-level="primaire">📚 Primaire (6-12 ans)</button>
        <button class="mode-option" data-level="secondaire">🎒 Secondaire (13-17 ans)</button>
        <button class="mode-option" data-level="collegial">🎓 Collégial (18+)</button>
      </div>
      <div class="pedago-quiz" id="pedagoQuiz" style="display:none">
        <div class="pedago-progress">
          <span id="pedagoCurrent">0</span>/<span id="pedagoTotal">15</span>
        </div>
        <div class="pedago-question" id="pedagoQuestion"></div>
        <div class="pedago-choices" id="pedagoChoices"></div>
      </div>
      <div class="pedago-result" id="pedagoResult" style="display:none"></div>
    </div>
  `;

  document.querySelectorAll('[data-level]').forEach(btn => {
    btn.addEventListener('click', () => startPedagogyRound(btn.dataset.level));
  });
}

function startPedagogyRound(level) {
  state.currentMode.level = level;
  state.currentMode.pedagoScore = 0;
  state.currentMode.pedagoIdx = 0;
  state.currentMode.totalQ = 15;

  // Adjust difficulty based on level
  state.currentMode.difficulty = level === 'primaire' ? 0.7 : level === 'secondaire' ? 1.0 : 1.3;

  document.querySelector('.pedago-levels').style.display = 'none';
  document.getElementById('pedagoQuiz').style.display = 'block';
  document.getElementById('pedagoTotal').textContent = 15;

  nextPedagogyQuestion();
}

function nextPedagogyQuestion() {
  const mode = state.currentMode;
  if (mode.pedagoIdx >= mode.totalQ) {
    endPedagogy();
    return;
  }

  const work = WORKS_DATA[Math.floor(Math.random() * WORKS_DATA.length)];
  if (!work.quiz) return nextPedagogyQuestion();

  document.getElementById('pedagoCurrent').textContent = mode.pedagoIdx + 1;
  document.getElementById('pedagoQuestion').textContent = work.quiz.question;
  document.getElementById('pedagoChoices').innerHTML = work.quiz.choices.map((c, i) => `
    <button class="pedago-choice" data-choice="${i}" data-correct="${work.quiz.correct}">
      ${String.fromCharCode(65 + i)}. ${c}
    </button>
  `).join('');

  document.querySelectorAll('.pedago-choice').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const choice = parseInt(btn.dataset.choice);
      const correct = parseInt(btn.dataset.correct);
      btn.classList.add(choice === correct ? 'correct' : 'wrong');

      if (choice === correct) {
        mode.pedagoScore += 100;
        addPoints(state, 50, 'Quiz Pédagogie');
      }

      setTimeout(() => {
        mode.pedagoIdx++;
        nextPedagogyQuestion();
      }, 1200);
    });
  });
}

function endPedagogy() {
  const mode = state.currentMode;
  const pct = (mode.pedagoScore / (mode.totalQ * 100)) * 100;
  document.getElementById('pedagoQuiz').style.display = 'none';
  const result = document.getElementById('pedagoResult');
  result.style.display = 'block';
  result.innerHTML = `
    <h3>📊 Résultat</h3>
    <div class="result-stat">
      <span>Niveau</span>
      <strong>${mode.level}</strong>
    </div>
    <div class="result-stat">
      <span>Score</span>
      <strong>${mode.pedagoScore}/${mode.totalQ * 100}</strong>
    </div>
    <div class="result-stat">
      <span>Pourcentage</span>
      <strong>${pct.toFixed(0)}%</strong>
    </div>
    <p>${pct >= 80 ? '🏆 Excellent !' : pct >= 60 ? '👍 Bien !' : '📚 À améliorer'}</p>
    <button class="btn-secondary" onclick="exitMode()">Retour</button>
  `;
}

// === COMMON ===
function completeMode() {
  const mode = state.currentMode;
  mode.completed = true;
  addPoints(state, 300, 'Mode complété');
  showToast('🏆', 'Mode complété !', '+300 points');
  updateUI();
  setTimeout(() => exitMode(), 3000);
}

function exitMode() {
  currentMode = null;
  state.currentMode = null;
  saveState(state);
  switchView('modesView');
}

function getDistanceFromCurrent(lat, lng) {
  if (!state.currentLocation) return Infinity;
  return getDistance(state.currentLocation.lat, state.currentLocation.lng, lat, lng);
}