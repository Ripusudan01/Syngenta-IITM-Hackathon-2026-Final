from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException
)

import json

from app.core.redis_client import redis_client

from fastapi.staticfiles import StaticFiles

from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from pathlib import Path

import pandas as pd

import shutil
import whisper
import uuid
import os
import time

from gtts import gTTS

from app.services.messaging_service import (
    send_whatsapp
)

# ============================================================
# ML IMPORTS
# ============================================================

from app.ml.stockout_prediction import (
    train_model,
    predict_stockout
)

from app.ml.llm_personalization import (
    LLMPersonalizationEngine
)

from app.ml.trust_intelligence_engine import (
    TrustIntelligenceEngine
)

from app.ml.multilingual_relationship_ai import (
    MultilingualRelationshipAI
)

from app.ml.vaani_voice_assistant import (
    translate_to_english,
    translate_response,
    language_name,
    find_best_farmer,
    generate_relationship_response
)

from app.ml.crop_disease_vision import (
    analyze_crop_image
)

from app.ml.next_best_action_engine import (
    NextBestActionEngine
)

from app.ml.visit_planning_engine import (
    VisitPlanningEngine
)

from app.ml.feature_engineering import (
    FeatureEngineering
)

# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="Krishi Minds API",
    version="2.0",
    description="""
    AI-Guided Field Force Intelligence Platform

    Features:
    - Stockout Prediction ML
    - Next Best Action AI
    - Daily Visit Planning
    - Trust Intelligence
    - City Risk Intelligence
    - Multilingual Relationship AI
    - Vaani Voice AI
    - Crop Disease Vision AI
    """
)

# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

VOICE_OUTPUT_DIR = (
    BASE_DIR / "voice_outputs"
)

VOICE_OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
)

# ============================================================
# STATIC FILES
# ============================================================

app.mount(
    "/voice_outputs",
    StaticFiles(directory=VOICE_OUTPUT_DIR),
    name="voice_outputs"
)

# ============================================================
# FEATURE ENGINEERING
# ============================================================

feature_df = (
    FeatureEngineering
    .build_feature_dataframe()
)

# ============================================================
# LOAD ML ENGINES
# ============================================================

llm_engine = LLMPersonalizationEngine(
    feature_df
)

trust_engine = TrustIntelligenceEngine(
    llm_engine.df
)

multilingual_ai = MultilingualRelationshipAI(
    llm_engine.df
)

next_best_action_engine = (
    NextBestActionEngine(
        llm_engine.df
    )
)

visit_planning_engine = (
    VisitPlanningEngine(
        llm_engine.df
    )
)

# ============================================================
# WHISPER MODEL
# ============================================================

voice_model = None


def get_voice_model():

    global voice_model

    if voice_model is None:

        print("=" * 60)
        print("Loading Whisper Model...")
        print("=" * 60)

        voice_model = whisper.load_model(
            "medium",
            device="cpu"
        )

        print("Whisper Loaded Successfully")
        print()

    return voice_model

# ============================================================
# REQUEST MODELS
# ============================================================


class FarmerQuestionRequest(BaseModel):
    retailer_id: str
    farmer_question: str
    send_to_whatsapp: bool = False


class StockoutPredictionRequest(BaseModel):

    weekly_sales: float
    weekly_revenue: float
    sales_growth: float
    sales_momentum: float

    inventory_qty: float
    avg_inventory: float
    inventory_risk: float
    inventory_risk_norm: float

    engagement_score: float
    engagement_score_norm: float

    rep_coverage_score: float
    coverage_score_norm: float

    territory_health_score: float
    urgency_score: float
    opportunity_score: float

# ============================================================
# HEALTH API
# ============================================================


@app.get(
    "/health",
    tags=["System"],
    summary="Health Check API"
)
def health():

    return {
        "status": "healthy"
    }

# ============================================================
# STOCKOUT APIs
# ============================================================


@app.get(
    "/train-stockout-model",
    tags=["ML Prediction"],
    summary="Train Stockout Prediction Model"
)
def train_stockout_model():

    return train_model()


@app.post(
    "/predict-stockout",
    tags=["ML Prediction"],
    summary="Predict Stockout Risk"
)
def predict_stockout_api(
    data: StockoutPredictionRequest
):

    return predict_stockout(
        data.dict()
    )

# ============================================================
# LLM APIs
# ============================================================


@app.get(
    "/farmer-profile/{retailer_id}",
    tags=["Relationship Intelligence"],
    summary="Get Farmer Profile"
)
def farmer_profile(
    retailer_id: str
):

    return llm_engine.get_farmer_profile(
        retailer_id
    )


@app.get(
    "/relationship-message/{retailer_id}",
    tags=["Relationship Intelligence"],
    summary="Generate Relationship Message"
)
def relationship_message(
    retailer_id: str
):

    return llm_engine.get_relationship_message(
        retailer_id
    )


@app.get(
    "/field-strategy/{retailer_id}",
    tags=["Relationship Intelligence"],
    summary="Get Field Strategy"
)
def field_strategy(
    retailer_id: str
):

    return llm_engine.get_field_strategy(
        retailer_id
    )


@app.get(
    "/llm-summary",
    tags=["Relationship Intelligence"],
    summary="LLM Executive Summary"
)
def llm_summary():

    cache_key = "llm_summary"

    cached = None

    if redis_client:
        cached = redis_client.get(cache_key)

    if cached:
        return json.loads(cached)

    result = llm_engine.executive_summary()

    if redis_client:
        redis_client.setex(
            cache_key,
            600,
            json.dumps(result)
        )

    return result

# ============================================================
# TRUST APIs
# ============================================================


@app.get(
    "/trust-profile/{retailer_id}",
    tags=["Trust Intelligence"],
    summary="Get Farmer Trust Profile"
)
def trust_profile(
    retailer_id: str
):

    return trust_engine.get_farmer_trust(
        retailer_id
    )


@app.get(
    "/critical-farmers",
    tags=["Trust Intelligence"],
    summary="Get Critical Farmers"
)
def critical_farmers():

    return trust_engine.get_critical_farmers()


@app.get(
    "/trust-summary",
    tags=["Trust Intelligence"],
    summary="Trust Intelligence Summary"
)
def trust_summary():

    cache_key = "trust_summary"
    cached = None

    if redis_client:
        cached = redis_client.get(cache_key)

    if cached:
        return json.loads(cached)

    result = trust_engine.get_summary()

    if redis_client:
        redis_client.setex(
            cache_key,
            600,
            json.dumps(result)
        )

    return result

# ============================================================
# NEXT BEST ACTION API
# ============================================================


@app.get(
    "/next-best-action/{retailer_id}",
    tags=["Field Force Intelligence"],
    summary="Generate Next Best Action"
)
def next_best_action(retailer_id: str):

    cache_key = f"next_action:{retailer_id}"
    cached = None

    if redis_client:
        cached = redis_client.get(cache_key)

    if cached:
        return json.loads(cached)

    result = next_best_action_engine.generate_action(
        retailer_id
    )

    if redis_client:
        redis_client.setex(
            cache_key,
            600,
            json.dumps(result)
        )

    return result

# ============================================================
# DAILY VISIT PLAN API
# ============================================================


@app.get(
    "/daily-visit-plan",
    tags=["Field Force Intelligence"],
    summary="Generate Daily Visit Plan"
)
def daily_visit_plan():

    cache_key = "daily_visit_plan"
    cached = None

    if redis_client:
        cached = redis_client.get(cache_key)

    if cached:
        return json.loads(cached)

    result = visit_planning_engine.generate_daily_plan()

    if redis_client:
        redis_client.setex(
            cache_key,
            600,
            json.dumps(result)
        )

    return result

# ============================================================
# CITY RISK SUMMARY API
# ============================================================


@app.get(
    "/city-risk-summary",
    tags=["Risk Intelligence"],
    summary="District Level Risk Intelligence"
)
def city_risk_summary():

    cache_key = "city_risk_summary"
    cached = None

    if redis_client:
        cached = redis_client.get(cache_key)

    if cached:
        return json.loads(cached)
    
    df = llm_engine.df.copy()

    city_risks = []

    grouped = df.groupby("district")

    for district, group in grouped:

        total_farmers = len(group)

        cold_trust = len(
            group[
                group["trust_level"] == "COLD"
            ]
        )

        anxious_farmers = len(
            group[
                group["emotion"] == "ANXIOUS"
            ]
        )

        panic_farmers = len(
            group[
                group["panic_state"] == "PANIC"
            ]
        )

        risk_score = (
            (cold_trust * 2)
            + anxious_farmers
            + (panic_farmers * 3)
        )

        if risk_score >= 15000:

            risk_level = "HIGH"

        elif risk_score >= 10000:

            risk_level = "MEDIUM"

        else:

            risk_level = "LOW"

        city_risks.append({

            "district":
                district,

            "total_farmers":
                total_farmers,

            "cold_trust_farmers":
                cold_trust,

            "anxious_farmers":
                anxious_farmers,

            "panic_farmers":
                panic_farmers,

            "risk_score":
                risk_score,

            "risk_level":
                risk_level
        })

    city_risks = sorted(
        city_risks,
        key=lambda x: x["risk_score"],
        reverse=True
    )

    result = {
        "status": "success",
        "total_cities": len(city_risks),
        "city_risk_summary": city_risks
    }

    if redis_client:
        redis_client.setex(
            cache_key,
            1800,
            json.dumps(result)
        )

    return result

# ============================================================
# EXECUTIVE DASHBOARD API
# ============================================================


@app.get(
    "/executive-dashboard-summary",
    tags=["Executive Dashboard"],
    summary="Executive Dashboard Summary"
)
def executive_dashboard_summary():

    cache_key = "executive_dashboard"
    cached = None

    if redis_client:
        cached = redis_client.get(cache_key)

    if cached:
        return json.loads(cached)

    df = llm_engine.df.copy()

    total_farmers = len(df)

    trusted_farmers = len(
        df[
            df["trust_level"] == "TRUSTED"
        ]
    )

    panic_farmers = len(
        df[
            df["panic_state"] == "PANIC"
        ]
    )

    anxious_farmers = len(
        df[
            df["emotion"] == "ANXIOUS"
        ]
    )

    high_risk_districts = [
        "Patna",
        "Warangal",
        "Meerut"
    ]

    result = {

        "status": "success",

        "total_farmers":
            total_farmers,

        "trusted_farmers":
            trusted_farmers,

        "panic_farmers":
            panic_farmers,

        "anxious_farmers":
            anxious_farmers,

        "high_risk_districts":
            high_risk_districts,

        "active_ai_modules": [
            "Stockout Prediction",
            "Next Best Action",
            "Visit Planning",
            "Trust Intelligence",
            "Voice AI",
            "Crop Disease Vision"
        ]
    }

    if redis_client:
        redis_client.setex(
            cache_key,
            1800,
            json.dumps(result)
        )

    return result

# ============================================================
# MULTILINGUAL AI API
# ============================================================


@app.post(
    "/multilingual-relationship-ai",
    tags=["Relationship AI"],
    summary="Multilingual Farmer Relationship AI"
)
def multilingual_relationship_ai_api(
    request: FarmerQuestionRequest
):
    response = multilingual_ai.generate_response(
        retailer_id=request.retailer_id,
        farmer_question=request.farmer_question
    )

    if request.send_to_whatsapp:

        send_whatsapp(
            "+919876543210",
            response["localized_response"]
        )

        response["delivery_status"] = (
            "WhatsApp Prototype Sent"
        )

    return response

# ============================================================
# VAANI VOICE AI API
# ============================================================


@app.post(
    "/vaani-voice-ai",
    tags=["Voice AI"],
    summary="Vaani Voice Assistant"
)
async def vaani_voice_ai(
    audio: UploadFile = File(...)
):

    start_time = time.time()

    audio_path = (
        BASE_DIR / f"{uuid.uuid4()}.wav"
    )

    try:

        with open(audio_path, "wb") as buffer:

            shutil.copyfileobj(
                audio.file,
                buffer
            )

        model = get_voice_model()

        result = model.transcribe(
            str(audio_path),
            fp16=False
        )

        farmer_question = result["text"]

        detected_lang = result["language"]

        english_question = translate_to_english(
            farmer_question
        )

        farmer_language = language_name(
            detected_lang
        )

        matched_farmer = find_best_farmer(
            farmer_language
        )

        english_response = (
            generate_relationship_response(
                matched_farmer,
                english_question
            )
        )

        localized_response = (
            translate_response(
                english_response,
                detected_lang
            )
        )

        output_audio = (
            VOICE_OUTPUT_DIR /
            f"{uuid.uuid4()}.mp3"
        )

        tts = gTTS(
            text=localized_response,
            lang=detected_lang,
            slow=False
        )

        tts.save(str(output_audio))

        return {

            "status": "success",

            "detected_language":
                farmer_language,

            "question":
                farmer_question,

            "question_english":
                english_question,

            "matched_farmer":
                matched_farmer["farmer_name"],

            "district":
                matched_farmer["district"],

            "trust_level":
                matched_farmer["trust_level"],

            "response_english":
                english_response,

            "localized_response":
                localized_response,

            "audio_file":
                f"http://127.0.0.1:8000/voice_outputs/{output_audio.name}",

            "response_time_seconds":
                round(
                    time.time() - start_time,
                    2
                )
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        if audio_path.exists():

            os.remove(audio_path)

# ============================================================
# CROP DISEASE VISION API
# ============================================================


@app.post(
    "/crop-disease-vision",
    tags=["Crop Vision"],
    summary="Crop Disease Detection AI"
)
async def crop_disease_vision(
    image: UploadFile = File(...)
):

    image_path = (
        BASE_DIR / f"{uuid.uuid4()}.jpg"
    )

    try:

        with open(image_path, "wb") as buffer:

            shutil.copyfileobj(
                image.file,
                buffer
            )

        result = analyze_crop_image(
            image_path
        )

        return {

            "status": "success",

            "analysis":
                result
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        if image_path.exists():

            os.remove(image_path)