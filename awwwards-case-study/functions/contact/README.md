# Contact Form Cloud Function

A Node.js Google Cloud Function (Gen2) that handles contact form submissions.

## Logic
1. **Rate Limiting**: Prevents abuse from single IPs.
2. **Anti-Spam**: Honeypot and time-to-fill checks.
3. **Email**: Sends notifications via Resend API.
4. **CORS**: Restricted to allowed origins (configured via env).

## Deployment
```bash
npm run deploy
```
Deploys to Google Cloud Functions. See the root `DEPLOYMENT.md` for details.
