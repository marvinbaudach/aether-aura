import { useState, type JSX } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ease } from '../anim'
import Reveal from './Reveal'

interface Feature {
  key: string
  label: string
  body: string
  webp: string
  jpg: string
  alt: string
}

// Non-empty tuple so FEATURES[0] is a guaranteed fallback under
// noUncheckedIndexedAccess — no non-null assertion needed below.
const FEATURES: [Feature, ...Feature[]] = [
  { key: 'shell', label: 'Machined shell', body: 'One billet of titanium, milled into a sealed monocoque.', webp: 'assets/aura_hero_1200.webp', jpg: 'assets/aura_hero_1000.jpg', alt: 'Three-quarter view of the titanium Aura' },
  { key: 'sensor', label: 'Optical back', body: 'Lasers read heart rate and glucose straight through the skin.', webp: 'assets/aura_cl_sensor_1200.webp', jpg: 'assets/aura_cl_sensor_1000.jpg', alt: 'The Aura caseback with its laser health-sensor array' },
  { key: 'core', label: 'Nuclear core', body: 'A sliver of radioisotope fuel runs the Aura for decades. No cable.', webp: 'assets/aura_cl_core_1200.webp', jpg: 'assets/aura_cl_core_1000.jpg', alt: 'Cutaway of the Aura revealing its glowing radioisotope fuel cell' },
]

// Sticky product viewer: a pinned render on one side, an accordion of design
// notes on the other. Selecting a note crossfades the product to that detail —
// the same physical watch, shown from a consistent set of angles.
const CloserLook = (): JSX.Element => {
  const [active, setActive] = useState(0)
  const img = FEATURES[active] ?? FEATURES[0]

  return (
    <section id="design" className="relative flex min-h-svh snap-start flex-col justify-center px-[max(1.25rem,6vw)] py-[clamp(3rem,6vh,4.5rem)]">
      <div className="mx-auto w-full max-w-shell">
        <Reveal className="mb-8">
          <p className="font-sans text-[0.74rem] uppercase tracking-[0.34em] text-accent">Take a closer look</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.6vw,3.6rem)] font-medium leading-[1.04] text-gradient">
            Design you can feel before you read a spec.
          </h2>
        </Reveal>

        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          {/* Sticky product */}
          <div className="mx-auto w-full max-w-[18rem] md:sticky md:top-24 md:h-fit md:max-w-sm">
            <div className="relative overflow-hidden rounded-[28px] border border-hairline-soft bg-[radial-gradient(120%_120%_at_50%_0%,oklch(0.22_0.016_242)_0%,oklch(0.145_0.014_245)_70%)]">
              <div className="relative flex aspect-square items-center justify-center py-5">
                <AnimatePresence mode="wait">
                  <m.picture
                    key={img.key}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.55, ease }}
                    className="relative h-full w-full"
                  >
                    <source type="image/webp" srcSet={img.webp} />
                    <img src={img.jpg} alt={img.alt} className="h-full w-full object-contain p-4" loading="lazy" decoding="async" />
                  </m.picture>
                </AnimatePresence>
                <div className="pointer-events-none absolute left-1/2 top-[12%] h-[1px] w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                {/* Caption ties the render to the selected note — essential on
                    mobile, where the accordion sits below the image. */}
                <AnimatePresence mode="wait">
                  <m.div
                    key={img.key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4, ease }}
                    className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-3 px-6 py-5"
                  >
                    <span className="font-mono text-[0.8rem] tabular-nums text-accent">{`0${String(active + 1)}`}</span>
                    <span className="font-sans text-[0.95rem] font-medium text-ink">{img.label}</span>
                  </m.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Accordion */}
          <div className="flex flex-col">
            {FEATURES.map((f, idx) => {
              const open = idx === active
              return (
                <div key={f.key} className="relative border-b border-hairline-soft">
                  {/* active marker: a vertical accent bar anchors the selection */}
                  <m.span
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-[2px] origin-top bg-accent"
                    initial={false}
                    animate={{ scaleY: open ? 1 : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.3, ease }}
                  />
                  <button
                    id={`cl-acc-${f.key}`}
                    onClick={() => { setActive(idx); }}
                    aria-expanded={open}
                    aria-controls={`cl-panel-${f.key}`}
                    className="flex w-full items-center gap-4 py-4 pl-5 text-left"
                  >
                    <span className={`font-mono text-[0.8rem] tabular-nums transition-colors ${open ? 'text-accent' : 'text-faint'}`}>
                      {`0${String(idx + 1)}`}
                    </span>
                    <span className={`flex-1 font-display text-[clamp(1.3rem,2.4vw,1.9rem)] font-medium transition-colors ${open ? 'text-ink' : 'text-faint hover:text-muted'}`}>
                      {f.label}
                    </span>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors ${open ? 'border-accent/60 bg-accent/15 text-accent' : 'border-hairline text-muted'}`}>
                      <m.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3, ease }} className="text-lg leading-none">+</m.span>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <m.div
                        id={`cl-panel-${f.key}`}
                        role="region"
                        aria-labelledby={`cl-acc-${f.key}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 pl-5 pr-8 font-sans text-[1.05rem] leading-relaxed text-muted">{f.body}</p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CloserLook
