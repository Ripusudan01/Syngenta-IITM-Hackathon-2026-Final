from langdetect import detect
from deep_translator import GoogleTranslator
import os
from google import genai

from app.ml.conversation_memory import (
    ConversationMemory
)


class MultilingualRelationshipAI:

    def __init__(self, farmer_profiles_df):

        self.df = farmer_profiles_df.copy()

        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )

        self.memory_engine = (
            ConversationMemory()
        )

        self.language_map = {
            "Hindi": "hi",
            "English": "en",
            "Telugu": "te",
            "Punjabi": "pa",
            "Marathi": "mr",
            "Gujarati": "gu",
            "Tamil": "ta",
            "Kannada": "kn",
            "Bengali": "bn",
            "Odia": "or"
        }

    # =========================
    # Detect Language
    # =========================

    def detect_language(self, text):

        try:
            return detect(text)

        except:
            return "unknown"

    # =========================
    # Translate To English
    # =========================

    def translate_to_english(self, text):

        try:

            return GoogleTranslator(
                source="auto",
                target="en"
            ).translate(text)

        except:

            return text

    # =========================
    # Translate Text
    # =========================

    def translate_text(
        self,
        text,
        target_language
    ):

        try:

            if len(target_language) == 2:

                target_lang = target_language

            else:

                target_lang = self.language_map.get(
                    target_language,
                    "en"
                )

            return GoogleTranslator(
                source="auto",
                target=target_lang
            ).translate(text)

        except:

            return text

    # =========================
    # Build AI Reply
    # =========================

    def build_relationship_reply(self, farmer, translated_question, previous_memories):

        prompt = f"""
    You are an expert agricultural advisor helping farmers.

    Farmer Name: {farmer['farmer_name']}
    District: {farmer['district']}
    Trust Level: {farmer['trust_level']}
    Panic State: {farmer['panic_state']}

    Previous Memories:
    {previous_memories}

    Farmer Question:
    {translated_question}

    Instructions:
    - Act as a professional agricultural extension officer.
    - Use the farmer profile and previous memories.
    - Give specific crop recommendations.
    - Mention fertilizers, irrigation, pest management when relevant.
    - Be concise.
    - Keep response under 120 words.
    """

        try:

            response = self.client.models.generate_content(
                model="models/gemini-2.5-flash",
                contents=prompt
            )

            return response.text

        except Exception as e:

            return (
                f"{farmer['farmer_name']} ji, "
                f"Thank you for contacting us. "
                f"We recommend monitoring your crop carefully "
                f"and consulting the local field officer. "
                f"(Fallback response: {str(e)})"
            )

    # =========================
    # Generate Response
    # =========================

    def generate_response(
        self,
        retailer_id,
        farmer_question
    ):

        result = self.df[
            self.df["retailer_id"] == retailer_id
        ]

        if result.empty:

            return {
                "success": False,
                "message": "Retailer not found"
            }

        farmer = result.iloc[0]

        detected_language = (
            self.detect_language(
                farmer_question
            )
        )

        translated_question = (
            self.translate_to_english(
                farmer_question
            )
        )

        # =========================
        # Retrieve memory
        # =========================

        previous_memories = (
            self.memory_engine.retrieve_memory(
                retailer_id,
                translated_question
            )
        )

        # =========================
        # Generate English response
        # =========================

        english_response = (
            self.build_relationship_reply(
                farmer,
                translated_question,
                previous_memories
            )
        )

        # =========================
        # Decide response language
        # =========================

        response_language = (
            detected_language
            if detected_language != "unknown"
            else farmer["preferred_language"]
        )

        localized_response = (
            self.translate_text(
                english_response,
                response_language
            )
        )

        # =========================
        # Store conversation
        # =========================

        self.memory_engine.store_conversation(
            retailer_id,
            translated_question,
            english_response
        )

        return {

            "retailer_id": retailer_id,

            "farmer_name": farmer[
                "farmer_name"
            ],

            "preferred_language": farmer[
                "preferred_language"
            ],

            "detected_language": detected_language,

            "farmer_question_original":
                farmer_question,

            "farmer_question_english":
                translated_question,

            "previous_memories":
                previous_memories,

            "relationship_response_english":
                english_response,

            "localized_response":
                localized_response,

            "trust_level":
                farmer["trust_level"],

            "panic_state":
                farmer["panic_state"]
        }