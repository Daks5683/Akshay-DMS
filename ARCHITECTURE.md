# Akshay DMS — architecture

## Intended runtime

Each client uses the same Supabase/Postgres API. Supabase Auth provides role-based access; Supabase Realtime broadcasts changes to every connected client. PostgreSQL constraints and database transactions protect stock and sales integrity.

## Core domains

- Inventory
- Customers
- Sales
- Service
- Staff
- Reporting

## First implementation slice

The initial repository setup establishes the monorepo and cross-platform entry points. The next implementation step adds database migrations, authentication, CRUD flows, realtime subscriptions, and test suites.
