# Implementation status

The repository now includes:

- Initial PostgreSQL schema
- Row-level security policies
- Vehicle and customer API validation endpoints
- A structured CLI command shell
- Cross-platform project entry points

## Important next setup step

Create a Supabase project, add the environment variables, and apply:

```bash
npx supabase db push
```

Do not publish the Supabase service-role key in client applications. Each client should use the public anon key only and rely on RLS policies.
