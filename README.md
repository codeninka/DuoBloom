# DuoBloom 🦉🌸

DuoBloom is a Chrome Extension that tracks your Duolingo learning progress, classifies your activities using **Bloom's Taxonomy**, and generates higher-level challenges to push your learning further using the Gemini API.

---

## ✨ Features

- **Real-time Word Tracking**: The extension script tracks the active words you learn in your Duolingo sessions.
- **Smart Taxonomy Classification**: Automatically classifies Duolingo exercises (e.g., matching, translating, listening) into Bloom's levels.
- **Dynamic Challenge UI**: Renders customized challenges matching the next taxonomy level. Supports both multiple-choice options (with clickable cards) and open-ended text translations.
- **Cognitive Progress Bar**: Visualizes your learning stage progress directly in the extension popup.
- **Taxonomy Rationale**: Explains the cognitive reasoning behind why a challenge fits a specific Bloom's taxonomy stage.
- **Optimized Content Script**: Performance-throttled DOM mutation listener ensures zero performance impact on your Duolingo sessions.

---

## 📂 Project Structure

- `extension/`: Chrome extension files (popup interface, content tracker, and background worker).
- `backend/`: FastAPI backend with Gemini API integration.

---

## 🚀 Setup Instructions

### 1. Backend Setup

1. Navigate to the `backend/` directory.
2. Create a `.env` file and add your Google Gemini API Key:
   ```env
   GOOGLE_API_KEY=your_api_key_here
   ```

#### A. Standard Desktop Environments
Install Python dependencies and start the server:
```bash
pip install -r requirements.txt
python main.py
```

#### B. Android / Termux Environments
If you are running in a Termux proot environment (e.g. Ubuntu aarch64), Python might face compiler errors when building wheels like `pydantic-core`, `cryptography`, or `grpcio`. To bypass this, install precompiled system packages first:
```bash
# Update and install system dependencies
apt-get update
apt-get install -y python3-pip python3-pydantic python3-dotenv python3-fastapi python3-uvicorn python3-sqlalchemy python3-cryptography python3-grpcio python3-protobuf

# Install Google Generative AI using the system pip
python3 -m pip install google-generativeai --ignore-installed --break-system-packages

# Start the server
python3 main.py
```

---

### 2. Extension Setup

1. Open Google Chrome and go to `chrome://extensions/`.
2. Enable **"Developer mode"** in the top right corner.
3. Click **"Load unpacked"** in the top left.
4. Select the `duobloom/extension/` directory.

---

## 🎮 How to Use

1. **Start learning**: Open [Duolingo](https://www.duolingo.com/) and start a lesson. The extension tracker will automatically collect words and activity headers.
2. **Check Status**: Click the DuoBloom extension icon. You will see your current Bloom level and the number of words collected.
3. **Generate Challenge**: When you've gathered words, click **"Generate Next Level Challenge"**.
4. **Answer**: 
   - If it's multiple-choice, select an option card.
   - If it's open-ended, type your response.
5. **Verify**: Click **"Submit Answer"** to see if you got it right and read the taxonomy explanation!
