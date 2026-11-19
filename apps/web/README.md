# Akshay DMS web application

## Run locally

From the repository root, install the workspace dependencies, copy the environment file, and start Next.js:

```bash
npm install
cp apps/web/.env.example apps/web/.env.local
npm run dev
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`. Apply the SQL migration under `supabase/migrations` to your Supabase project and enable Realtime for `vehicles`, `customers`, `sales`, and `service_jobs`.

Create staff accounts from Supabase Authentication. The dashboard signs in with email/password and uses the public anon key; authorization is enforced by database row-level security. Never put a Supabase service-role key in the browser or a `NEXT_PUBLIC_` variable.

The current UI supports live lists and add forms for vehicles and customers. Sales and service are live read-only lists in this slice. Cloud database and hosting free tiers have limits and may change; a custom domain and production operation may incur costs.
