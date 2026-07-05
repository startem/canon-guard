# CanonGuard — Application Audit & Competitive Strategy

**Surface in scope:** the platform (agency-facing app). Marketing site copy is referenced only where it over-promises vs. what's built. This document is an audit + strategy + roadmap — no code changes happen until you approve.

## 1. What is actually real today (built + deployed + verified in code)

Genuinely backed by the database and working:
- **Auth & multi-tenancy** — sign-in/up, Google OAuth, reset, auto-provisioned agency, RLS-enforced Agency→Member→Client isolation.
- **Brand Canon CRUD** — color tokens, messaging pillars, boilerplate, legal items (full create/edit/delete).
- **AI Audit engine** — all 10 audit types call a real Gemini edge function and persist audits, findings, issues, and notifications.
- **Governance** — rules, approval roles, schedule config CRUD.
- **Notifications** — realtime feed, mark-read/delete.

## 2. Gaps — mock UI with no persistence

These look finished but store nothing (data vanishes on reload):
- **Onboarding Wizard** — collects 5 steps but never creates a `clients` row. New users land with no client, so every data hook returns empty. *Highest-impact dead end.*
- **No client create/edit/delete UI anywhere** — there is no route to add a client.
- **6-page Strategy Builder flow** (Strategy → Positioning → Personality → Identity → Experience → Visibility) — toast + navigate only; nothing feeds the Brand Canon.
- **Ingest & Baseline scanner + Baseline Report** — fake `setTimeout` with hardcoded scores.
- **Analytics Dashboard** — all charts hardcoded; filters do nothing.
- **User Management** — entirely localStorage; never touches `agency_members`/`profiles`.
- **Version History, Backup/Restore, Brand Ingestion** — mock arrays; handlers only `console.log`.
- **Brand Hierarchy / sub-brands** — in-memory only; no `brands` table.
- **Brand Reporting** — hardcoded reports; buttons have no handlers.

## 3. Process gaps — broken workflows (loops that start but never complete)

- **Audit → Issue → Detail is a dead end.** Audits correctly write real `issues`, but `/issue-detail/:id` ignores the id and always shows a hardcoded fixture. The entire issue lifecycle cannot be worked.
- **`/audit-details/:category` is orphaned** — mock data, disconnected from real `audit_findings`.
- **Issue assignment is impossible** — UI assigns to hardcoded names ("Sarah Wilson"…) but `assignee` is a UUID FK. No real assignment, due-date editing, or manual issue creation.
- **"Drift against Baselines" does not exist.** No baselines table, no snapshotting, no drift computation — it is the core marketed concept but is pure UI theater.
- **Scheduled audits never fire.** `audit_schedules` stores config but nothing (cron/edge trigger) executes it.
- **Strategy Builder never populates the Canon** it's meant to seed.
- **Dashboard overview "Run" buttons** are fake (`console.log`), unlike the real per-tab audit panels.

## 4. Backend / integrity issues

- **`run-audit` CORS import is invalid** (`npm:@supabase/supabase-js@2/cors` doesn't exist) — risks breaking browser preflight; needs inline `corsHeaders`. Verify against live function logs.
- Dead columns never written: `governance_rules.created_by`, `issues.assignee/due_date`, most of `audit_schedules`, `profiles.avatar_url`.
- `notifications` scoped to agency only (any member sees all clients' notifications); unbounded query with no pagination.
- No dedup/idempotency on repeated audit runs.

## 5. Competitive landscape (market research)

| Competitor | Focus | Their gap = our opening |
|---|---|---|
| Frontify / Bynder / Kadanza | DAM + guidelines + portals | Storage-centric; weak on *automated drift detection over time* |
| BrandGuard AI / Marka / BrandPatrol | AI asset-level brand checks | Single-brand enterprise; not agency multi-client |
| Adobe GenStudio Brand Intelligence | Real-time validation in Adobe stack | Locked to Adobe ecosystem, enterprise-priced |
| Warrant | Marketing/legal regulatory compliance | Compliance niche, not full brand governance |

**Our defensible wedge:** *agency-first, multi-client brand governance with a versioned Brand Canon and quantified Drift-over-time.* Competitors are mostly single-brand DAMs or one-shot asset checkers. To win we must make three things undeniably real and best-in-class: (a) the **Brand Canon as living source-of-truth**, (b) **AI audit → issue → resolution lifecycle**, (c) **Baseline + Drift trend** that no DAM offers.

## 6. Recommended remediation roadmap (batched to control credit burn)

**Wave 1 — Fix the broken spine (make the core loop real).** *What's built vs verified will be stated per item.*
1. Client CRUD + wire Onboarding Wizard to actually create a `clients` row.
2. Make `/issue-detail/:id` load the real issue; enable status, real assignee (agency members), due-date, and manual issue creation.
3. Reconnect `/audit-details` to real `audit_findings`; add an audit history view.
4. Fix `run-audit` CORS import; verify via edge logs.

**Wave 2 — Deliver the differentiator (Baselines & Drift).**
5. Add `baselines` table; real ingest snapshot; compute drift from successive audit scores; wire Baseline Report + a Drift trend view to live data.

**Wave 2 status (built + typechecks pass; not yet verified with live data — DB has no clients/audits):**
- `baselines` table created with GRANTs + RLS (agency→client access via `has_client_access`).
- `useBaselines` hook: captures a live snapshot (latest audit score per type → overall + per-category + findings/issues counts) and computes drift vs the reference baseline.
- `IngestBaseline` now captures a real baseline from audit data (no more fake `setTimeout`).
- `BaselineReport` renders current vs baseline score, a drift trend area chart, per-category breakdown, and prioritised next steps linking to real audit findings.

**Wave 3 — Real data surfaces.**
6. Analytics Dashboard on real audit/issue/notification data with working filters.
7. User Management on real `agency_members`/`profiles` (invite, role change) — replace localStorage.

**Wave 4 — Strategy flow + automation.**
8. Persist the 6-page Strategy Builder into the Brand Canon.
9. Version history + backup/restore against a real snapshot table.
10. Execute `audit_schedules` (pg_cron or scheduled function) + notifications for overdue issues and expiring legal items.

## 7. Decisions I need from you

- **Scope now:** approve the full 4-wave roadmap, or start with Wave 1 only (fix the broken core loop first)?
- **Mock pages:** for pages that are pure mock (Strategy flow, Analytics, etc.) — make them real, or cut/hide them until built to avoid demoing vapor?
- **Baselines & Drift:** confirm this is the flagship differentiator to invest in (Wave 2), since it's our clearest competitive moat.

## Technical notes
- Wave 1 touches: `App.tsx` (new routes), `OnboardingWizard.tsx`, new client-CRUD components, `IssueDetail.tsx`, `AuditDetails.tsx`, `useIssues.tsx`, `run-audit/index.ts`.
- Wave 2 needs new migrations (`baselines`, `brands`, drift snapshot) with GRANTs + RLS following the Agency→Client access helpers already in place.
- Automation (Wave 4) requires pg_cron availability; confirm plan tier or use a scheduled edge function.
