# 🌾 Krishi Minds — Backend

AI-powered agriculture assistant APIs built with FastAPI. Includes voice recognition, multilingual support, and crop disease detection.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd backend
```

### 2. Install UV (if not installed)

```bash
pip install uv
```

### 3. Create a Virtual Environment

```bash
uv venv
```

### 4. Activate the Environment

**Windows PowerShell:**
```powershell
.venv\Scripts\activate
```

### 5. Install Dependencies

```bash
uv sync
```

### 6. Install FFmpeg

1. Download FFmpeg from: 
2. Extract the archive.
3. Add the `bin` folder to your PATH temporarily:

```powershell
$env:Path += ";C:\Users\YourName\Downloads\ffmpeg\bin"
```

4. Verify the installation:

```bash
ffmpeg -version
```

### 7. Configure Environment Variables

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
```

### 8. Run the Server

```bash
uvicorn app.main:app --reload --reload-dir app
```

### 9. Open Swagger Docs

```
http://127.0.0.1:8000/docs
```
