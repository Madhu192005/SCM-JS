# Supply Chain App

A full-stack supply chain management application with:

- Express + JavaScript (Node.js) backend
- SQLite database
- Static HTML/CSS/JS frontend
- Admin and manager views

## Project Structure

- `backend/` — API server, database access, and routes (plain JavaScript)
- `frontend/` — login, admin, and manager pages

## Run Locally

1. Open a terminal in the project root.
2. Start the backend:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. In another terminal, serve the frontend:

   ```bash
   cd frontend
   python -m http.server 3000
   ```

4. Open:

   - http://localhost:3000/index.html
   - API health check: http://localhost:3001/api/health

## Default Login

- **Email**: admin@supply.com
- **Password**: admin123

## Notes

- The backend is plain JavaScript — no TypeScript required.
- The backend uses SQLite and runs on port `3001` by default.
- The frontend is served on port `3000`.
- Make sure `backend/.env` exists (copy from `.env.example`).
