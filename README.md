# SummyPNG

Photographer portfolio + admin platform for **Summy Singh** - a Montreal-based
photographer shooting moody, cinematic, dark-toned work (people, businesses,
hospitality, real estate). The public site is premium, simple, and bold; the
photos are the hero. A hidden admin lets Summy upload one photo and have the
system handle compression, EXIF extraction, and storage.

- **Live domain:** [summysingh.com](https://summysingh.com)
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind
  CSS v4 · Supabase (DB / Storage / Auth) · Vercel
- **Animation:** GSAP (ScrollTrigger) + Framer Motion
- **Images:** Sharp (auto-compress) + EXIF extraction

## Single source of truth

All business details - name, contact, social links, services, SEO copy - live in
[`config/business.ts`](config/business.ts). Nothing business-related is hardcoded
anywhere else; every page and component imports from this config.

## Project structure

```
app/         → routes (public site + hidden admin)
components/   → presentational components only
lib/         → pure logic: supabase client, parsers, upload, exporter
hooks/       → stateful logic
types/       → shared TypeScript types (barrel: types/index.ts)
config/      → business.ts - single source of truth
styles/      → global + print styles
public/      → static assets
design-system/ → persisted UI/UX Pro Max design system (master + per-page overrides)
```

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in Supabase + Resend values
npm run dev                  # http://localhost:3000
```

> **Note:** Supabase and Vercel are provisioned by Shajeed. Until credentials are
> supplied, the app scaffolds against the placeholder keys in `.env.example` and
> Supabase wiring stays inert.

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server (Turbopack)     |
| `npm run build` | Production build                     |
| `npm run start` | Serve the production build           |
| `npm run lint`  | Lint with ESLint                     |

## Build phases

1. **Foundation** - project setup, `config/business.ts`, Supabase init, Vercel pipeline.
2. **Core backend** - upload pipeline (Sharp + EXIF), contact/booking backend, UTM tracking.
3. **Public frontend** - home (GSAP horizontal scroll), galleries (lightbox zoom), about, multi-step contact.
4. **Admin** - login + dashboard, photo CRUD, inquiry inbox, about editor (at the hidden `/darkroom` route).
5. **Polish** - performance, SEO/AEO/GEO, cookie consent, responsive QA.
6. **Client portal** *(low priority)* - delivered galleries with signed download URLs.

See [`SUMMYPNG_CLAUDE_CODE_BRIEF.md`](SUMMYPNG_CLAUDE_CODE_BRIEF.md) for the full brief.
