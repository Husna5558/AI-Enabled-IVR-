# Frontend (static HTML)

Files:
- `index.html` — main demo UI
- `app.js` — JS to call backend endpoints (/flows, /vxml/webhook, /nlu/process)

How to run:

1. Serve the `frontend/` directory with a static server. Example (PowerShell):

   python -m http.server 8080 --directory "c:\Users\ammum\OneDrive\Desktop\project_ivr\frontend"

2. Open http://127.0.0.1:8080/ in a browser.

Notes:
- The page defaults to backend `http://127.0.0.1:8000`. Change the Backend input at the top if your API runs elsewhere.
- The HTML frontend is intentionally dependency-free and works with the existing demo server endpoints.
