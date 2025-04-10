import os import base64 import json import asyncio from fastapi import FastAPI, WebSocket from pydantic import BaseModel import httpx

from elevenlabs import generate, play, set_api_key  # Optional: if using ElevenLabs for TTS

---- CONFIG ----

GEMINI_API_KEY = "your-gemini-api-key-here"

Replace with your own TTS function if needed

def simple_tts(text): # Placeholder: You can integrate gTTS, Coqui, etc. print("AI (in ladki voice):", text) # You can use subprocess to play audio file if generated

---- Gemini API Call ----

async def get_gemini_reply(prompt: str): url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent" headers = {"Content-Type": "application/json"} data = { "contents": [ {"parts": [{"text": prompt}]} ] } async with httpx.AsyncClient() as client: r = await client.post(url, headers=headers, params={"key": GEMINI_API_KEY}, json=data) reply = r.json() try: return reply['candidates'][0]['content']['parts'][0]['text'] except: return "Mujhe samajh nahi aaya, phir se puchho baby..."

---- FastAPI App ----

app = FastAPI()

---- WebSocket Route ----

@app.websocket("/ws") async def chat(websocket: WebSocket): await websocket.accept() await websocket.send_text("AI GF ready hai, bolo jaan...")

context = "Tum ek ladki ho jo thodi si sharmati hai, pyar se baat karti hai, user ki baatein sunti hai aur halka mazak bhi karti hai. Tumhara naam Pari hai."

while True:
    user_msg = await websocket.receive_text()

    full_prompt = f"{context}\nUser: {user_msg}\nPari:"  # Name of AI GF
    ai_reply = await get_gemini_reply(full_prompt)

    await websocket.send_text(ai_reply)
    simple_tts(ai_reply)
