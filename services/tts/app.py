import io
import os
import re
import subprocess
import tempfile
from typing import List, Optional

import numpy as np
import soundfile as sf
from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel

MODEL_ID = os.getenv("COSYVOICE_MODEL_ID", "iic/CosyVoice-300M")
MODEL_DIR = os.getenv("MODEL_DIR", "/models")

app = FastAPI()

pipeline = None

class TTSRequest(BaseModel):
    text: str
    quality: str = "hq"
    format: str = "mp3"
    narrator: Optional[str] = None


def split_text(text: str) -> List[str]:
    chunks = re.split(r"(?<=[.!?])\s+", text.strip())
    return [chunk.strip() for chunk in chunks if chunk.strip()]


def normalize_audio(audio) -> np.ndarray:
    if isinstance(audio, np.ndarray):
        return audio
    if isinstance(audio, list):
        return np.array(audio, dtype=np.float32)
    if isinstance(audio, bytes):
        data, _ = sf.read(io.BytesIO(audio))
        return data
    raise ValueError("Unsupported audio format from TTS pipeline")


def pipeline_infer(text: str):
    if pipeline is None:
        raise RuntimeError("CosyVoice pipeline is not initialized")
    result = pipeline(text)
    if isinstance(result, dict):
        sample_rate = result.get("sample_rate", 22050)
        for key in ["wav", "audio", "speech", "output", "data"]:
            if key in result:
                return normalize_audio(result[key]), sample_rate
        return normalize_audio(result), sample_rate
    return normalize_audio(result), 22050


def synthesize(text: str) -> bytes:
    chunks = split_text(text)
    if not chunks:
        raise ValueError("Empty text")

    audio_chunks = []
    sample_rate = 22050

    for chunk in chunks:
        audio, chunk_rate = pipeline_infer(chunk)
        sample_rate = chunk_rate or sample_rate
        if audio.ndim > 1:
            audio = audio.mean(axis=1)
        audio_chunks.append(audio)

    combined = np.concatenate(audio_chunks)

    with tempfile.TemporaryDirectory() as tmpdir:
        wav_path = os.path.join(tmpdir, "output.wav")
        mp3_path = os.path.join(tmpdir, "output.mp3")
        sf.write(wav_path, combined, sample_rate)
        subprocess.run(
            ["ffmpeg", "-y", "-i", wav_path, "-codec:a", "libmp3lame", mp3_path],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        with open(mp3_path, "rb") as file:
            return file.read()


@app.on_event("startup")
async def load_model():
    global pipeline
    try:
        from modelscope import snapshot_download
        from modelscope.pipelines import pipeline as ms_pipeline
        from modelscope.utils.constant import Tasks
    except ImportError as exc:
        raise RuntimeError("modelscope is required for CosyVoice inference") from exc

    os.makedirs(MODEL_DIR, exist_ok=True)
    model_path = snapshot_download(MODEL_ID, cache_dir=MODEL_DIR)
    pipeline = ms_pipeline(task=Tasks.text_to_speech, model=model_path)


@app.post("/tts")
async def tts(request: TTSRequest):
    if request.format != "mp3":
        raise HTTPException(status_code=400, detail="Only mp3 format is supported")
    try:
        audio_bytes = synthesize(request.text)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    return Response(content=audio_bytes, media_type="audio/mpeg")


@app.get("/health")
async def health():
    return {"status": "ok"}
