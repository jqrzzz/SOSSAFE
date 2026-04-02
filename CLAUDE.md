# SOSSAFE Project

## Supabase Database Connections

IMPORTANT: This project has TWO Supabase MCP connections. Make sure you use the correct one.

- **SOS database** (`jnbxkvlkqmwnqlmetknj.supabase.co`) - This is the correct database for all SOS-related projects. It contains tables like `cases`, `patients`, `providers`, `payers`, `claims`, `agreements`, `certifications`, `escalations`, `documents`, `invoices`, `teams`, etc.

- **Nomadex database** (`mdamwgtdtrvvnskqdoon.supabase.co`) - This is for the Muay Thai / ScootScoot projects. It contains tables like `organizations`, `bookings`, `trainer_profiles`, `gym_subscriptions`, etc. Do NOT use this for SOS work.

To identify which MCP connection is which, run:
```sql
SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename LIMIT 5;
```
If you see `cases`, `patients`, `providers` - you're on the SOS database (correct).
If you see `bookings`, `organizations`, `trainer_profiles` - you're on Nomadex (wrong one for this repo).
