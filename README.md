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

## Environment variables

### Backend

- `PORT` - API port
- `JWT_SECRET` - JWT signing secret
- `CLIENT_URL` - Frontend origin for CORS
- `DATA_FILE` - Optional local JSON storage path
- `MONGODB_URI` - Optional MongoDB Atlas URI for a future database migration

### Frontend

- `VITE_API_URL` - Backend API base URL

## Notes

- The app uses a local JSON store by default so it works out of the box.
- The backend includes Mongoose models so it can be migrated to Atlas later if you want to connect MongoDB.
- For best results, keep the backend running before opening the frontend.
