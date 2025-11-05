This repository contains a Node/Express backend and a Vite React frontend.

Goal: Deploy a single web service that serves both API and the built frontend (like the example link you provided).

Recommended approach (Render.com - single service):

1) Build frontend locally or in Render's build step
   - Ensure `frontend` has package.json with `build` script (it does: `vite build`).

2) Configure Render (Web Service - Node):
   - Build Command: cd frontend && npm install && npm run build
   - Start Command: npm start
   - Root Directory: backend (or repository root; Render runs build step from repo root)
   - Environment Variables (set on Render dashboard):
     - MONGO_URI (your MongoDB connection string)
     - JWT_SECRET (a random string)
     - ADMIN_SECRET_KEY (admin secret used in your admin signup route)
     - PORT (optional; Render provides one)
     - NODE_ENV=production

Notes:
- The backend `package.json` now defines `start: node server.js` so Render's start command will run the backend server.
- `server.js` serves static files from `frontend/dist` when `NODE_ENV=production`.

Quick local test (production-mode):

1. Build frontend
   cd frontend
   npm install
   npm run build

2. Start the backend in production mode (from repo root):

   # Windows PowerShell
   set NODE_ENV=production; cd backend; npm install; npm start

3. Open http://localhost:4000 (or the configured PORT) to see the frontend and API running together.

Alternative: Deploy frontend as a static site (Vercel/Netlify) and backend separately (Render/Heroku). If you prefer that, let me know and I'll provide steps.

Troubleshooting:
- If the frontend is not found, ensure `frontend/dist/index.html` exists (created by `npm run build`).
- Check server logs for errors connecting to MongoDB (MONGO_URI) or missing env vars.

If you want, I can also:
- Add a small `start: "cd frontend && npm ci && npm run build && cd ../backend && npm start"` combined script (not recommended for CI), or
- Add a Render `render.yaml` manifest for one-click deploy.

Tell me which provider you want (Render, Vercel, Netlify) and I will prepare a tailored `render.yaml` or instructions.  