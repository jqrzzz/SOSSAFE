# CLAUDE.md — SOSSAFE

## What Is This Project?

SOSSAFE is the **hotel & tour operator safety certification portal** in the Tourist SOS
ecosystem (tourist-sos.com). It's where accommodation providers and tour operators:

1. Sign up and create their partner profile
2. Complete 3 safety training modules (80% pass threshold)
3. Get SOS Safe certified (Basic / Premium / Elite tiers)
4. Manage their team (invite staff via shareable URL, track training)
5. View emergency cases reported via WhatsApp/LINE (read-only analytics layer)
6. Export incident logs for insurance/compliance

**URL:** Deployed on Vercel. Frontend only — no API routes that modify shared tables.

---

## Tech Stack

- **Framework:** Next.js 14 + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (CSS-first config via `@import "tailwindcss"`)
- **Auth:** Supabase Auth (shared across all SOS projects)
- **Database:** Shared Supabase instance (see below)
- **Package manager:** pnpm
- **Deployment:** Vercel

---

## Shared Supabase Database

All 6 SOS projects share **one Supabase instance**:
- **Project ref:** `jnbxkvlkqmwnqlmetknj`
- **URL:** `https://jnbxkvlkqmwnqlmetknj.supabase.co`

### SOSSAFE Owns These Tables

Created in `scripts/001_create_partner_tables.sql`, `scripts/002_create_staff_training_table.sql`, and `scripts/003_create_local_knowledge_table.sql`:

| Table | Purpose |
|---|---|
| `partners` | Hotels, accommodations, tour operators |
| `partner_memberships` | Links users to partner orgs (owner/manager/staff roles) |
| `certifications` | SOS Safe certification records per partner |
| `certification_submissions` | Module assessment responses + scores |
| `staff_training_completions` | Individual staff training records per module |
| `partner_local_knowledge` | Staff-contributed local safety intel (medical, transport, hazards) |

**Enums owned:** `partner_type`, `certification_status`, `certification_tier`, `partner_membership_role`

### SOSSAFE Reads These Tables (DO NOT MODIFY)

| Table | Owner | SOSSAFE Usage |
|---|---|---|
| `users` | Supabase Auth (shared) | Foreign keys, auth |
| `cases` | SOSCOMMAND | Display case details (read-only) |
| `case_parties` | SOSCOMMAND | Link partners to cases (read-only) |
| `case_events` | SOSCOMMAND | Case timeline display (read-only) |

### Other Projects' Tables (NEVER TOUCH)

| Project | Tables |
|---|---|
| **SOSWEBSITE** (~40 tables) | `countries`, `teams`, `team_members`, `specialties_catalog`, `capabilities_catalog`, `document_types`, `agreement_types`, `patients`, `patient_reps`, `providers`, `provider_contacts`, `provider_capabilities`, `provider_specialties`, `provider_onboarding`, `provider_intelligence`, `payers`, `payer_contacts`, `payer_plans`, `cases` (foundation), `case_financial_modes`, `case_parties`, `case_episodes`, `case_assignments`, `case_status_history`, `tasks`, `notes`, `escalations`, `comm_logs`, `insurer_interactions`, `documents`, `document_versions`, `signers`, `signatures`, `agreements`, `agreement_documents`, `agreement_status_history`, `invoices`, `claims`, `payments`, `receivables`, `guarantees_of_payment`, `inquiries` |
| **SOSTRAVEL** (20 tables) | `profiles`, `medical_profiles`, `allergies`, `medications`, `medical_conditions`, `vital_signs`, `emergency_contacts`, `insurance_policies`, `documents`, `health_records`, `health_record_documents`, `emergency_cases`, `emergency_responders`, `chat_sessions`, `chat_messages`, `photo_analyses`, `facilities`, `facility_visits`, `whatsapp_sessions`, `sosa_projects` |
| **SOSCOMMAND** (11 tables) | `verification_attempts`, `case_communications`, `case_tasks`, `case_transport`, `case_gops`, `case_financials`, `case_medical_reviews`, `case_activity_log`, `insurers`, `case_invoices`, `notifications` |
| **SOSPRO** (10 tables) | `organizations`, `profiles`, `organization_members`, `patients`, `transfers`, `case_activities`, `vehicles`, `crew_members`, `vehicle_assignments` |
| **SOSPHD** (13 tables, all `phd_`-prefixed or in-memory) | `sites`, `profiles`, `cases`, `events`, `recommendations`, `actions`, `audit_log`, `research_notes`, `tasks`, `advisor_sessions`, `advisor_messages`, `docs`, `doc_versions` |

**Rule: If a table is not in the "SOSSAFE Owns" section above, do NOT create, alter, or delete it.**

---

## Project Structure

```
app/
  api/chat/          # SOSA AI streaming endpoint (POST, text stream)
  auth/              # Login, signup, callback (team invite auto-linking)
  onboarding/        # New partner setup flow
  dashboard/
    page.tsx         # Analytics dashboard (certification, cases, team stats)
    certification/   # 3-module assessment flow + certificate display
    knowledge/       # Local knowledge base (staff-contributed safety intel)
    training/        # Individual "My Training" page
    cases/           # Case list + detail view + CSV export (read-only)
    team/            # Team members + training status matrix
    profile/         # Partner profile editor
components/
  dashboard/         # DashboardNav, Certificate
  ui/                # shadcn primitives (do not delete — design system)
  SosaChat.tsx       # Public SOSA chat (AI + simulated fallback)
  Logo.tsx           # Brand logo
lib/
  certification-data.ts    # Single source of truth: modules, questions, scoring
  knowledge-categories.ts  # Single source of truth: knowledge categories, fields, examples
  sosa-system-prompt.ts    # SOSA system prompt builder (public + dashboard contexts)
  use-sosa-chat.ts         # Custom streaming chat hook (replaces AI SDK useChat)
  supabase/          # Supabase client/server/middleware helpers
  utils.ts           # Just cn() utility
scripts/
  001_create_partner_tables.sql
  002_create_staff_training_table.sql
  003_create_local_knowledge_table.sql
```

---

## Key Architecture Decisions

- **Certification data** lives in `lib/certification-data.ts` — all questions, scoring
  logic, tier definitions. Update here, not in components.
- **Local knowledge categories** live in `lib/knowledge-categories.ts` — category
  definitions, form field visibility, example entries. Update here, not in components.
- **Team invites** use URL params (`?invite=PARTNER_ID&role=staff`) + auth callback
  auto-linking. No separate invitations table needed.
- **Cases are read-only.** Cases are created by SOSCOMMAND via WhatsApp/LINE intake.
  SOSSAFE only displays them — never creates, updates, or deletes cases.
- **Staff training** is tracked separately from org certification via
  `staff_training_completions` (per-user, per-module, with upsert on retry).
- **Print CSS** uses `:has(#sos-certificate)` scoping for certificate isolation.
  General print support (incident log) uses Tailwind's `print:` variant.
- **SOSA AI chat** uses `ai` SDK v6 + `@ai-sdk/anthropic`. The API route
  (`app/api/chat/route.ts`) streams text via `streamText` + `toTextStreamResponse()`.
  The client uses a custom `useSosaChat` hook (not `ai/react` which was removed in v6).
  Two contexts: "public" (sales assistant) and "dashboard" (partner-aware assistant
  with certification status, team info, and local knowledge in the system prompt).
  Public chat falls back to simulated keyword-matching responses if the API fails.

---

## Conventions

- **Type-check before committing:** `npx tsc --noEmit`
- **No unused imports or dead code.** Clean as you go.
- **Passing score:** 80% (`PASSING_SCORE` constant in certification-data.ts)
- **Soft deletes:** Team member removal uses `removed_at` timestamp, not hard delete.
- **RLS everywhere:** All tables have Row Level Security. Users only see their own
  partner's data.
- **No CLAUDE.md in sibling repos yet.** This is the first. Same pattern should be
  added to the other 5 projects.

---

## Build & Dev

```bash
pnpm dev          # Local dev server
pnpm build        # Production build (may fail offline due to Google Fonts)
npx tsc --noEmit  # Type-check (use this as the primary validation)
```

---

## The 6 SOS Ecosystem Projects

| Repo | Role | Status |
|---|---|---|
| **SOSWEBSITE** | Public marketing site + internal sales console | Live |
| **SOSTRAVEL** | Consumer traveler app (medical records, emergencies) | Live |
| **SOSCOMMAND** | Internal command center (case lifecycle, billing) | Live |
| **SOSPRO** | Provider/clinic portal (facilities, transport) | Mock data |
| **SOSSAFE** | Partner certification portal (this repo) | Live |
| **SOSPHD** | Public health research analytics | In-memory stores |
