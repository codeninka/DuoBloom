let currentSessionData = {
  words: [],
  lastLevel: 1,
  history: []
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "NEW_CHALLENGE") {
    console.log("Background: Received challenge data", message.data);
    
    // Update session words
    currentSessionData.words = [...new Set([...currentSessionData.words, ...message.data.words])];
    
    // Send to backend for classification
    classifyActivity(message.data);
  }
});

async def classifyActivity(data) {
  try {
    const response = await fetch('http://localhost:8000/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    currentSessionData.lastLevel = result.level;
    console.log("Background: Activity classified as level", result.level);
    
    // Store in local storage for popup
    chrome.storage.local.set({ currentSessionData });
  } catch (error) {
    console.error("Background: Error classifying activity", error);
  }
}
