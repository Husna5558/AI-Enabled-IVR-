# Conversational IVR Modernization Framework

This repository is a starter scaffold for the Conversational IVR Modernization Framework described in the project statement.

What you get:
- A minimal FastAPI backend implementing an integration layer and a simple rule-based NLU.
- A Streamlit frontend to visualize IVR flows and test conversations interactively.
- Sample converted IVR flow JSON and docs describing flow mapping.
- Minimal pytest tests and a requirements file.

Run locally (PowerShell):

```powershell
cd C:\Users\ammum\OneDrive\Desktop\project_ivr
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Start the backend
uvicorn app:app --reload --port 8000

# In another terminal start the frontend (Streamlit)
streamlit run streamlit_app.py
```

Notes
- The current NLU is a keyword-based rule system for demo purposes. Replace it with spaCy, Rasa, or an external model for production.
- Audio (ASR/TTS) endpoints are placeholders and will need provider-specific implementations.
