import warnings
warnings.filterwarnings("ignore")

import os
import re
import time

from pathlib import Path

import pandas as pd

import whisper
import speech_recognition as sr

from deep_translator import GoogleTranslator
from langdetect import detect

from gtts import gTTS

import pygame

from google import genai

from dotenv import load_dotenv

# ============================================================
# LOAD ENV
# ============================================================

load_dotenv()

# ============================================================
# GEMINI CLIENT
# ============================================================

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# ============================================================
# PATHS
# ============================================================

BASE_PATH = Path(__file__).resolve().parent

DATA_PATH = (
    BASE_PATH.parent.parent / "datasets"
)

OUTPUT_PATH = (
    BASE_PATH.parent.parent / "voice_outputs"
)

OUTPUT_PATH.mkdir(
    parents=True,
    exist_ok=True
)

# ============================================================
# LOAD DATASET
# ============================================================

farmer_profiles = pd.read_csv(
    DATA_PATH / "multilingual_relationship_engine.csv"
)

print("=" * 80)
print("VAANI VOICE ASSISTANT V2 LOADED")
print("=" * 80)

print()

print(
    "Farmer Profiles Loaded:",
    len(farmer_profiles)
)

print()

# ============================================================
# LANGUAGE MAP
# ============================================================

language_map = {
    "Hindi": "hi",
    "Punjabi": "pa",
    "Gujarati": "gu",
    "Marathi": "mr",
    "Kannada": "kn",
    "Bengali": "bn",
    "Tamil": "ta",
    "Telugu": "te",
    "English": "en"
}

# ============================================================
# LOAD WHISPER MODEL
# ============================================================

whisper_model = None


def get_whisper_model():

    global whisper_model

    if whisper_model is None:

        print("=" * 80)
        print("Loading Whisper Model...")
        print("=" * 80)

        whisper_model = whisper.load_model(
            "medium",
            device="cpu"
        )

        print("Whisper Loaded Successfully")
        print()

    return whisper_model

# ============================================================
# CLEAN TEXT
# ============================================================


def clean_text(text):

    text = str(text)

    text = text.replace(
        "_",
        " "
    )

    text = re.sub(
        r"[^\w\s.,!?]",
        "",
        text
    )

    return text.strip()

# ============================================================
# RECORD AUDIO
# ============================================================


def record_audio():

    recognizer = sr.Recognizer()

    with sr.Microphone() as source:

        print("🎤 Speak now...")
        print()

        recognizer.adjust_for_ambient_noise(
            source,
            duration=1
        )

        audio = recognizer.listen(
            source,
            timeout=10,
            phrase_time_limit=15
        )

    audio_path = (
        OUTPUT_PATH / f"farmer_input_{int(time.time())}.wav"
    )

    with open(audio_path, "wb") as f:

        f.write(
            audio.get_wav_data()
        )

    return audio_path

# ============================================================
# SPEECH TO TEXT
# ============================================================


def speech_to_text(audio_path):

    model = get_whisper_model()

    result = model.transcribe(
        str(audio_path),
        fp16=False
    )
    
    # result = model.transcribe(
    #     str(audio_path),
    #     fp16=False,
    #     language="hi"
    # )

    detected_text = result["text"]

    detected_language = result["language"]

    return detected_text, detected_language

# ============================================================
# TRANSLATE TO ENGLISH
# ============================================================


def translate_to_english(text):

    try:

        translated = GoogleTranslator(
            source="auto",
            target="en"
        ).translate(text)

        return translated

    except Exception as e:

        print("Translation Error:", e)

        return text

# ============================================================
# DETECT LANGUAGE NAME
# ============================================================


def language_name(language_code):

    reverse_map = {
        "hi": "Hindi",
        "pa": "Punjabi",
        "gu": "Gujarati",
        "mr": "Marathi",
        "kn": "Kannada",
        "bn": "Bengali",
        "ta": "Tamil",
        "te": "Telugu",
        "en": "English"
    }

    return reverse_map.get(
        language_code,
        "Hindi"
    )

# ============================================================
# FARMER MATCHING
# ============================================================


def find_best_farmer(language):

    filtered = farmer_profiles[
        farmer_profiles["preferred_language"] == language
    ]

    if len(filtered) == 0:

        return farmer_profiles.sample(1).iloc[0]

    return filtered.sample(1).iloc[0]

# ============================================================
# GEMINI RELATIONSHIP RESPONSE
# ============================================================


def generate_relationship_response(
    farmer,
    farmer_question_english
):

    prompt = f"""
        You are Vaani AI.

        You are an emotionally intelligent
        agricultural relationship advisor.

        Farmer Information:

        District: {farmer['district']}
        State: {farmer['state']}
        Trust Level: {farmer['trust_level']}
        Emotional State: {farmer['emotional_state']}
        Panic State: {farmer['panic_state']}
        Relationship Stage: {farmer['relationship_stage']}
        Preferred Channel: {farmer['preferred_channel']}
        Memory Context: {farmer['memory_context']}

        Farmer Question:
        {farmer_question_english}

        Instructions:

        1. Respond emotionally.
        2. Build trust naturally.
        3. Give practical agriculture guidance.
        4. Speak like a real field advisor.
        5. Keep response under 120 words.
        6. Calm anxious farmers.
        7. Avoid robotic tone.
        8. Use farmer-friendly language.
        9. Mention previous memory naturally if relevant.
        10. Never use fake farmer names like Farmer_123.
        11. Address the farmer respectfully in a natural Indian farmer support tone.
        """

    for attempt in range(3):

        try:

            response = client.models.generate_content(
                model="models/gemini-2.5-flash",
                contents=prompt
            )

            if response.text:

                return response.text

        except Exception as e:

            print(
                f"Gemini Attempt {attempt + 1} Failed:",
                e
            )

            time.sleep(2)

    return (
        "We understand your concern. "
        "Our agriculture support team "
        "will guide you shortly."
    )

# ============================================================
# TRANSLATE RESPONSE
# ============================================================


def translate_response(
    text,
    target_language_code
):

    try:

        translated = GoogleTranslator(
            source="en",
            target=target_language_code
        ).translate(text)

        return translated

    except Exception as e:

        print("Localization Error:", e)

        return text

# ============================================================
# GENERATE VOICE
# ============================================================


def generate_voice(
    localized_response,
    language_code
):

    localized_response = clean_text(
        localized_response
    )

    tts = gTTS(
        text=localized_response,
        lang=language_code,
        slow=False
    )

    audio_file = (
        OUTPUT_PATH / f"vaani_response_{int(time.time())}.mp3"
    )

    tts.save(str(audio_file))

    return audio_file

# ============================================================
# PLAY AUDIO
# ============================================================


def play_audio(audio_path):

    pygame.mixer.init()

    pygame.mixer.music.load(
        str(audio_path)
    )

    pygame.mixer.music.play()

    while pygame.mixer.music.get_busy():

        time.sleep(1)

# ============================================================
# MAIN ENGINE
# ============================================================

if __name__ == "__main__":

    print("=" * 80)
    print("VAANI RELATIONSHIP AI ACTIVE")
    print("=" * 80)

    print()

    print("Choose Input Mode:")
    print("1 -> Manual Text")
    print("2 -> Voice Input")

    print()

    choice = input(
        "Enter Choice: "
    )

    print()

    # ========================================================
    # MANUAL INPUT
    # ========================================================

    if choice == "1":

        farmer_question = input(
            "Enter Farmer Question: "
        )

        try:

            detected_lang = detect(
                farmer_question
            )

        except:

            detected_lang = "hi"

    # ========================================================
    # VOICE INPUT
    # ========================================================

    else:

        audio_path = record_audio()

        farmer_question, detected_lang = speech_to_text(
            audio_path
        )

        if audio_path.exists():

            os.remove(audio_path)

    # ========================================================
    # TRANSLATE QUESTION
    # ========================================================

    english_question = translate_to_english(
        farmer_question
    )

    # ========================================================
    # LANGUAGE
    # ========================================================

    farmer_language = language_name(
        detected_lang
    )

    language_code = detected_lang

    # ========================================================
    # MATCH FARMER
    # ========================================================

    matched_farmer = find_best_farmer(
        farmer_language
    )

    # ========================================================
    # GEMINI RESPONSE
    # ========================================================

    english_response = generate_relationship_response(
        matched_farmer,
        english_question
    )

    # ========================================================
    # TRANSLATE RESPONSE
    # ========================================================

    localized_response = translate_response(
        english_response,
        language_code
    )

    # ========================================================
    # GENERATE VOICE
    # ========================================================

    audio_file = generate_voice(
        localized_response,
        language_code
    )

    # ========================================================
    # DISPLAY
    # ========================================================

    print("=" * 80)
    print("DETECTED LANGUAGE")
    print("=" * 80)

    print(farmer_language)

    print()

    print("=" * 80)
    print("QUESTION")
    print("=" * 80)

    print(farmer_question)

    print()

    print("=" * 80)
    print("QUESTION IN ENGLISH")
    print("=" * 80)

    print(english_question)

    print()

    print("=" * 80)
    print("MATCHED FARMER")
    print("=" * 80)

    print(
        "Farmer:",
        matched_farmer["farmer_name"]
    )

    print(
        "District:",
        matched_farmer["district"]
    )

    print(
        "Trust:",
        matched_farmer["trust_level"]
    )

    print(
        "Emotion:",
        matched_farmer["emotional_state"]
    )

    print()

    print("=" * 80)
    print("ENGLISH RESPONSE")
    print("=" * 80)

    print(english_response)

    print()

    print("=" * 80)
    print("LOCALIZED RESPONSE")
    print("=" * 80)

    print(localized_response)

    print()

    print("=" * 80)
    print("VOICE GENERATED")
    print("=" * 80)

    print(audio_file)

    print()

    # ========================================================
    # PLAY AUDIO
    # ========================================================

    play_audio(audio_file)

    pygame.mixer.music.stop()

    pygame.mixer.quit()

    time.sleep(1)

    if audio_file.exists():

        os.remove(audio_file)

    print()

    print("=" * 80)
    print("VAANI AI SESSION COMPLETED")
    print("=" * 80)