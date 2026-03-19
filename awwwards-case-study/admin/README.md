# Crisp Admin App

This is a standalone Next.js application for managing content on the Crisp website.

## Features
- **JSON Editor**: Direct editing of GCS-stored content.
- **AI Editor**: Natural language content updates via Gemini.
- **Media Gallery**: Manage assets in GCS.
- **Deployment Dashboard**: Trigger Cloud Builds for staging and production.

## Local Development
```bash
npm install
npm run dev
```
Runs on [http://localhost:3001](http://localhost:3001).

## Deployment
Deploys to Google Cloud Run. See the root `DEPLOYMENT.md` for details.
