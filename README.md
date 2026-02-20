# Global Voices | Speak to Inspire

This repository contains a lightweight full-stack web experience inspired by the "Global Voices – Speak to Inspire" showcase. It includes a responsive, accessibility-minded front end and a minimal Node.js API with mock data that powers dynamic sections of the page.

## Project structure

```
.
├── backend
│   ├── package.json
│   └── src
│       ├── data.js
│       └── server.js
└── frontend
    ├── app.js
    ├── index.html
    └── styles.css
```

### Backend
- Pure Node.js HTTP server (no external dependencies) that exposes JSON endpoints for:
  - `/api/metrics` – key program impact metrics.
  - `/api/highlights` – upcoming programs and events.
  - `/api/stories` – featured storyteller spotlights.
  - `/api/contact` – accepts `POST` submissions and stores them in-memory for the session.
- CORS-friendly responses so that the front end can connect during local development or when deployed separately.

### Frontend
- Static HTML/CSS/JS landing page with responsive sections, mobile navigation, and accessible controls.
- Fetches data from the backend to populate metrics, programs, and storyteller carousel content.
- Contact form that posts to the backend and provides user feedback.

## Getting started

1. **Start the backend API**
   ```bash
   cd backend
   npm run start
   ```
   The server listens on `http://localhost:4000` by default.

2. **Open the frontend**
   Use a static file server of your choice or the VS Code Live Server extension to serve the `frontend` directory. For example:
   ```bash
   npx serve ../frontend
   ```
   (If `npx` is unavailable in your environment, you can run `python -m http.server 3000` from inside the `frontend` directory and visit `http://localhost:3000`.)

   The frontend automatically connects to `http://localhost:4000`. If your backend is hosted elsewhere, expose a global variable before loading `app.js`:
   ```html
   <script>
     window.API_BASE_URL = "https://your-api-url";
   </script>
   <script src="app.js" type="module"></script>
   ```

## Testing the API quickly

With the server running you can verify the endpoints using `curl`:

```bash
curl http://localhost:4000/api/metrics
curl http://localhost:4000/api/highlights
curl http://localhost:4000/api/stories
curl -X POST http://localhost:4000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex","email":"alex@example.com","message":"Hello!"}'
```

Each call should return JSON with the relevant data, and the contact submission will be stored for the lifetime of the running server instance.

## Customization ideas

- Replace the mock data in `backend/src/data.js` with your CMS or database integration.
- Extend the front-end carousel to display imagery or embed media from community events.
- Deploy the API to a lightweight Node-compatible hosting service and serve the static frontend from a CDN for production-ready performance.
