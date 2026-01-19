# Environment Variables

This document describes all environment variables required to run ShopTalk.

## Quick Start

1. Copy `.env.example` to `.env.local`
2. Fill in the required values from your service dashboards
3. For production, add these to your Vercel project settings

## AI Services

### Anthropic (Claude AI)

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | API key from [Anthropic Console](https://console.anthropic.com/) |

## Authentication (Clerk)

Configure at [Clerk Dashboard](https://dashboard.clerk.com/)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Public key for client-side auth (starts with `pk_`) |
| `CLERK_SECRET_KEY` | Yes | Secret key for server-side auth (starts with `sk_`) |
| `CLERK_WEBHOOK_SECRET` | Yes | Webhook signing secret (starts with `whsec_`) |

### Clerk Setup Notes

1. Create a new application in Clerk Dashboard
2. Enable desired authentication methods (email magic link recommended)
3. Configure redirect URLs:
   - Sign-in: `/sign-in`
   - Sign-up: `/sign-up`
   - After sign-in: `/`
   - After sign-up: `/`
4. Set up webhook (after first deployment):
   - URL: `https://shoptalk-ek30mn1an-edel-projects.vercel.app/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`
   - Copy the signing secret and add as `CLERK_WEBHOOK_SECRET` in Vercel

## Database (Supabase)

Configure at [Supabase Dashboard](https://supabase.com/dashboard)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project URL (e.g., `https://xxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anonymous/public key for client-side queries |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key for server-side operations (bypasses RLS) |

### Supabase Setup Notes

1. Create a new project in Supabase Dashboard
2. Navigate to Settings > API to find your keys
3. Run the database schema (see `docs/DATABASE.md`)
4. Enable Row Level Security on all tables

## Environment by Context

### Local Development (`.env.local`)

All variables listed above are required for full functionality.

### CI/CD (GitHub Actions)

Add these secrets to your repository settings:

- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Production (Vercel)

All variables should be configured in Vercel project settings. Use `vercel env pull` to sync to local.

## Security Notes

- **Never commit** `.env.local` or any file containing real secrets
- **Never expose** `CLERK_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` to the client
- Variables prefixed with `NEXT_PUBLIC_` are bundled into client-side code
- Use Vercel's environment variable UI for production secrets
