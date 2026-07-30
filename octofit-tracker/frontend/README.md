# OctoFit Tracker Frontend

This React 19 + Vite app is the presentation tier for OctoFit Tracker.

## Environment configuration

Define `VITE_CODESPACE_NAME` in `octofit-tracker/frontend/.env.local` when running in Codespaces:

```bash
VITE_CODESPACE_NAME=your-codespace-name
```

When `VITE_CODESPACE_NAME` is set, components call endpoints like:

- `https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`
- `https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities/`

When `VITE_CODESPACE_NAME` is not set, the app safely falls back to localhost endpoints under `http://localhost:8000/api/...`.

## Run

```bash
npm run dev --prefix octofit-tracker/frontend
```
