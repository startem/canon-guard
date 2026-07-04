# Platform Interior Redesign — Expert IA & UX

The app chrome (sidebar/header) is already strong. The problem is the **interiors**: every page hand-rolls its own header, spacing, and card treatment, so the product feels inconsistent and "basic." Plus two real layout bugs. This plan fixes the system first, then rolls it across pages so quality is uniform — not page-by-page guesswork.

## Design principles applied
- **One page grammar everywhere**: consistent max-width, vertical rhythm, page header with breadcrumb + title + description + primary action, then content sections.
- **Depth & hierarchy**: elevated cards with the existing `--shadow-elevated`, clear section headings, restrained use of the primary gradient for *one* focal action per view (not everywhere).
- **Information flow**: summary metrics up top → primary work area → contextual/secondary panels on the right → related actions at the bottom. Scannable left-to-right, top-to-bottom.
- **Every state designed**: empty, loading (skeletons), and populated. No bare "Select a client" text.
- **Responsive**: grids collapse cleanly (4→2→1), right rails stack under main content on tablet/mobile.
- Semantic tokens only — no hardcoded colors.

## Phase 1 — Foundation (this wave)
Build reusable interior primitives in `src/components/layout/`:
- `PageShell` — consistent container, padding, max-width, vertical spacing.
- `PageHeader` — breadcrumb, title (font-display), description, actions slot, optional status badges.
- `StatCard` — metric, label, trend delta, icon, sparkline slot; uniform across dashboard/analytics.
- `SectionCard` — titled content block with description + actions, elevated surface.
- `EmptyState` — icon, title, message, optional CTA (replaces bare placeholder text).
- Skeleton loaders for cards/charts.

Also in Phase 1, fix the two bugs found:
1. **Analytics charts** render as empty dashed boxes — give chart containers explicit height and verify data wiring.
2. **Governance & Alerts** renders a **duplicated header bar** — remove the stray inner header.

## Phase 2 — Roll across pages (batched waves, ~3 pages per wave)
Apply the primitives + IA flow to each page. Grouped to batch credits:
- Wave A: Dashboard (Brand Management Hub), Analytics Dashboard, Governance & Alerts
- Wave B: Personality & Story, Positioning & Messaging, Strategy Builder
- Wave C: Identity Designer, Experience & Operations, Visibility & Growth
- Wave D: Brand Canon, Notifications & Alerts, Audit Details / Issue Detail
- Wave E: Onboarding, Ingest & Baseline, Baseline Report, User Management

Each page gets: unified PageHeader, metrics via StatCard, work areas in SectionCards, designed empty/loading states, responsive grid pass.

## Phase 3 — Polish pass
Micro-interactions (hover/active transitions already tokenized), focus states, consistent iconography, and a final responsive sweep at mobile/tablet/desktop.

## Technical notes
- New files under `src/components/layout/`; no business-logic changes — presentation only.
- Reuse existing tokens in `src/index.css` / `tailwind.config.ts` (gradients, shadows, fonts already added).
- Verify each wave with a typecheck + Playwright screenshots at desktop and mobile widths.

## What I need from you
Confirm this foundation-first, batched approach. If you'd rather I skip the plan and just start executing Phase 1 immediately, say "go" and I'll build the primitives + fix both bugs in one wave.
