import { useEffect, useRef, useState, type JSX } from 'react'
import type { KeyboardEvent } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ease } from '../anim'
import Reveal from './Reveal'

interface Slide {
  key: string
  label: string
  title: string
  body: string
  // Native 16:9 landscape art so the wide gallery frame fills edge-to-edge
  // without cropping the watch (the portrait product shots used elsewhere left
  // the watch clipped top and bottom in this layout).
  art: string
}

const SLIDES: Slide[] = [
  {
    key: 'health',
    label: 'Vitals',
    title: 'Your body, read in light.',
    body: 'A cyan optical beam samples your pulse ninety times a second — no contact pads, no wires.',
    art: 'aura_hl_vitals',
  },
  {
    key: 'calls',
    label: 'Calls',
    title: 'Talk, untethered.',
    body: 'Answer and place calls straight from your wrist while your phone stays in another room.',
    art: 'aura_hl_calls',
  },
  {
    key: 'dive',
    label: 'Dive',
    title: 'Down to 500 metres.',
    body: 'Sealed against the deep, the Aura films stills and 4K video far below where any phone would drown.',
    art: 'aura_hl_dive',
  },
]

const AUTO_MS = 5200

// Apple-style highlights gallery implemented as a proper WAI-ARIA tabs widget:
// arrow keys roam the tablist, each tab controls a labelled tabpanel, and the
// frame auto-advances. A visible pause control plus hover/reduced-motion guards
// satisfy WCAG 2.2.2 (Pause, Stop, Hide).
const Highlights = (): JSX.Element | null => {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion() ?? false
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // WCAG 2.2.2 (Pause, Stop, Hide): auto-advancing content must be pausable.
  // Reduced-motion users never start moving; everyone else gets an explicit
  // toggle, and pointer hover / keyboard focus pause it while they read.
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const autoplay = !reduced && !paused && !hovered

  useEffect(() => {
    if (!autoplay) return
    const t = window.setTimeout(() => { setIndex((v) => (v + 1) % SLIDES.length); }, AUTO_MS)
    return () => { window.clearTimeout(t); }
  }, [index, autoplay])

  const slide = SLIDES[index]
  if (!slide) return null

  const select = (next: number) => {
    const wrapped = (next + SLIDES.length) % SLIDES.length
    setIndex(wrapped)
    tabRefs.current[wrapped]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        select(index + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        select(index - 1)
        break
      case 'Home':
        e.preventDefault()
        select(0)
        break
      case 'End':
        e.preventDefault()
        select(SLIDES.length - 1)
        break
    }
  }

  return (
    <section className="cv-section relative flex min-h-svh snap-start flex-col justify-center bg-bg px-[max(1.25rem,6vw)] py-[clamp(4rem,9vh,6.5rem)]">
      {/* Hover or keyboard focus anywhere in the gallery pauses the rotation so
          it never slides out from under someone reading or interacting. */}
      <div
        className="mx-auto w-full max-w-shell"
        onMouseEnter={() => { setHovered(true); }}
        onMouseLeave={() => { setHovered(false); }}
        onFocusCapture={() => { setHovered(true); }}
        onBlurCapture={() => { setHovered(false); }}
      >
        <Reveal className="mb-6 flex flex-col items-start justify-between gap-5 md:mb-10 md:flex-row md:items-end md:gap-6">
          <h2 className="max-w-[16ch] font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.04] text-gradient">
            Get the highlights.
          </h2>

          <div className="flex items-center gap-3">
            <div
              role="tablist"
              aria-label="Product highlights"
              aria-orientation="horizontal"
              className="flex flex-wrap gap-2"
              onKeyDown={onKeyDown}
            >
              {SLIDES.map((s, idx) => {
                const selected = idx === index
                return (
                  <button
                    key={s.key}
                    id={`hl-tab-${s.key}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`hl-panel-${s.key}`}
                    tabIndex={selected ? 0 : -1}
                    ref={(el) => {
                      tabRefs.current[idx] = el
                    }}
                    onClick={() => { setIndex(idx); }}
                    className={`relative overflow-hidden rounded-full border px-4 py-2 font-sans text-[0.86rem] transition-colors ${
                      selected
                        ? 'border-accent/50 bg-accent/15 text-ink'
                        : 'border-hairline text-muted hover:border-accent/40 hover:text-ink'
                    }`}
                  >
                    {s.label}
                    {selected && autoplay && (
                      <m.span
                        key={`p-${String(index)}`}
                        aria-hidden
                        className="absolute bottom-0 left-0 h-[2px] bg-accent"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* WCAG 2.2.2 pause control. Hidden for reduced-motion users, who
                never see motion to pause in the first place. */}
            {!reduced && (
              <button
                type="button"
                onClick={() => { setPaused((p) => !p); }}
                aria-pressed={paused}
                aria-label={paused ? 'Resume auto-advancing highlights' : 'Pause auto-advancing highlights'}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-hairline text-muted transition-colors hover:border-accent/40 hover:text-ink"
              >
                {paused ? (
                  <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current"><path d="M8 5v14l11-7z" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
                )}
              </button>
            )}
          </div>
        </Reveal>

        <div
          id={`hl-panel-${slide.key}`}
          role="tabpanel"
          aria-labelledby={`hl-tab-${slide.key}`}
          tabIndex={0}
          className="relative overflow-hidden rounded-[28px] border border-hairline-soft bg-bg-soft"
        >
          <div className="grid items-center gap-0 md:grid-cols-[1.1fr_0.9fr]">
            <div className="relative aspect-video max-h-[40vh] w-full overflow-hidden md:max-h-none">
              <AnimatePresence mode="wait">
                <m.picture
                  key={slide.key}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.6, ease }}
                  className="absolute inset-0"
                >
                  <source
                    type="image/webp"
                    srcSet={`assets/${slide.art}_800.webp 800w, assets/${slide.art}_1200.webp 1200w`}
                    sizes="(max-width: 767px) 100vw, 55vw"
                  />
                  <img src={`assets/${slide.art}_1200.jpg`} alt={slide.title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                </m.picture>
              </AnimatePresence>
            </div>

            <div className="p-6 md:p-12">
              <AnimatePresence mode="wait">
                <m.div
                  key={slide.key}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease }}
                >
                  <span className="font-sans text-[0.72rem] uppercase tracking-[0.3em] text-accent">{slide.label}</span>
                  <h3 className="mt-4 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-[1.08]">
                    {slide.title}
                  </h3>
                  <p className="mt-4 max-w-[40ch] font-sans text-[1.05rem] text-muted">{slide.body}</p>
                </m.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Highlights
