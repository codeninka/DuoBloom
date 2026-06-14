import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()

# Configure Gemini
# The user will need to provide GOOGLE_API_KEY in their environment
api_key = os.getenv("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

BLOOM_LEVELS = {
    1: "Remembering (Recognizing, listing, describing)",
    2: "Understanding (Interpreting, summarizing, inferring)",
    3: "Applying (Implementing, using, executing)",
    4: "Analyzing (Organizing, structuring, distinguishing)",
    5: "Evaluating (Checking, critiquing, judging)",
    6: "Creating (Designing, constructing, planning)"
}

async def classify_bloom_level(activity_data: dict):
    if not model:
        return {"level": 1, "explanation": "API Key not configured"}

    prompt = f"""
    Analyze the following language learning activity and classify its Bloom's Taxonomy level (1-6).
    Activity Data: {json.dumps(activity_data)}
    
    Levels:
    1. Remembering: Multiple choice, word matching, simple recall.
    2. Understanding: Basic translation (L2 to L1), meaning identification.
    3. Applying: Sentence construction, translation (L1 to L2).
    4. Analyzing: Pattern recognition, error correction.
    5. Evaluating: Nuance comparison, justifying word choice.
    6. Creating: Writing short stories or dialogues.

    Return only a JSON object with "level" (int) and "explanation" (string).
    """
    
    response = model.generate_content(prompt)
    try:
        # Basic cleanup of markdown JSON if present
        text = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(text)
    except:
        return {"level": 1, "explanation": "Failed to parse response"}

async def generate_next_level_challenge(current_level: int, words: list):
    if not model:
        return {"question": "API Key not configured", "correct_answer": ""}

    target_level = min(current_level + 1, 6)
    prompt = f"""
    Create a language learning challenge at Bloom's Taxonomy level {target_level} ({BLOOM_LEVELS[target_level]}).
    Use these target words: {', '.join(words)}
    
    The challenge should be engaging and appropriate for someone who just finished a level {current_level} task.
    Return a JSON object with:
    - "question": The task for the user.
    - "options": List of 4 options (if applicable, else null).
    - "correct_answer": The expected answer.
    - "explanation": Why this is at level {target_level}.
    """

    response = model.generate_content(prompt)
    try:
        text = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(text)
    except:
        return {"question": "Error generating challenge", "correct_answer": ""}
