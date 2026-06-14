from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from .bloom_engine import classify_bloom_level, generate_next_level_challenge

app = FastAPI(title="DuoBloom API")

class ActivityData(BaseModel):
    header: str
    words: List[str]
    type: str

class BloomChallenge(BaseModel):
    level: int
    question: str
    options: Optional[List[str]] = None
    correct_answer: str
    explanation: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "DuoBloom API is running"}

@app.post("/classify")
async def classify(data: ActivityData):
    result = await classify_bloom_level(data.dict())
    return result

@app.post("/generate", response_model=BloomChallenge)
async def generate(current_level: int, words: List[str]):
    result = await generate_next_level_challenge(current_level, words)
    return {
        "level": min(current_level + 1, 6),
        **result
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
