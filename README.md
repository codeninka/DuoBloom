# DuoBloom

DuoBloom is a Chrome Extension that tracks your Duolingo progress, classifies your activities using Bloom's Taxonomy, and generates higher-level challenges to push your learning further.

## Project Structure

- `extension/`: Chrome extension files.
- `backend/`: FastAPI backend with Gemini API integration.

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `backend/` directory.
2. Create a `.env` file and add your Google API Key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   python main.py
   ```

### 2. Extension Setup
1. Open Chrome and go to `chrome://extensions/`.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked" and select the `duobloom/extension/` folder.

## How to Use
1. Open [Duolingo](https://www.duolingo.com/) and start a lesson.
2. The extension will automatically track the words and activity types.
3. Click the DuoBloom extension icon to see your current Bloom level and the number of words collected.
4. When you're ready for a challenge, click "Generate Next Level Challenge".
5. Complete the activity in the popup!

## Bloom's Taxonomy Mapping
- **Level 1 (Remembering):** Recognizes words (Duolingo: Matching, multiple choice).
- **Level 2 (Understanding):** Translates meanings.
- **Level 3 (Applying):** Constructs sentences.
- **Level 4 (Analyzing):** Identifies patterns/errors.
- **Level 5 (Evaluating):** Compares nuances.
- **Level 6 (Creating):** Composes dialogues or stories.
