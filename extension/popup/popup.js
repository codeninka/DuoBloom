let currentChallenge = null;
let selectedOption = null;

const BLOOM_STAGES = {
  1: "Remembering",
  2: "Understanding",
  3: "Applying",
  4: "Analyzing",
  5: "Evaluating",
  6: "Creating"
};

function updateUI(sessionData) {
  if (!sessionData) return;

  const lastLevel = sessionData.lastLevel || 1;
  const words = sessionData.words || [];
  const history = sessionData.history || [];

  // Update level text & name
  document.getElementById('level-val').innerText = lastLevel;
  document.getElementById('bloom-level-name').innerText = BLOOM_STAGES[lastLevel] || "Remembering";

  // Update progress bar
  const progressPercent = (lastLevel / 6) * 100;
  document.getElementById('progress-bar-fill').style.width = `${progressPercent}%`;

  // Update counts
  document.getElementById('word-count').innerText = words.length;
  document.getElementById('history-count').innerText = history.length;
}

// Load initial data
chrome.storage.local.get(['currentSessionData'], (result) => {
  if (result.currentSessionData) {
    updateUI(result.currentSessionData);
  }
});

// Reactive listener instead of setInterval
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.currentSessionData) {
    updateUI(changes.currentSessionData.newValue);
  }
});

document.getElementById('gen-btn').addEventListener('click', async () => {
  const result = await chrome.storage.local.get(['currentSessionData']);
  const data = result.currentSessionData;
  
  if (!data || !data.words || data.words.length === 0) {
    alert("Please start a Duolingo lesson first to collect words!");
    return;
  }

  const genBtn = document.getElementById('gen-btn');
  genBtn.innerText = "Generating Challenge...";
  genBtn.disabled = true;
  
  // Clear previous feedback & inputs
  const feedback = document.getElementById('feedback');
  feedback.style.display = 'none';
  feedback.className = '';
  document.getElementById('explanation-box').style.display = 'none';
  document.getElementById('answer').value = '';
  selectedOption = null;

  try {
    const response = await fetch(`http://localhost:8000/generate?current_level=${data.lastLevel}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.words)
    });
    
    currentChallenge = await response.json();
    
    // Set level badge
    const targetLevel = currentChallenge.level || Math.min(data.lastLevel + 1, 6);
    const badge = document.getElementById('challenge-badge');
    badge.innerText = `Level ${targetLevel} Challenge: ${BLOOM_STAGES[targetLevel]}`;
    
    // Set question
    document.getElementById('question').innerText = currentChallenge.question;
    
    // Dynamic input rendering
    const optionsContainer = document.getElementById('options-container');
    const textInputContainer = document.getElementById('text-input-container');
    
    if (currentChallenge.options && Array.isArray(currentChallenge.options) && currentChallenge.options.length > 0) {
      // Multiple choice challenge
      optionsContainer.innerHTML = '';
      currentChallenge.options.forEach(opt => {
        const card = document.createElement('button');
        card.className = 'option-card';
        card.innerText = opt;
        card.addEventListener('click', () => {
          // Deselect previous
          document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          selectedOption = opt;
        });
        optionsContainer.appendChild(card);
      });
      optionsContainer.style.display = 'grid';
      textInputContainer.style.display = 'none';
    } else {
      // Open-ended challenge
      optionsContainer.style.display = 'none';
      textInputContainer.style.display = 'block';
    }

    document.getElementById('challenge-box').style.display = 'block';
    genBtn.innerText = "Generate Next Level Challenge";
    genBtn.disabled = false;
  } catch (error) {
    console.error("Popup: Error generating challenge", error);
    genBtn.innerText = "Error (Backend Down?)";
    genBtn.disabled = false;
  }
});

document.getElementById('check-btn').addEventListener('click', () => {
  if (!currentChallenge) return;

  const feedback = document.getElementById('feedback');
  let userAnswer = "";

  if (currentChallenge.options && Array.isArray(currentChallenge.options) && currentChallenge.options.length > 0) {
    if (!selectedOption) {
      alert("Please select an option first!");
      return;
    }
    userAnswer = selectedOption;
  } else {
    userAnswer = document.getElementById('answer').value.trim();
    if (!userAnswer) {
      alert("Please enter your answer first!");
      return;
    }
  }

  const isCorrect = userAnswer.toLowerCase() === currentChallenge.correct_answer.toLowerCase();
  
  if (isCorrect) {
    feedback.innerText = "🎉 Correct! Excellent job.";
    feedback.className = "correct";
  } else {
    feedback.innerText = `❌ Incorrect. Expected: ${currentChallenge.correct_answer}`;
    feedback.className = "incorrect";
  }
  
  // Show the taxonomy rationale explanation
  if (currentChallenge.explanation) {
    document.getElementById('explanation-text').innerText = currentChallenge.explanation;
    document.getElementById('explanation-box').style.display = 'block';
  }
});
