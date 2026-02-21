# Zipo Fresh - Grocery Delivery App

A production-ready online grocery delivery web app built with Next.js, TailwindCSS, Supabase, and Netlify Functions.

## Features

- **Storefront**: Browse products, categories, search, filter.
- **Cart & Checkout**: LocalStorage cart, Google Maps location picker, Cash on Delivery or senangPay.
- **Order Tracking**: Real-time status updates for guests via secure Order Code.
- **Staff Portals**:
  - **Admin**: Manage orders, assign riders.
  - **Rider**: View assigned tasks, navigation, update status.
- **Backend**: Supabase (PostgreSQL, Auth, Realtime) + Netlify Functions (Payment integration).

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TailwindCSS, Lucide React.
- **Backend**: Supabase (Database, Auth, Realtime).
- **Serverless**: Netlify Functions (Node.js) for payment processing.

## Prerequisites

- Node.js 18+
- Supabase Account
- Netlify Account
- Google Maps API Key
- senangPay Merchant Account (for payments)

## Setup Instructions

### 1. Clone & Install
```bash
git clone <repo_url>
cd zipo-fresh
npm install
cd apps/web && npm install
```

### 2. Environment Variables
Copy `.env.example` to `apps/web/.env.local` and `.env` (root).

**apps/web/.env.local**
```ini
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_NETLIFY_FUNCTIONS_BASE_URL=http://localhost:8888/.netlify/functions
```

**Root .env (for Netlify/Local Functions)**
```ini
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SENANGPAY_MERCHANT_ID=your_merchant_id
SENANGPAY_SECRET_KEY=your_secret_key
SITE_URL=http://localhost:3000
```

### 3. Supabase Setup
Run the SQL migrations in `supabase/migrations` via Supabase Dashboard SQL Editor or CLI:
1. `20240101000000_initial_schema.sql` (Tables & RLS)
2. `20240101000001_rpc_functions.sql` (RPC)
3. `20240101000002_seed_data.sql` (Seed Data)

**Create Staff Users:**
1. Sign up a user in Supabase Auth.
2. Go to `public.profiles` table.
3. Update their `role` to `admin` or `rider`.

### 4. Run Locally
**Frontend:**
```bash
cd apps/web
npm run dev
```

**Netlify Functions:**
```bash
npm install -g netlify-cli
netlify dev
```

## Deployment

### Frontend (Vercel)
1. Import `apps/web` directory as the project root.
2. Add Environment Variables (`NEXT_PUBLIC_...`).
3. Deploy.

### Backend (Netlify)
1. Link the repository to Netlify.
2. Set "Base directory" to `/`.
3. Set "Publish directory" to `apps/web/.next` (if deploying full site) or just use it for Functions.
4. Add Environment Variables (`SUPABASE_...`, `SENANGPAY_...`).
5. The functions will be deployed to `/.netlify/functions/...`.

### senangPay Configuration
Set the Return URL and Callback URL in your senangPay dashboard:
- **Return URL**: `https://<your-netlify-site>/.netlify/functions/senangpay-return`
- **Callback URL**: `https://<your-netlify-site>/.netlify/functions/senangpay-callback`
