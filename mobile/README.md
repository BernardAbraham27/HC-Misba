# God Grace Home Products Mobile

Customer-only Expo mobile app for God Grace Home Products.

## Run

```bash
cd mobile
npm install
npm start
```

## Notes

- This app is isolated from the existing `frontend/` and `backend/`.
- Admin access is intentionally blocked in mobile.
- The app uses backend APIs when available and falls back to local sample products for browsing.
- For local API setup, copy `.env.example` to `.env` and update the base URL if needed.
- `npm start` uses Expo LAN mode on port `8111` by default because tunnel mode can fail with an `ngrok` startup error on some machines.
- If you specifically need Expo tunnel mode, run `npm run start:tunnel`.
- If Metro cache gets sticky, run `npm run start:clear`.
