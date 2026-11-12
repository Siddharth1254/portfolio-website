# Siddharth Taurani — Portfolio

> **Live:** [siddharth-taurani.vercel.app](https://siddharth-taurani.vercel.app/)

Personal portfolio for AI / ML engineering work, experience, and projects — space-themed night/day design with an EN | FR switch.

## Tech stack

- **React 18** + **TypeScript**
- **Vite** for bundling and the local/dev server
- **three.js** `0.128.0` for the Experience rocket journey (npm, not CDN)
- Custom CSS (`src/styles/portfolio.css`) — no Tailwind, no shadcn/ui
- **@fontsource** self-hosted fonts: Big Shoulders Display, Schibsted Grotesk, Martian Mono (plus Bricolage Grotesque, IBM Plex Sans, JetBrains Mono for project reels)
- **react-router-dom** for `/` and the 404 page

## Features

- Night / Day theme (`localStorage` key `st-theme`), applied before first paint
- English / French (`localStorage` key `st-lang`) for every visible string
- Procedural sky canvases, project reel thumbnails, and WebGL experience journey (with a plain-list fallback if WebGL fails)

## Getting started

```bash
npm install
npm run dev
```

Dev server: [http://localhost:8080](http://localhost:8080).

## Scripts

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build
npm run lint     # ESLint
```

## Project layout

- `src/components/sections/` — one component per section (Hero, About, Experience, …)
- `src/data/` — typed content (`experience`, `projects`, `skills`, `certifications`, `terminal`, `profile`)
- `src/i18n/` — EN/FR UI strings and language provider
- `src/lib/` — canvas / three.js / reels helpers (client-only, cleaned up on unmount)
- `src/styles/portfolio.css` — design tokens and layout
- `reference/portfolio-reference.html` — design source of truth
- `public/certificates/` — certification card images (PDFs optional)

## Deploy

Pushes to GitHub deploy via **Vercel** (Vite defaults; no `vercel.json` required).
