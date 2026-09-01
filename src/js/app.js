/* ============================================================
   APP — Main controller, navigation, UI updates
   ============================================================ */

let state = null;

function initApp() {
  state = loadState();
  setupNavigation();
  setupWorksView();
  setupQuiz();
  initMap();
  updateUI();
  renderBadgesGrid();

  console.log('🎯 Rallye des 50 d\'Alma initialisé');
  console.log(`📊 État : ${state.foundWorks.length}/50 œuvres, ${state.points} points`);
}

function setupNavigation() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      switchView(view);
    });
  });
}

function switchView(viewName) {
  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.dataset.view === viewName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Show view
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  const target = document.getElementById(viewName);
  if (target) target.classList.add('active');

  // Refresh data on view switch
  if (viewName === 'worksView') renderWorksGrid();
  if (viewName === 'badgesView') renderBadgesGrid();
  if (viewName === 'hofView' && typeof renderHallOfFame === 'function') renderHallOfFame('hofContent');
  if (viewName === 'modesView' && typeof showModeSelector === 'function') showModeSelector();
  if (viewName === 'mapView' && map) {
    setTimeout(() => map.invalidateSize(), 100);
  }
}

function updateUI() {
  document.getElementById('userPoints').textContent = state.points;
  document.getElementById('userFound').textContent = state.foundWorks.length;
  document.getElementById('userBadges').textContent = state.badges.length;
}

function renderBadgesGrid() {
  const grid = document.getElementById('badgesGrid');
  if (!grid) return;

  const badges = renderBadges(state);
  grid.innerHTML = badges.map(badge => `
    <div class="badge-card ${badge.unlocked ? 'unlocked' : ''}">
      <div class="badge-icon">${badge.icon}</div>
      <div class="badge-name">${badge.name}</div>
      <div class="badge-desc">${badge.description}</div>
    </div>
  `).join('');
}

// === TOASTS ===
function showToast(icon, title, desc) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-title">${icon} ${title}</div>
    ${desc ? `<div class="toast-desc">${desc}</div>` : ''}
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// === START ===
document.addEventListener('DOMContentLoaded', initApp);

// === DEBUG ===
window.rallye = {
  state: () => state,
  reset: () => {
    state = resetState();
    updateUI();
    renderBadgesGrid();
    location.reload();
  }
};