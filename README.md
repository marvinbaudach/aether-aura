# AETHER Aura

Cinematic concept page for a fictional luxury titanium smartwatch.

**Live → [marvinbaudach.github.io/aether-aura](https://marvinbaudach.github.io/aether-aura/)**

## Tech

- React 19 · Vite 8 · TypeScript 6 (strict, type-aware ESLint)
- Tailwind CSS (OKLCH tokens)
- Framer Motion 12 — lazy-loaded via `LazyMotion`/`m`
- Lenis smooth scroll · scroll-driven animations · native `<dialog>` · gyro parallax
- Responsive `srcset` WebP, lazy video, `prefers-reduced-motion` aware
- All assets AI-generated (Higgsfield) from one canonical master render

## Develop

```bash
npm install
npm run dev      # dev server
npm run build    # type-checked production build
```

Deploys to GitHub Pages on push to `main`.
