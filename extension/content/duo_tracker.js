console.log("DuoBloom Tracker Loaded");

let lastProcessedChallenge = "";

function extractChallengeData() {
  // Duolingo uses specific data-test attributes
  const challengeNode = document.querySelector('[data-test="challenge"]');
  if (!challengeNode) return null;

  const challengeHeader = document.querySelector('[data-test="challenge-header"]')?.innerText || "";
  const challengeType = challengeNode.getAttribute('data-test'); // or more specific parsing
  
  // Extract words - this is tricky as Duolingo's DOM changes frequently
  // We look for word tokens in bubbles or text
  const wordNodes = document.querySelectorAll('[data-test="challenge-tap-token-text"], [data-test="word-bank"] span');
  const words = Array.from(wordNodes).map(node => node.innerText.trim()).filter(w => w.length > 0);

  return {
    header: challengeHeader,
    type: challengeType,
    words: [...new Set(words)], // Unique words
    timestamp: new Date().toISOString()
  };
}

const observer = new MutationObserver((mutations) => {
  const challengeData = extractChallengeData();
  if (challengeData && JSON.stringify(challengeData) !== lastProcessedChallenge) {
    lastProcessedChallenge = JSON.stringify(challengeData);
    console.log("DuoBloom: New challenge detected:", challengeData);
    
    // Send to background script
    chrome.runtime.sendMessage({
      type: "NEW_CHALLENGE",
      data: challengeData
    });
  }
});

observer.observe(document.body, { childList: true, subtree: true });
