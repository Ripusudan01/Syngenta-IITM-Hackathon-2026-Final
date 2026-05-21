# Krishi Minds - Syngenta IITM Hackathon 2026

AI-Guided Field Force Intelligence Platform for Agriculture.

Krishi Minds is an AI-powered agricultural intelligence ecosystem designed to improve farmer engagement, field-force operations, multilingual support, and agricultural decision-making using AI/ML.

---

# Project Structure

```bash
Syngenta-IITM-Hackathon-2026-Final/
│
├── backend/
│
├── frontend/
│
└── README.md
```

---

# Key Features

* Multilingual Voice AI Assistant
* Crop Disease Detection
* Stockout Prediction
* Next Best Action Engine
* Daily Visit Planning
* Trust Intelligence Engine
* Relationship AI
* District Risk Intelligence
* Executive Dashboard APIs
* Real-time FastAPI APIs

---

# Tech Stack

## Backend

* FastAPI
* Python
* UV Package Manager
* Whisper AI
* Gemini API
* Scikit-learn
* Pandas
* OpenCV
* PyTorch

## Frontend

* ReactJS
* Vite
* TailwindCSS
* Axios

---

# Backend Setup

## 1. Navigate to Backend

```bash
cd backend
```

---

## 2. Create Virtual Environment

```bash
uv venv
```

---

## 3. Activate Virtual Environment

### Windows

```bash
.venv\Scripts\activate
```

### Linux / Mac

```bash
source .venv/bin/activate
```

---

## 4. Install Dependencies

```bash
uv sync
```

---

## 5. Create Environment File

Create a `.env` file inside the backend folder.

```env
GEMINI_API_KEY=your_api_key_here
```

---

## 6. Run Backend Server

```bash
uv run uvicorn app.main:app --reload
```

---

## Backend URL

```bash
http://127.0.0.1:8000
```

---

## Swagger Documentation

```bash
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

## 1. Navigate to Frontend

```bash
cd frontend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Run Frontend

```bash
npm run dev
```

---

## Frontend URL

```bash
http://localhost:5173
```

---

# Important APIs

| API                               | Description                  |
| --------------------------------- | ---------------------------- |
| `/next-best-action/{retailer_id}` | AI recommendation engine     |
| `/daily-visit-plan`               | Smart visit planning         |
| `/predict-stockout`               | Stockout risk prediction     |
| `/crop-disease-vision`            | Crop disease detection       |
| `/vaani-voice-ai`                 | Multilingual voice assistant |
| `/trust-profile/{retailer_id}`    | Trust intelligence           |
| `/city-risk-summary`              | District-level intelligence  |


---

# Future Improvements

* GPU acceleration for Whisper
* Real-time dashboard analytics
* WhatsApp integration
* Offline AI support
* IoT integration
* Satellite crop intelligence

---

# Developed For

Syngenta IITM Hackathon 2026
