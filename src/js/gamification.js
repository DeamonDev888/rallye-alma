/* ============================================================
   GAMIFICATION — Système de badges et achievements
   ============================================================ */

const BADGES = [
  {
    id: "first_step",
    name: "Premier pas",
    description: "Trouvez votre première œuvre",
    icon: "🥉",
    condition: (state) => state.foundWorks.length >= 1
  },
  {
    id: "explorer",
    name: "Explorateur",
    description: "Trouvez 10 œuvres",
    icon: "🥈",
    condition: (state) => state.foundWorks.length >= 10
  },
  {
    id: "conqueror",
    name: "Conquérant",
    description: "Trouvez 25 œuvres",
    icon: "🥇",
    condition: (state) => state.foundWorks.length >= 25
  },
  {
    id: "master",
    name: "Maître d'Alma",
    description: "Trouvez toutes les 50 œuvres",
    icon: "💎",
    condition: (state) => state.foundWorks.length >= 50
  },
  {
    id: "photographer",
    name: "Photo-graphe",
    description: "Prenez 5 photos d'œuvres",
    icon: "📸",
    condition: (state) => Object.keys(state.photosTaken).length >= 5
  },
  {
    id: "cinephile",
    name: "Cinéphile",
    description: "Partagez 3 fois sur les réseaux",
    icon: "🎬",
    condition: (state) => state.shareCount >= 3
  },
  {
    id: "scholar",
    name: "Érudit",
    description: "Réussissez 20 quiz",
    icon: "🧠",
    condition: (state) => {
      const total = Object.values(state.quizCompleted).reduce((s, q) => s + (q.correct || 0), 0);
      return total >= 20;
    }
  },
  {
    id: "fast",
    name: "Rapide",
    description: "Trouvez 10 œuvres en 1 heure",
    icon: "⚡",
    condition: (state) => {
      const recent = Object.entries(state.visitedAt)
        .filter(([id, ts]) => Date.now() - ts < 3600000)
        .map(([id]) => parseInt(id));
      return recent.length >= 10;
    }
  },
  {
    id: "patrimoine",
    name: "Gardien du patrimoine",
    description: "Trouvez toutes les œuvres de patrimoine",
    icon: "🏛️",
    condition: (state, works) => {
      const patrimoineWorks = works.filter(w => w.category === 'patrimoine');
      return patrimoineWorks.every(w => state.foundWorks.includes(w.id));
    }
  },
  {
    id: "nature",
    name: "Ami de la nature",
    description: "Trouvez toutes les œuvres de nature",
    icon: "🌳",
    condition: (state, works) => {
      const natureWorks = works.filter(w => w.category === 'nature');
      return natureWorks.every(w => state.foundWorks.includes(w.id));
    }
  },
  {
    id: "completionist",
    name: "Complétiste",
    description: "Trouvez toutes les œuvres + tous les quiz",
    icon: "🏆",
    condition: (state, works) => {
      if (state.foundWorks.length < 50) return false;
      return works.every(w => state.quizCompleted[w.id]?.correct > 0);
    }
  },
  {
    id: "no_quiz",
    name: "Curieux",
    description: "Réussissez tous les quiz du premier coup",
    icon: "🎓",
    condition: (state, works) => {
      if (Object.keys(state.quizCompleted).length < 50) return false;
      return Object.values(state.quizCompleted).every(q => q.correct > 0 && q.total === 1);
    }
  }
];

function checkBadges(state, works) {
  const newBadges = [];
  for (const badge of BADGES) {
    if (!state.badges.includes(badge.id) && badge.condition(state, works)) {
      newBadges.push(badge);
    }
  }
  return newBadges;
}

function renderBadges(state) {
  return BADGES.map(badge => ({
    ...badge,
    unlocked: state.badges.includes(badge.id)
  }));
}