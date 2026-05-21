from google import genai

from PIL import Image

from dotenv import load_dotenv

import os

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
# ANALYZE CROP IMAGE
# ============================================================

def analyze_crop_image(image_path):

    # Open image

    image = Image.open(image_path)

    # Prompt

    prompt = """
    You are an expert agricultural AI assistant.

    Analyze this crop image carefully.

    Identify:

    - Crop disease
    - Pest attack
    - Nutrient deficiency
    - Leaf damage
    - Water stress

    Explain the issue in simple farmer-friendly language.

    Also provide:
    - likely cause
    - severity
    - practical treatment
    - prevention tips

    Keep response concise and practical.
    """

    # Gemini Vision

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=[
            prompt,
            image
        ]
    )

    return response.text