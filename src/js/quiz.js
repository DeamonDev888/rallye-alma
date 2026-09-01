/* ============================================================
   QUIZ — Système de quiz par œuvre
   ============================================================ */

function openQuiz(workId) {
  const work = WORKS_DATA.find(w => w.id === workId);
  if (!work || !work.quiz) {
    showToast('⚠️', 'Pas de quiz disponible', null);
    return;
  }

  const modal = document.getElementById('quizModal');
  const questionEl = document.getElementById('quizQuestion');
  const choicesEl = document.getElementById('quizChoices');
  const resultEl = document.getElementById('quizResult');

  questionEl.textContent = work.quiz.question;
  resultEl.className = 'quiz-result';
  resultEl.textContent = '';

  choicesEl.innerHTML = work.quiz.choices.map((choice, i) => `
    <button class="quiz-choice" data-choice="${i}">
      ${String.fromCharCode(65 + i)}. ${choice}
    </button>
  `).join('');

  choicesEl.querySelectorAll('.quiz-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = parseInt(btn.dataset.choice);
      const correct = work.quiz.correct;

      // Disable all
      choicesEl.querySelectorAll('.quiz-choice').forEach(b => {
        b.style.pointerEvents = 'none';
      });

      if (choice === correct) {
        btn.classList.add('correct');
        resultEl.className = 'quiz-result success';
        resultEl.textContent = '🎉 Bravo ! +50 points';
        recordQuiz(state, workId, true);
        showToast('🎉', 'Quiz réussi !', '+50 points');
      } else {
        btn.classList.add('wrong');
        const correctBtn = choicesEl.querySelector(`[data-choice="${correct}"]`);
        if (correctBtn) correctBtn.classList.add('correct');
        resultEl.className = 'quiz-result failure';
        resultEl.textContent = '❌ Mauvaise réponse';
        recordQuiz(state, workId, false);
        showToast('❌', 'Mauvaise réponse', 'Réessayez sur place');
      }

      updateUI();
    });
  });

  modal.style.display = 'flex';
}

function setupQuiz() {
  const closeBtn = document.getElementById('closeQuiz');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.getElementById('quizModal').style.display = 'none';
    });
  }
}