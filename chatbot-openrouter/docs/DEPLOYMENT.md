# Deployment Guide

This guide explains how to deploy the Chatbot via OpenRouter application to Cloudflare.

## Prerequisites

1. Cloudflare account
2. Node.js 18+ and npm 8+ installed
3. Wrangler CLI installed (`npm install -g wrangler`)
4. Git installed

## Backend (Cloudflare Worker) Setup

### 1. Login to Cloudflare

```bash
wrangler login
```

### 2. Create a new D1 database

```bash
cd workers
wrangler d1 create chatbot-db
```

Update the `wrangler.toml` file with the new database ID.

### 3. Apply the database schema

```bash
wrangler d1 execute chatbot-db --file=../database/schema.sql
```

### 4. Set environment variables

```bash
wrangler secret put OPENROUTER_API_KEY
wrangler secret put SESSION_SECRET  # Generate a secure random string
```

### 5. Deploy the Worker

```bash
npm install
npm run deploy
```

## Frontend (Cloudflare Pages) Setup

### 1. Install dependencies

```bash
cd ../frontend
npm install
```

### 2. Build the application

```bash
npm run build
```

### 3. Deploy to Cloudflare Pages

1. Go to Cloudflare Dashboard > Pages
2. Connect your GitHub repository
3. Configure build settings:
   - Framework: Next.js
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Root directory: `frontend`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your Worker URL (e.g., `https://your-worker.your-account.workers.dev`)

## Environment Variables

### Worker Environment Variables

- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `SESSION_SECRET`: A secure random string for session encryption
- `NODE_ENV`: `production` or `development`

### Frontend Environment Variables

- `NEXT_PUBLIC_API_URL`: The URL of your deployed Worker

## Development Workflow

1. Create a feature branch: `git checkout -b feature/step-N-description`
2. Make your changes
3. Test locally:
   - Worker: `cd workers && npm run dev`
   - Frontend: `cd frontend && npm run dev`
4. Commit your changes: `git commit -am "Step N: Description of changes"`
5. Push and create a pull request
6. After review, merge to `main`
7. The changes will be automatically deployed

## Troubleshooting

- Check Cloudflare Worker logs in the Cloudflare dashboard
- For D1 issues, use `wrangler d1 execute chatbot-db --command="SELECT * FROM sqlite_master;"` to inspect the database
- For build issues, check the Cloudflare Pages build logs
