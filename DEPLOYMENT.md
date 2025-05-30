# Vercel Deployment Guide for 木魚敲擊應用

## Prerequisites

1. A Vercel account (https://vercel.com)
2. A PostgreSQL database (we recommend Neon, Supabase, or Vercel Postgres)
3. Environment variables from your current Replit setup

## Step 1: Environment Variables

Set up these environment variables in your Vercel project settings:

```
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
REPL_ID=your_app_identifier
ISSUER_URL=https://replit.com/oidc
REPLIT_DOMAINS=your-vercel-domain.vercel.app
```

## Step 2: Database Setup

1. Create a PostgreSQL database on your preferred provider
2. Update the `DATABASE_URL` environment variable
3. Run database migrations using `npm run db:push` locally or use the database schema

## Step 3: Deployment Methods

### Method A: Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from project root:
   ```bash
   vercel
   ```

4. Follow the prompts and set environment variables when asked

### Method B: GitHub Integration

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push

## Step 4: Post-Deployment

1. Update `REPLIT_DOMAINS` to include your Vercel domain
2. Test authentication flow
3. Verify database connectivity
4. Check all API endpoints are working

## File Structure for Vercel

The project includes:
- `vercel.json` - Vercel configuration
- `api/index.ts` - API endpoints for Vercel functions
- Frontend builds to `dist/` directory

## Troubleshooting

### Authentication Issues
- Ensure `REPLIT_DOMAINS` includes your Vercel domain
- Check `SESSION_SECRET` is set correctly

### Database Connection
- Verify `DATABASE_URL` format
- Ensure database allows connections from Vercel

### Build Errors
- Check Node.js version compatibility
- Verify all dependencies are listed in package.json