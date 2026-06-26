# StockHive

StockHive is a lean paper-trading app for practicing stock buying and selling with virtual Indian Rupees.

## What is included

- JWT login and registration
- Virtual balance of `INR 10,00,000` for every new user
- Stock list, search, and stock detail page
- Buy and sell flow
- Portfolio summary and holdings
- Watchlist
- Transaction history
- Profile update and password change
- Dark mode toggle

## Project structure

- `backend` - Express API
- `frontend` - Vite React app

## Setup

### Backend

1. Open a terminal in `backend`
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and update values if needed
4. Start the server:

```bash
npm start
```

The API runs on `http://localhost:5000` by default.

You can also run the entry file directly from the `backend` folder with:

```bash
node server.js
```

### Frontend

1. Open a second terminal in `frontend`
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` if you want to change the API URL
4. Start the app:

```bash
npm run dev
```

The app runs on `http://localhost:5173` by default.

For deployment on Vercel, set this environment variable in the Vercel project:

```bash
VITE_API_URL=https://stockhive-1.onrender.com/api
```

If you deleted your local `frontend/.env`, that is okay for deployment as long as Vercel has the variable set in the project settings.

## Environment variables

### Backend

- `PORT` - API port
- `JWT_SECRET` - JWT signing secret
- `ALLOWED_ORIGINS` - Comma-separated list of allowed frontend origins
- `DATA_FILE` - Optional local JSON storage path
- `MONGODB_URI` - Optional MongoDB Atlas URI for a future database migration

### Frontend

- `VITE_API_URL` - Backend API base URL

## Deployment

### Backend on Render

- Use `npm install`
- Start command: `npm start`
- Set `PORT`, `JWT_SECRET`, `ALLOWED_ORIGINS`, and optionally `DATA_FILE`

### Frontend on Vercel

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_URL` with your Render backend URL

### Backend CORS

- Set `ALLOWED_ORIGINS=http://localhost:5173,https://stock-hive-26.vercel.app`
- Keep `credentials: true` in the server CORS config

## Notes

- The app uses a local JSON store by default so it works out of the box.
- The backend includes Mongoose models so it can be migrated to Atlas later if you want to connect MongoDB.
- For best results, keep the backend running before opening the frontend.
