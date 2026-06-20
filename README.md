# AETHER Aura

A concept product page for a **luxury titanium smartwatch**, built as a cinematic,
effect-rich single-page experience. Positioned where elegance meets the edge of
technology: optical health vitals, standalone cellular calls, and a holographic
display concept.

**Live:** https://marvinbaudach.github.io/aether-aura/

## Stack

- React 19 + Vite 8 + TypeScript 6
- Tailwind CSS (OKLCH design tokens, cyan-on-slate system)
- Framer Motion 12, loaded lazily via `LazyMotion` + the `m` component to keep
  the bundle lean (scroll-scrub, reveals, micro-animations)
- Lenis (smooth inertia scroll, fine-pointer only)

## Experience

Apple Watch Series 11 served as the reference for layout, typography and
interaction language (original assets only — no Apple imagery).

- **Hero reveal** — a full-bleed lifestyle frame defocuses and scales back on
  scroll while feature tiles rise into focus.
- **Centerpiece film** — a generated product film, scroll-scrubbed frame by
  frame on desktop, autoplay-looped on touch.
- **Highlights gallery** — auto-advancing media implemented as a full WAI-ARIA
  tabs widget (arrow-key roving, labelled panels) with a visible pause control.
- **Closer look** — sticky product with an accordion that crossfades between two
  consistent camera angles.
- **Health / Connect / Hologram** — hybrid feature sections combining generated
  renders with in-page micro-animations (animated ECG + vital rings, an
  incoming-call widget, a lazy-loaded holographic clip).
- **Battery ring** — animated ring with count-up stats.

All image and video assets are AI-generated (Higgsfield) from a single canonical
master render, then derived view-by-view so the same physical watch appears in
every frame. Every asset was checked for product consistency and rendering
artifacts before inclusion.

## Responsive & performance

- Mobile-first across phone / tablet / desktop breakpoints.
- Responsive `srcset`/`sizes` images (WebP + JPG fallback). Videos lazy-load via
  `IntersectionObserver`; the 720p / desktop variant is chosen in JS (a `<video>`
  `<source media>` is ignored by browsers, so the right file is picked explicitly
  rather than always shipping the full-size clip).
- Honors `prefers-reduced-motion` (via `MotionConfig` plus explicit guards on
  every looping animation) and softens effects on coarse pointers; expensive
  backdrop blur is dropped on small screens.

## Develop

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint        # ESLint (type-aware: strictTypeChecked + stylisticTypeChecked)
npm run typecheck   # tsc --noEmit (strict, incl. noUncheckedIndexedAccess)
npm run build       # type-checked production build
```

## Deploy

Pushing to `main` builds the site and publishes it to GitHub Pages via the
workflow in `.github/workflows/deploy.yml`.
