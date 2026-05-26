# Automated Code Reviewer

A full-stack application that automatically reviews source code using AI (Grok API).

## Features
- Paste code and select a language.
- Get AI-powered code reviews focusing on bugs, security, performance, best practices, etc.
- Track review history and view analytics dashboard.
- Dark/Light mode, modern responsive UI.

## Tech Stack
- **Frontend**: React, Vite, Monaco Editor, Recharts, Plain CSS
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB
- **AI**: Grok API

## Local Development
1. Rename `.env.example` to `.env` and fill in your MongoDB URI and Grok API Key.
2. Install dependencies:
   ```bash
   npm run install:all
   ```
3. Start the dev servers (both frontend and backend):
   ```bash
   npm run dev
   ```

## Deployment
This project is configured for Vercel deployment.
- The `client` directory is built and served as static assets.
- The `server/api/index.js` serves as the serverless API backend for `/api/*` routes.
# automated-code-reviewer
