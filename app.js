// Summer Camp Jeopardy Game Logic

// Game data from the provided JSON
let gameData = {};

// Load questions from questions.json and build gameData
fetch('questions.json')
  .then(response => response.json())
  .then(questionsArray => {
    // Convert flat array to nested object structure
    gameData = {};
    questionsArray.forEach(q => {
      if (!gameData[q.category]) gameData[q.category] = {};
      gameData[q.category][q.points] = {
        question: q.question,
        answer: q.answer
      };
    });
  })
  .catch(err => {
    alert('Failed to load questions.');
    console.error(err);
  });

// Game state
let teams = [];
let currentQuestion = null;
let usedQuestions = new Set();

// Team colors for visual distinction
const teamColors = ['#FF6B35', '#4ECDC4', '#B8860B', '#C71585'];

// DOM elements
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const finalScreen = document.getElementById('final-screen');
const questionModal = document.getElementById('question-modal');
const scoreControls = document.getElementById('score-controls');

// Setup screen elements
const startGameBtn = document.getElementById('start-game');
const teamInputs = [
  document.getElementById('team1'),
  document.getElementById('team2'),
  document.getElementById('team3'),
  document.getElementById('team4')
];

// Game screen elements
const scoreboard = document.getElementById('scoreboard');
const pointButtons = document.querySelectorAll('.point-button');

// Modal elements
const modalCategory = document.getElementById('modal-category');
const modalPoints = document.getElementById('modal-points');
const questionText = document.getElementById('question-text');
const answerText = document.getElementById('answer-text');
const showAnswerBtn = document.getElementById('show-answer');
const closeModalBtn = document.getElementById('close-modal');

// Final screen elements
const finalScores = document.getElementById('final-scores');
const newGameBtn = document.getElementById('new-game');

// Score control elements
const scoreButtons = document.getElementById('score-buttons');

// Make functions globally accessible for onclick handlers
window.addPoints = function(teamIndex, points) {
  console.log('addPoints called:', teamIndex, points, teams.length);
  if (teamIndex >= 0 && teamIndex < teams.length && points > 0) {
    teams[teamIndex].score += points;
    updateScoreboard();
    console.log('Points added successfully');
    // playSound('correct');
  } else {
    console.log('addPoints validation failed:', teamIndex, points, teams.length);
  }
};

window.subtractPoints = function(teamIndex, points) {
  if (teamIndex >= 0 && teamIndex < teams.length && points > 0) {
    teams[teamIndex].score = Math.max(0, teams[teamIndex].score - points);
    updateScoreboard();
  }
};

// Initialize game
function initGame() {
  // Setup event listeners
  startGameBtn.addEventListener('click', startGame);
  showAnswerBtn.addEventListener('click', showAnswer);
  closeModalBtn.addEventListener('click', closeModal);
  newGameBtn.addEventListener('click', resetGame);
  
  // Add event listeners to point buttons
  pointButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const category = e.target.dataset.category;
      const points = e.target.dataset.points;
      showQuestion(category, points, e.target);
    });
  });
  
  // Add modal click-outside-to-close
  questionModal.addEventListener('click', (e) => {
    if (e.target === questionModal) {
      closeModal();
    }
  });
}

// Start the game
function startGame() {
  // Get team names
  teams = [];
  teamInputs.forEach((input, index) => {
    const name = input.value.trim();
    if (name) {
      teams.push({
        name: name,
        score: 0,
        color: teamColors[index]
      });
    }
  });
  
  // Validate at least 2 teams
  if (teams.length < 2) {
    alert('Please enter at least 2 team names to start the game!');
    return;
  }
  
  // Switch to game screen
  setupScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  // scoreControls.classList.remove('hidden'); // Removed: score controls will be shown with question modal
  
  // Initialize scoreboard and score controls
  updateScoreboard();
}

// Update scoreboard display
function updateScoreboard() {
  scoreboard.innerHTML = '';
  teams.forEach(team => {
    const teamDiv = document.createElement('div');
    teamDiv.className = 'team-score';
    teamDiv.innerHTML = `
      <div class="team-name" style="color: ${team.color}">${team.name}</div>
      <div class="team-points">$${team.score}</div>
    `;
    scoreboard.appendChild(teamDiv);
  });
}

// Create score control buttons
function createScoreControls(pointsToUse) {
  // Always get the current element
  const scoreButtons = document.getElementById('score-buttons');
  scoreButtons.innerHTML = '';
  teams.forEach((team, index) => {
    const teamControls = document.createElement('div');
    teamControls.className = 'team-score-controls';
    
    const teamName = document.createElement('div');
    teamName.style.color = team.color;
    teamName.textContent = team.name;
    
    const pointsToAward = Number(pointsToUse);

    const addBtn = document.createElement('button');
    addBtn.className = 'score-btn score-btn--add';
    addBtn.textContent = `Add +$${pointsToAward}`;
    addBtn.style.marginRight = '8px';
    addBtn.disabled = pointsToAward === 0;
    addBtn.addEventListener('click', () => {
      console.log('Add button clicked:', index, pointsToAward, teams.length);
      window.addPoints(index, pointsToAward);
    });
    
    const subtractBtn = document.createElement('button');
    subtractBtn.className = 'score-btn score-btn--subtract';
    subtractBtn.textContent = `Subtract -$${pointsToAward}`;
    subtractBtn.disabled = pointsToAward === 0;
    subtractBtn.addEventListener('click', () => {
      console.log('Subtract button clicked:', index, pointsToAward, teams.length);
      window.subtractPoints(index, pointsToAward);
    });
    
    teamControls.appendChild(teamName);
    teamControls.appendChild(addBtn);
    teamControls.appendChild(subtractBtn);
    scoreButtons.appendChild(teamControls);
  });
}

// Show question modal
function showQuestion(category, points, buttonElement) {
  const questionData = gameData[category][points];
  if (!questionData) return;
  
  // Mark question as used
  const questionKey = `${category}-${points}`;
  usedQuestions.add(questionKey);
  
  // Disable the button
  buttonElement.disabled = true;
  
  // Store current question info
  currentQuestion = {
    category: category,
    points: parseInt(points),
    question: questionData.question,
    answer: questionData.answer
  };
  
  // Update modal content
  modalCategory.textContent = category;
  modalPoints.textContent = `$${points}`;
  questionText.textContent = questionData.question;
  answerText.textContent = questionData.answer;
  
  // Reset modal state
  answerText.classList.add('hidden');
  showAnswerBtn.classList.remove('hidden');
  showAnswerBtn.textContent = 'Show Answer 🎯';
  showAnswerBtn.disabled = false;
  
  // Show modal
  questionModal.classList.remove('hidden');
  scoreControls.classList.remove('hidden'); // Show score controls when modal opens

  // Update score controls (after currentQuestion is set and modal is shown)
  createScoreControls(currentQuestion.points);
}

// Show answer
function showAnswer() {
  answerText.classList.remove('hidden');
  showAnswerBtn.disabled = true;
  // No need to re-render score controls here
}

// Close modal
function closeModal() {
  questionModal.classList.add('hidden');
  scoreControls.classList.add('hidden');
  // Also clear the score-buttons container
  const scoreButtons = document.getElementById('score-buttons');
  scoreButtons.innerHTML = '';
  answerText.classList.add('hidden');
  showAnswerBtn.disabled = false;
  checkGameEnd();
}

// Check if game has ended
function checkGameEnd() {
  if (usedQuestions.size === 30) { // 6 categories × 5 questions each
    endGame();
  }
}

// End game and show final results
function endGame() {
  // Hide game screen and show final screen
  gameScreen.classList.add('hidden');
  scoreControls.classList.add('hidden');
  finalScreen.classList.remove('hidden');
  
  // Sort teams by score
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  
  // Display final scores
  finalScores.innerHTML = '';
  sortedTeams.forEach((team, index) => {
    const teamDiv = document.createElement('div');
    teamDiv.className = `final-team ${index === 0 ? 'winner' : ''}`;
    teamDiv.innerHTML = `
      <span style="color: ${team.color};">
        ${index === 0 ? '🏆 ' : ''}${team.name}
      </span>
      <span>$${team.score}</span>
    `;
    finalScores.appendChild(teamDiv);
  });
  
  // playSound('complete');
}

// Reset game
function resetGame() {
  // Reset game state
  teams = [];
  currentQuestion = null;
  usedQuestions.clear();
  
  // Reset team inputs
  teamInputs.forEach(input => {
    input.value = '';
  });
  
  // Re-enable all point buttons
  pointButtons.forEach(button => {
    button.disabled = false;
  });
  
  // Show setup screen
  finalScreen.classList.add('hidden');
  gameScreen.classList.add('hidden');
  scoreControls.classList.add('hidden');
  setupScreen.classList.remove('hidden');
}

// Add some fun sound effects (simple beeps using Web Audio API)
// function playSound(type) {
//   try {
//     const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     const oscillator = audioContext.createOscillator();
//     const gainNode = audioContext.createGain();
//     
//     oscillator.connect(gainNode);
//     gainNode.connect(audioContext.destination);
//     
//     switch(type) {
//       case 'select':
//         oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
//         gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
//         break;
//       case 'correct':
//         oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
//         gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
//         break;
//       case 'complete':
//         oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
//         gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//         break;
//     }
//     
//     oscillator.start();
//     oscillator.stop(audioContext.currentTime + 0.3);
//     
//     // Close audio context after playing
//     setTimeout(() => {
//       audioContext.close();
//     }, 500);
//   } catch (error) {
//     // Silently fail if Web Audio API is not supported
//     console.log('Audio not supported');
//   }
// }

// Remove sound effects from interactions
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('point-button') && !e.target.disabled) {
    // playSound('select');
  } else if (e.target.id === 'show-answer') {
    // playSound('correct');
  } else if (e.target.id === 'start-game') {
    // playSound('complete');
  }
});

// Keyboard shortcuts for accessibility
document.addEventListener('keydown', (e) => {
  // Escape key to close modal
  if (e.key === 'Escape' && !questionModal.classList.contains('hidden')) {
    closeModal();
  }
  
  // Space or Enter to show answer when modal is open
  if ((e.key === ' ' || e.key === 'Enter') && !questionModal.classList.contains('hidden') && !showAnswerBtn.disabled) {
    e.preventDefault();
    showAnswer();
  }
});

// Add team name validation
teamInputs.forEach(input => {
  input.addEventListener('input', (e) => {
    // Remove any characters that might cause issues
    e.target.value = e.target.value.replace(/[<>]/g, '');
  });
  
  input.addEventListener('keydown', (e) => {
    // Allow Enter to start game if this is a filled input
    if (e.key === 'Enter' && e.target.value.trim()) {
      // Check if we have at least 2 teams filled
      const filledTeams = teamInputs.filter(input => input.value.trim()).length;
      if (filledTeams >= 2) {
        startGame();
      }
    }
  });
});

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);

// Prevent context menu on game elements for touch devices
document.addEventListener('contextmenu', (e) => {
  if (e.target.classList.contains('point-button') || e.target.classList.contains('btn')) {
    e.preventDefault();
  }
});

// Add visual feedback for button presses on touch devices
document.addEventListener('touchstart', (e) => {
  if (e.target.classList.contains('point-button') || e.target.classList.contains('btn')) {
    e.target.style.transform = 'scale(0.95)';
  }
});

document.addEventListener('touchend', (e) => {
  if (e.target.classList.contains('point-button') || e.target.classList.contains('btn')) {
    e.target.style.transform = '';
  }
});
