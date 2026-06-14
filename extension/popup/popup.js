let currentChallenge = null;

function updateUI() {
  chrome.storage.local.get(['currentSessionData'], (result) => {
    if (result.currentSessionData) {
      document.getElementById('level-val').innerText = result.currentSessionData.lastLevel;
      document.getElementById('word-count').innerText = result.currentSessionData.words.length;
    }
  });
}

document.getElementById('gen-btn').addEventListener('click', async () => {
  const result = await chrome.storage.local.get(['currentSessionData']);
  const data = result.currentSessionData;
  
  if (!data || data.words.length === 0) {
    alert("Please start a Duolingo lesson first!");
    return;
  }

  document.getElementById('gen-btn').innerText = "Generating...";
  
  try {
    const response = await fetch(`http://localhost:8000/generate?current_level=${data.lastLevel}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.words)
    });
    
    currentChallenge = await response.json();
    
    document.getElementById('challenge-box').style.display = 'block';
    document.getElementById('question').innerText = currentChallenge.question;
    document.getElementById('gen-btn').innerText = "Generate Next Level Challenge";
  } catch (error) {
    console.error("Popup: Error generating challenge", error);
    document.getElementById('gen-btn').innerText = "Error (check console)";
  }
});

document.getElementById('check-btn').addEventListener('click', () => {
  const userAnswer = document.getElementById('answer').value.trim();
  const feedback = document.getElementById('feedback');
  
  if (userAnswer.toLowerCase() === currentChallenge.correct_answer.toLowerCase()) {
    feedback.innerText = "Correct! Well done.";
    feedback.style.color = "green";
  } else {
    feedback.innerText = `Incorrect. Expected: ${currentChallenge.correct_answer}`;
    feedback.style.color = "red";
  }
});

updateUI();
setInterval(updateUI, 2000);
