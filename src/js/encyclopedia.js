/* ============================================================
   ENCYCLOPEDIA — Affichage des œuvres + filtres + recherche
   ============================================================ */

let currentFilter = 'all';
let currentSearch = '';
let currentWorkId = null;

function renderWorksGrid() {
  const grid = document.getElementById('worksGrid');
  if (!grid) return;

  let works = [...WORKS_DATA];

  // Filter by category
  if (currentFilter !== 'all') {
    works = works.filter(w => w.category === currentFilter);
  }

  // Filter by search
  if (currentSearch) {
    const search = currentSearch.toLowerCase();
    works = works.filter(w =>
      w.name.toLowerCase().includes(search) ||
      w.description.toLowerCase().includes(search)
    );
  }

  if (works.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--color-text-light);">
        <div style="font-size: 48px;">🔍</div>
        <p style="margin-top: 16px;">Aucune œuvre trouvée</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = works.map(work => `
    <article class="work-card ${state.foundWorks.includes(work.id) ? 'found' : ''}" data-work-id="${work.id}">
      <div class="work-card-image">
        ${work.icon}
      </div>
      <div class="work-card-content">
        <div class="work-card-category">${CATEGORIES[work.category].icon} ${CATEGORIES[work.category].label}</div>
        <h3 class="work-card-title">${work.name}</h3>
        <p class="work-card-desc">${work.description}</p>
        ${state.foundWorks.includes(work.id) ? `
          <div class="work-card-status">
            ✓ Découverte
          </div>
        ` : ''}
      </div>
    </article>
  `).join('');

  // Bind clicks
  grid.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('click', () => {
      const workId = parseInt(card.dataset.workId);
      showWorkDetail(workId);
    });
  });
}

function showWorkDetail(workId) {
  const work = WORKS_DATA.find(w => w.id === workId);
  if (!work) return;

  currentWorkId = workId;
  const detail = document.getElementById('workDetail');
  const cat = CATEGORIES[work.category];
  const isFound = state.foundWorks.includes(work.id);

  detail.innerHTML = `
    <div class="work-detail-hero">${work.icon}</div>
    <h2>${work.name}</h2>
    <div class="work-detail-meta">
      <span>${cat.icon} ${cat.label}</span>
      ${work.year ? `<span>📅 ${work.year}</span>` : ''}
      ${work.artist ? `<span>👤 ${work.artist}</span>` : ''}
    </div>

    ${isFound ? `
      <div class="work-detail-section">
        <h3>📖 Histoire</h3>
        <p>${work.description}</p>
      </div>

      <div class="work-detail-section">
        <h3>💡 Anecdote</h3>
        <p>${work.anecdote}</p>
      </div>

      <div class="work-detail-section" style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn-secondary" id="takeQuizBtn">📝 Faire le quiz</button>
        <button class="btn-secondary" id="takePhotoBtn">📷 Prendre une photo</button>
        <button class="btn-secondary" id="shareBtn">📤 Partager</button>
      </div>
    ` : `
      <div class="work-detail-section">
        <p style="color: var(--color-text-light); font-style: italic;">
          📍 Approchez-vous de cette œuvre pour débloquer son histoire et son anecdote.
        </p>
      </div>
    `}
  `;

  // Bind actions
  const quizBtn = document.getElementById('takeQuizBtn');
  if (quizBtn) {
    quizBtn.addEventListener('click', () => openQuiz(workId));
  }
  const photoBtn = document.getElementById('takePhotoBtn');
  if (photoBtn) {
    photoBtn.addEventListener('click', () => takePhoto(workId));
  }
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => shareWork(work));
  }

  switchView('workDetailView');
}

function setupWorksView() {
  // Search
  const search = document.getElementById('searchWorks');
  if (search) {
    search.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      renderWorksGrid();
    });
  }

  // Filters
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      renderWorksGrid();
    });
  });

  // Back button
  const back = document.getElementById('backToWorks');
  if (back) {
    back.addEventListener('click', () => switchView('worksView'));
  }
}

function takePhoto(workId) {
  // POC : stub photo
  showToast('📷', 'Photo enregistrée !', '+25 points');
  // In real version: navigator.camera or input file
  savePhoto(state, workId, 'data:image/png;base64,poc');
}

function shareWork(work) {
  showToast('📤', 'Lien copié !', 'Merci pour le partage');
  if (navigator.share) {
    navigator.share({
      title: work.name,
      text: `Je viens de découvrir ${work.name} dans le Rallye des 50 d'Alma !`,
      url: location.href
    });
  }
}