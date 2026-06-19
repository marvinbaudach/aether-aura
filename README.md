# AETHER Aura

A futuristic luxury smartwatch product page, built as a cinematic single page experience.

**Live:** https://marvinbaudach.github.io/aether-aura/

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS
- Framer Motion (scroll-scrub and reveals)
- Lenis (smooth inertia scroll)

Scroll drives an assembly video and an emitter reveal frame by frame, with a
horizontal pan-lock strip in between. All image and video assets are AI
generated and kept consistent to one titanium watch design.

## Develop

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # type-checked production build
```

## Deploy

Pushing to `main` builds the site and publishes it to GitHub Pages via the
workflow in `.github/workflows/deploy.yml`.
