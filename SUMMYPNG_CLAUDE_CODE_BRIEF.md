# SummyPNG — Master Build Brief for Claude Code

> Photographer portfolio + admin platform for Summy Singh (Montreal photographer).
> Stack: Next.js 16+ App Router, TypeScript, Supabase, Vercel. Domain: summysingh.com.

---

## STEP 0 — INSTALL THE DESIGN SKILL FIRST (REQUIRED)

Before writing a single line of UI, install and use the **UI UX Pro Max** skill. This is non-negotiable for this project. Run these two commands in Claude Code:

```
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

The skill auto-activates on UI/UX requests. For every page you build, invoke its design-system reasoning engine to lock the palette, typography, effects, and anti-patterns BEFORE coding. Persist the system so it stays consistent across the whole site:

```
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "premium photography portfolio dark cinematic" --design-system --persist -p "SummyPNG"
```

Then for each page, create an override file (home, gallery, about, contact, admin) and prioritize it over the master. Do not skip this. The whole point is a site that looks intentionally designed, not templated or AI-generated.

---

## THE VISION

Summy is a Montreal-based photographer shooting moody, cinematic, dark-toned work (people, businesses, hospitality, real estate). The site must feel **premium, simple, and bold** — like a high-end editorial photography magazine. The photos are the hero. Every design decision serves the imagery.

This is not a generic portfolio template. It needs a signature moment that people remember. Take one real aesthetic risk and justify it.

### Non-negotiable design principles
- Dark, moody, cinematic tones that match Summy's photography.
- Minimal UI chrome. Let the photos breathe.
- Bold, confident typography. Pick a characterful display face used with restraint plus a clean body face. Do not reach for the default cream-background-serif-terracotta look.
- Premium motion: orchestrated, deliberate, never scattered. Respect `prefers-reduced-motion`.
- Fully responsive: 375px, 768px, 1024px, 1440px.
- Accessible: visible keyboard focus, 4.5:1 contrast minimum, semantic HTML.

---

## TECH STACK & ARCHITECTURE

- **Framework:** Next.js 16+ (App Router), React, TypeScript in strict mode.
- **Database & Storage & Auth:** Supabase.
- **Image processing:** Sharp via Supabase Edge Function (auto-compress on upload).
- **EXIF extraction:** exifr or equivalent.
- **Animation:** GSAP (ScrollTrigger for the home page) + Framer Motion (page transitions, lightbox, micro-interactions).
- **Deployment:** Vercel, auto-deploy on push to main.
- **Email:** Resend (or Supabase trigger) for inquiry notifications.

### Critical architecture rule — single source of truth
ALL business details live in one file: `/config/business.ts`. Photographer name, email, phone, Instagram handle, location, services, pricing, social links, SEO titles and descriptions. Nothing business-related is hardcoded anywhere else. Every page and component imports from this config.

### Folder structure
```
/app          → routes (public + hidden admin)
/components    → presentational components only
/lib           → pure logic: parser, upload, exporter, supabase client
/hooks         → stateful logic (useGameplan-style hooks)
/types         → all shared TS types in a barrel index.ts
/config        → business.ts (single source of truth)
/styles        → global + print styles
/public        → static assets
```

### Code quality standard
AI tools (you) are writing this, but every line must be readable and explainable by a human developer who has never seen the code. No magic numbers. Named exports only. Pure functions for all business logic. JSDoc comments on every utility explaining input, output, purpose. Business logic never lives inside components. The goal: a senior dev reads this top to bottom and never suspects it was AI-assisted.

---

## PUBLIC SITE — PAGES & FEATURES

### 1. Home page (the signature page)
- Full-screen cinematic hero with bold minimal typography.
- **GSAP ScrollTrigger horizontal scroll section:** as the user scrolls normally, at a certain point the page pins and scroll converts to horizontal movement through a row of Summy's best photos, then unpins and vertical scrolling resumes. This is the signature moment — make it smooth and premium.
- Category preview section linking to the four galleries.
- Cookie consent banner (accept all / necessary only).
- Bold page-entry animation on first load.
- All images pulled from Supabase public bucket (compressed versions only).

### 2. Category gallery pages (4 separate galleries)
Routes: `/gallery/people`, `/gallery/businesses`, `/gallery/hospitality`, `/gallery/real-estate`
- Masonry or grid layout of compressed preview photos.
- Click a photo → full-screen lightbox with smooth **zoom-in animation** (responsive, works on mobile).
- Lightbox shows compressed version only, never full resolution.
- Keyboard navigation (arrows + Escape).
- Lazy loading with blur placeholder.
- Only photos flagged visible in the DB appear.

### 3. About page
- Bio, photo, tagline loaded from Supabase `about_content` (editable by Summy in admin).
- Smooth scroll-reveal animations.

### 4. Contact / Booking page
- Premium **multi-step** form that feels like booking an experience, not a generic contact form.
  - Step 1: select service category (People / Businesses / Hospitality / Real Estate).
  - Step 2: describe the project + preferred date.
  - Step 3: contact details (name, email, phone).
- Animated transitions between steps (Framer Motion).
- Every submission saved to `contact_queries` for analytics. Capture everything — the more data the better.
- UTM source silently attached to each submission.
- Premium confirmation state on success.

---

## BACKEND & DATA

### Database tables (Supabase)
- `photos` — full-res URL, compressed URL, category, EXIF fields, visibility flag, display order, gallery type (portfolio/client).
- `categories` — the four service categories.
- `contact_queries` — name, email, phone, category, description, preferred date, UTM source, timestamp, status (new/read/replied).
- `about_content` — bio, photo, tagline, social links.
- `traffic_sources` — utm_source, utm_medium, utm_campaign, page, timestamp.

### Image upload pipeline (the easy-for-Summy core)
Summy uploads ONE photo. The system does everything else:
1. Full resolution → private bucket.
2. Sharp Edge Function auto-generates a compressed WebP web-preview → public bucket.
3. EXIF auto-extracted (camera, lens, aperture, shutter, ISO, date). Missing fields left null for manual entry later.
4. Photo record written to DB with both URLs + metadata.
5. Supports multi-file batch upload.

Public web preview NEVER serves full resolution. This keeps pages fast and protects Summy's work.

### UTM link tracking
- Read utm params on page load, log to `traffic_sources`.
- Admin has a link generator: Summy enters a label + platform, gets a ready-to-copy tracking link (Instagram bio, Facebook, LinkedIn, anywhere).
- UTM source also stored with contact submissions for full attribution.
- Self-contained in Supabase. No third-party analytics. Only fires if user accepts analytics cookies.

---

## ADMIN PANEL (hidden, Summy-only)

The admin panel is invisible to the public. No links, no nav mentions, not in sitemap, blocked in robots.txt. Hidden route only Summy knows (e.g. `/studio`, not `/admin`). Unauthenticated visitors silently redirect to home.

### Login & dashboard
- Supabase Auth email + password.
- Middleware protects all admin routes.
- Dashboard cards: total photos, total inquiries, new unread, traffic-source breakdown.

### Photo management
- Multi-file drag-and-drop upload + file-picker fallback for batch uploads.
- Two galleries: Portfolio and Client.
- Drag-and-drop reordering.
- Click a photo → detail panel with auto-filled EXIF + editable fields for missing values + visibility toggle + category assignment.
- Delete removes from both buckets and DB.

### Inquiry inbox
- List of all submissions with status badges.
- Detail view with full data + traffic source.
- Mark read/replied, filter by status and category.
- Unread badge in nav.

### About editor
- Rich text bio editor, profile photo upload (same compression pipeline), tagline + social links.
- Live preview before saving.

---

## CLIENT PORTAL (LOW PRIORITY — build last, after everything else is live)
- Separate hidden client login (Supabase Auth).
- Clients see only their own delivered gallery.
- Download triggers a time-limited signed Supabase URL for the full-resolution file.
- Summy assigns photos to a client and marks a project delivered from admin.
- Client emailed when their gallery is ready.

---

## PERFORMANCE & SEO (apply throughout)
- Next.js Image everywhere, lazy loading, blur placeholders, zero layout shift.
- Lighthouse target 90+.
- Compressed WebP only on public pages.
- Meta + Open Graph + Twitter tags on all public pages, sourced from `/config/business.ts`.
- Sitemap excludes admin/client routes. Robots.txt blocks them.

---

## BUILD ORDER (phased)

**Phase 1 — Foundation:** project setup + `/config/business.ts`, Supabase init (schema, buckets, auth, RLS), Vercel pipeline.
**Phase 2 — Core backend:** upload pipeline (Sharp + EXIF), contact/booking backend, UTM tracking.
**Phase 3 — Public frontend:** home (GSAP horizontal scroll), four galleries (lightbox zoom), about, multi-step contact.
**Phase 4 — Admin:** login + dashboard, photo CRUD, inquiry inbox + about editor.
**Phase 5 — Polish:** performance, SEO, cookie consent, responsive QA.
**Phase 6 — Low priority:** client portal.

Note: Supabase setup and Vercel deployment are owned by Shajeed personally — coordinate but the dev work assumes those credentials will be provided.

---

## REMEMBER
1. Install and use UI UX Pro Max before any UI work.
2. Photos are the hero. Premium, simple, bold, dark, cinematic.
3. One signature moment (the GSAP horizontal scroll) — make it unforgettable.
4. Single source of truth: `/config/business.ts`.
5. Code must look hand-crafted by a senior dev. Clean, typed, commented, explainable.
6. Easy for Summy: he uploads one photo, the system handles compression, EXIF, and storage.
