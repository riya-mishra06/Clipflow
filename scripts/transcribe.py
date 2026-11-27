import ctypes
import ctypes.wintypes
import json
import os
import sys
import time
import tracemalloc
import wave
import numpy as np
from faster_whisper import WhisperModel


def get_process_rss_mb() -> tuple[float, float]:
    """Returns (current_rss_mb, peak_rss_mb) for the OS process including native CTranslate2 memory."""
    if os.name == "nt":
        class PROCESS_MEMORY_COUNTERS(ctypes.Structure):
            _fields_ = [
                ("cb", ctypes.wintypes.DWORD),
                ("PageFaultCount", ctypes.wintypes.DWORD),
                ("PeakWorkingSetSize", ctypes.c_size_t),
                ("WorkingSetSize", ctypes.c_size_t),
                ("QuotaPeakPagedPoolUsage", ctypes.c_size_t),
                ("QuotaPagedPoolUsage", ctypes.c_size_t),
                ("QuotaPeakNonPagedPoolUsage", ctypes.c_size_t),
                ("QuotaNonPagedPoolUsage", ctypes.c_size_t),
                ("PagefileUsage", ctypes.c_size_t),
                ("PeakPagefileUsage", ctypes.c_size_t),
            ]
        counters = PROCESS_MEMORY_COUNTERS()
        counters.cb = ctypes.sizeof(PROCESS_MEMORY_COUNTERS)
        kernel32 = ctypes.windll.kernel32
        kernel32.GetCurrentProcess.restype = ctypes.wintypes.HANDLE
        handle = kernel32.GetCurrentProcess()

        get_mem = getattr(kernel32, "K32GetProcessMemoryInfo", None) or ctypes.windll.psapi.GetProcessMemoryInfo
        get_mem.argtypes = [ctypes.wintypes.HANDLE, ctypes.POINTER(PROCESS_MEMORY_COUNTERS), ctypes.wintypes.DWORD]
        get_mem.restype = ctypes.wintypes.BOOL

        if get_mem(handle, ctypes.byref(counters), counters.cb):
            return (
                round(counters.WorkingSetSize / (1024 * 1024), 2),
                round(counters.PeakWorkingSetSize / (1024 * 1024), 2),
            )
    return (0.0, 0.0)


def fmt_srt_time(sec: float) -> str:
    ms_total = max(0, int(round(sec * 1000)))
    hrs, rem = divmod(ms_total, 3_600_000)
    mins, rem = divmod(rem, 60_000)
    secs, ms = divmod(rem, 1000)
    return f"{hrs:02d}:{mins:02d}:{secs:02d},{ms:03d}"


def fmt_vtt_time(sec: float) -> str:
    ms_total = max(0, int(round(sec * 1000)))
    hrs, rem = divmod(ms_total, 3_600_000)
    mins, rem = divmod(rem, 60_000)
    secs, ms = divmod(rem, 1000)
    return f"{hrs:02d}:{mins:02d}:{secs:02d}.{ms:03d}"


def load_pcm16_wav(audio_path: str):
    """Load 16kHz mono PCM WAV directly into float32 numpy array (avoids PyAV version conflicts)."""
    if audio_path.lower().endswith(".wav"):
        with wave.open(audio_path, "rb") as wf:
            if wf.getnchannels() == 1 and wf.getsampwidth() == 2 and wf.getframerate() == 16000:
                frames = wf.readframes(wf.getnframes())
                return np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0
    return audio_path


def run_transcription(audio_path: str, preferred_model: str = "base", cpu_threads: int = 4):
    tracemalloc.start()
    t0 = time.perf_counter()

    model_used = preferred_model
    try:
        model = WhisperModel(preferred_model, device="cpu", compute_type="int8", cpu_threads=cpu_threads)
    except MemoryError:
        model_used = "tiny"
        model = WhisperModel("tiny", device="cpu", compute_type="int8", cpu_threads=min(2, cpu_threads))

    audio_input = load_pcm16_wav(audio_path)
    segments_iter, info = model.transcribe(
        audio_input,
        word_timestamps=True,
        vad_filter=True,
    )

    segments_out = []
    words_out = []
    srt_lines = []
    vtt_lines = ["WEBVTT", ""]

    for idx, seg in enumerate(segments_iter, start=1):
        text = (seg.text or "").strip()
        if not text:
            continue
        seg_words = []
        if seg.words:
            for w in seg.words:
                w_item = {
                    "word": (w.word or "").strip(),
                    "start": round(float(w.start), 3),
                    "end": round(float(w.end), 3),
                    "probability": round(float(getattr(w, "probability", 1.0)), 3),
                }
                seg_words.append(w_item)
                words_out.append(w_item)

        segments_out.append({
            "id": idx,
            "start": round(float(seg.start), 3),
            "end": round(float(seg.end), 3),
            "text": text,
            "words": seg_words,
        })

        srt_lines.append(f"{idx}\n{fmt_srt_time(seg.start)} --> {fmt_srt_time(seg.end)}\n{text}\n")
        vtt_lines.append(f"{fmt_vtt_time(seg.start)} --> {fmt_vtt_time(seg.end)}\n{text}\n")

    elapsed_sec = round(time.perf_counter() - t0, 3)
    _, peak_bytes = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    rss_mb, peak_rss_mb = get_process_rss_mb()

    return {
        "modelUsed": model_used,
        "language": info.language,
        "languageProbability": round(float(info.language_probability), 3),
        "duration": round(float(info.duration), 3),
        "elapsedSec": elapsed_sec,
        "pythonTracedPeakMb": round(peak_bytes / (1024 * 1024), 2),
        "processRssMb": rss_mb,
        "processPeakRssMb": peak_rss_mb,
        "text": " ".join(s["text"] for s in segments_out),
        "segments": segments_out,
        "words": words_out,
        "srt": "\n".join(srt_lines).strip() + ("\n" if srt_lines else ""),
        "vtt": "\n".join(vtt_lines).strip() + "\n",
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: transcribe.py <audio_path> [model] [cpu_threads]"}))
        sys.exit(1)

    audio = sys.argv[1]
    model_name = sys.argv[2] if len(sys.argv) > 2 else "base"
    threads = int(sys.argv[3]) if len(sys.argv) > 3 else 4

    if not os.path.isfile(audio):
        print(json.dumps({"error": f"Audio file not found: {audio}"}))
        sys.exit(1)

    result = run_transcription(audio, model_name, threads)
    print(json.dumps(result))
