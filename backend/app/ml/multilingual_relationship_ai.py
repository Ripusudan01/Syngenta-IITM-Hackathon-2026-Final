from langdetect import detect
from deep_translator import GoogleTranslator

from app.ml.conversation_memory import (
    ConversationMemory
)


class MultilingualRelationshipAI:

    def __init__(self, farmer_profiles_df):

        self.df = farmer_profiles_df.copy()

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

    def build_relationship_reply(
        self,
        farmer,
        translated_question,
        previous_memories
    ):

        trust = farmer["trust_level"]

        panic = farmer["panic_state"]

        memory = farmer["memory_context"]

        farmer_name = farmer["farmer_name"]

        question = translated_question.lower()

        # =========================
        # Previous memory context
        # =========================

        memory_context_text = ""

        if previous_memories:

            memory_context_text = (
                "We noticed similar crop issues during earlier conversations. "
            )

        # =========================
        # Pest / insects
        # =========================

        if any(
            word in question
            for word in [
                "insect",
                "insects",
                "pest",
                "bug",
                "infestation",
                "worm"
            ]
        ):

            return (
                f"{farmer_name} ji, "
                f"{memory_context_text}"
                f"We understand pest problems "
                f"can spread quickly. "
                f"Please inspect affected leaves "
                f"immediately. "
                f"Our field team will guide you "
                f"with pest control measures."
            )

        # =========================
        # Yellow crops
        # =========================

        if any(
            word in question
            for word in [
                "yellow",
                "yellowing",
                "yellowish"
            ]
        ):

            return (
                f"{farmer_name} ji, "
                f"{memory_context_text}"
                f"Yellowing may happen due to "
                f"nutrient deficiency or "
                f"water stress. "
                f"Our advisory team recommends "
                f"field inspection this week."
            )

        # =========================
        # Water / flood
        # =========================

        if any(
            word in question
            for word in [
                "water",
                "flood",
                "rain",
                "rainfall",
                "overflow",
                "waterlogging"
            ]
        ):

            return (
                f"{farmer_name} ji, "
                f"{memory_context_text}"
                f"Excess water can damage "
                f"crop roots. "
                f"Please improve drainage "
                f"if possible."
            )

        # =========================
        # Heat / dryness
        # =========================

        if any(
            word in question
            for word in [
                "dry",
                "heat",
                "hot",
                "temperature",
                "sunlight",
                "drought"
            ]
        ):

            return (
                f"{farmer_name} ji, "
                f"{memory_context_text}"
                f"Heat stress may reduce "
                f"crop growth. "
                f"Please monitor irrigation carefully."
            )

        # =========================
        # Panic fallback
        # =========================

        if panic == "PANIC":

            return (
                f"{farmer_name} ji, "
                f"We understand your concern. "
                f"We remember: {memory}. "
                f"Please do not panic. "
                f"Our field team will support you immediately."
            )

        # =========================
        # Trusted fallback
        # =========================

        if trust == "TRUSTED":

            return (
                f"Namaste {farmer_name} ji 🙏 "
                f"We remember your previous season. "
                f"{memory}. "
                f"Your crop situation can improve "
                f"with early monitoring."
            )

        # =========================
        # Cold fallback
        # =========================

        if trust == "COLD":

            return (
                f"We noticed your field conditions "
                f"may need attention. "
                f"Our advisory team recommends "
                f"monitoring this week."
            )

        return (
            f"We noticed similar field conditions nearby. "
            f"Timely action can reduce crop stress risk."
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