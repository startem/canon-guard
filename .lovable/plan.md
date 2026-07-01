# Brand Ops Platform — Market-Ready Plan

Goal: take the current prototype (great UI, all mock/localStorage, several broken flows) and make it a real, agency-focused, all-in-one brand operations platform with a live backend and AI-powered audits.

## Where we are vs. the market
- **Have:** rich UI — 10 audit types, Brand Canon, Strategy Builder, onboarding, governance, analytics, notifications. All data is hardcoded or in `localStorage`; no accounts, no persistence, no real AI.
- **Market:** incumbents (Frontify, Bynder, Brandfolder, Marq) own DAM + guidelines + on-brand content. Our edge as an all-in-one for **agencies**: multi-client governance + automated AI audits in one place, white-labelable.
- **Gaps to close:** (1) no backend/auth, (2) audits are fake, (3) broken flows (e.g. `/brand-canon` route missing, run-audit dead-ends, non-working exports), (4) single-brand mental model — agencies need multi-client.

## Phase 1 — Backend & auth foundation (agency multi-client)
Enable Lovable Cloud, then:
- **Auth:** email/password + Google. Signup/login/logout, password reset page, session listener.
- **Data model (core tables):**
  - `profiles` (name, avatar, linked to auth user)
  - `agencies` (the tenant/workspace) + `agency_members` with `app_role` (owner/admin/editor/viewer) in a separate `user_roles`-style table (no roles on profiles)
  - `clients` (each brand an agency manages) — everything else scopes to a client
  - `brands` / `sub_brands`, `color_tokens`, `messaging_pillars`, `boilerplate`, `legal_items`, `brand_versions` (Brand Canon → real CRUD, tied to a client)
  - `audits` (type, client_id, score, status, run timestamps), `audit_findings`, `issues`, `mentions`, `notifications`
- **RLS on every table**, scoped by `agency_id` via a security-definer `has_agency_access()` / `has_role()` function; explicit GRANTs per table.
- **Client switcher** in the global nav so every dashboard is filtered to the selected client.

## Phase 2 — Fix broken flows & wire real CRUD
- Add the missing `/brand-canon` route; audit every nav link and button for dead ends.
- Replace `localStorage` (`useDataPersistence`, `useBrandContext`) with Cloud-backed queries (React Query).
- Make CRUD real across Brand Canon (hierarchy, colors, messaging, boilerplate, legal, versions), Governance rules, Notifications, User/Team management.
- Fix known non-working actions: **Export Palette**, Run Audit / Run Full Audit, report downloads, issue resolution.
- Loading/empty/error states backed by real data.

## Phase 3 — Real AI-powered audits
- Supabase edge functions calling **Lovable AI** (`google/gemini-3-flash-preview`) to produce genuine audit results instead of hardcoded scores.
- Per audit type, feed the client's Brand Canon (guidelines, colors, messaging, boilerplate) + provided assets/URLs and return structured findings: score, issues, severity, recommendations — persisted to `audits`/`audit_findings`.
- Brand Consistency & Content audits: compare submitted copy/assets against the canon.
- Brand Perception / Social / Mentions: accept pasted content or a URL, run sentiment + on-brand analysis (real web ingestion via Firecrawl can be a later add-on).
- "Run Full Audit" orchestrates all types for the selected client and writes a consolidated Baseline Report.

## Phase 4 — Positioning & onboarding
- Reframe landing/onboarding around the agency all-in-one story: add a client, ingest its brand, run a baseline, monitor continuously.
- Onboarding wizard writes real records (creates the client + initial canon) instead of console logs.
- Tighten IA/nav grouping and consistent design language; ensure responsive on smaller viewports.
- SEO basics on public/marketing surfaces (title, meta description, single H1).

## Suggested sequencing
1. Cloud + auth + core schema + client switcher (Phase 1)
2. Wire Brand Canon + Governance to real data, fix routes/exports (Phase 2)
3. AI audit edge functions + Baseline Report (Phase 3)
4. Onboarding/positioning polish (Phase 4)

## Technical notes
- Roles live in a dedicated table checked via a security-definer function; never trust client-side role state.
- All AI runs server-side in edge functions; `LOVABLE_API_KEY` stays server-only. Handle 429/402 in the UI.
- This is large — I recommend building phase by phase, verifying each before moving on. Phase 1 unblocks everything else.

## Open decision
For agencies I'm assuming team members with roles (owner/admin/editor/viewer) and a `profiles` table. If you'd rather start with single-user accounts and add teams later, tell me and I'll trim Phase 1.