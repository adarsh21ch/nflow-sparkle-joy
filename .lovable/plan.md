# Video-First Platform Restructure

This is a large, multi-phase product change. To keep it safe and verifiable, I'll ship it in clearly bounded phases, verifying each before moving to the next, and I will NOT touch the things that just got stabilized (published funnel preview, Razorpay, R2 upload, RLS, edge functions) unless absolutely required.

Before any code is written, I'll do a short audit pass so I can give you accurate, schema-correct work — not guesses.

---

## Phase 0 — Audit (no code changes)

I will read and report back:
- `video_assets` actual columns (incl. whether `description`, `thumbnail_url`, `allow_seek`, `allow_playback_speed`, `visibility`, `view_count` exist)
- `funnels`, `landing_pages`, `live_sessions` columns related to `video_id` / steps
- Existing pages: `Dashboard`, `VideosPage`, `PublicVideoPage`, `FunnelEditor`, `LandingPageEditor`, `LivePage`, `UploadFirstOnboarding`
- Existing modals: `VideoUploadModal`, `VideoShareModal`, `VideoRenameModal`, `VideoPickerModal`
- Mobile nav state (is there a bottom nav already?)

Deliverable: a short written report of what already exists, what's missing, and exactly which DB columns are/aren't there. **No SQL will be proposed without verified column names.**

---

## Phase 1 — Upload-first dashboard

- If `useHasVideos().hasVideos === false` → render a single, calm onboarding card with "Upload your first video" as primary CTA + 1-line explainer.
- If videos exist → keep current dashboard but ensure the top row is: latest video card + quick actions (Copy Link, Open, Upload, Create Funnel, Create LP, Go Live) + lightweight KPI strip (views, leads, funnels, plan).
- Defer heavy analytics queries (lazy/suspended below the fold).

Verify: new account flow, existing account flow, mobile.

## Phase 2 — Upload flow (YT-Studio-inspired, our brand)

Refactor `VideoUploadModal` into a 4-step flow: Upload → Details → Settings → Done/Share.
- Only fields backed by real columns are shown. If `description`/thumbnail upload aren't supported by current schema, I'll tell you and we decide whether to add them (with verified migration) or omit.
- "Settings" exposes only flags that already exist. New flags require schema work — flagged separately.
- "Done" screen shows preview + public link + Copy / Open / Use in Funnel / LP / Live.

## Phase 3 — Videos hub

Upgrade `VideosPage` (and admin variant stays as-is):
- List + Grid toggle, persisted in localStorage.
- Real status badges (uploading/processing/ready/failed) with appropriate actions.
- Failed → Retry/Remove. Uploading → progress + safe cancel if backend supports it (verify first).
- Polished placeholder when thumbnail missing — no giant blank cards.
- Thumbnails only — never autoload full video files in the list.

## Phase 4 — Video detail/edit page

New route `/videos/$id` with tabs: Details / Analytics / Usage / Settings.
- Analytics shows ONLY metrics that actually exist in the DB (likely just `view_count`, maybe daily). No fabricated retention.
- Usage tab queries funnels/landing_pages/live_sessions for `video_id` references and lists them with deep links.
- Settings saves only real columns.

## Phase 5 — Public video watch page

Polish `PublicVideoPage`:
- Desktop: large player, title, description, creator row (photo, name, KYC verified badge if column exists), share, optional CTA.
- Mobile: stacked, share visible, no cramped layout.
- Player: enforce `allow_seek` / `allow_playback_speed` if those columns exist. If they don't, I'll flag and we add them via verified migration before wiring UI.
- Same player component reused by funnel/landing/live so the rule applies everywhere.

## Phase 6 — Funnels start from a video

Rework `FunnelEditor` create flow:
- No "single vs multi" question.
- Step 1: Choose Video (or upload). Step 2: optional "Add another video step".
- Single video = single-step funnel; more = multi-step. No schema change expected — just UI flow.
- **Will NOT touch** the publish/preview path that was just fixed.

## Phase 7 — Landing pages & live from videos

- Landing page create: video picker first; if none, prompt upload.
- Live create: video picker first; then title/date/time/access.
- Existing builders untouched beyond entry point.

## Phase 8 — Mobile-first

- Bottom nav: Home / Videos / Leads / Create / Profile (Create opens an action sheet).
- Replace wide tables on mobile with cards (already partly done in admin — apply to user side).
- Audit each redesigned page on 390px viewport.

## Phase 9 — Safety & perf pass

- Verify: published funnel preview still works, Razorpay flow untouched, R2 upload untouched, public links untouched.
- Skeletons, lazy thumbnails, dedupe Supabase queries.
- Run typecheck/build.

---

## What I will NOT do without checking with you first

- Any SQL migration. If a phase needs a new column (e.g. `allow_seek`, `description`, thumbnail), I'll stop, show the real current schema, and propose the exact migration for your approval.
- Any edge function redeploy. If one is required, I'll list it explicitly.
- Any change to the funnel publish/preview path we just stabilized.

## Deliverables per phase

After each phase I'll report: what changed, files touched, what was tested (browser + console), any DB/edge-fn action required from you, and the verification-checklist items covered.

---

**To start:** I'll do Phase 0 (audit) and Phase 1 (upload-first dashboard) in the first pass, since Phase 1 is low-risk and gives immediate value, then pause for your go-ahead before Phase 2.