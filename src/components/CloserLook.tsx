import { useState, type JSX } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ease } from '../anim'

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
  { key: 'core', label: 'Nuclear core', body: 'A sliver of radioisotope fuel runs the Aura for decades, with no cable.', webp: 'assets/aura_cl_core_1200.webp', jpg: 'assets/aura_cl_core_1000.jpg', alt: 'Cutaway of the Aura revealing its glowing radioisotope fuel cell' },
]

// Sticky product viewer: a pinned render on one side, an accordion of design
// notes on the other. Selecting a note crossfades the product to that detail,
// the same physical watch shown from a consistent set of angles.
const CloserLook = (): JSX.Element => {
  const [active, setActive] = useState(0)
  const img = FEATURES[active] ?? FEATURES[0]

  return (
    <section id="design" className="relative flex min-h-svh flex-col justify-center px-[max(1.25rem,6vw)] py-[clamp(3rem,6vh,4.5rem)]">
      <div className="mx-auto w-full max-w-shell">
        <h2 className="mb-8 max-w-[22ch] font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.04]">
          Design you can feel before you read a spec.
        </h2>

        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          {/* Sticky product */}
          <div className="mx-auto w-full max-w-[18rem] md:sticky md:top-24 md:h-fit md:max-w-sm">
            <div className="relative overflow-hidden rounded-2xl border border-hairline-soft bg-bg">
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
              </div>
            </div>
          </div>

          {/* Accordion */}
          <div className="flex flex-col">
            {FEATURES.map((f, idx) => {
              const open = idx === active
              return (
                <div key={f.key} className="border-b border-hairline-soft">
                  <button
                    id={`cl-acc-${f.key}`}
                    onClick={() => { setActive(idx); }}
                    aria-expanded={open}
                    aria-controls={`cl-panel-${f.key}`}
                    className="flex min-h-14 w-full items-center gap-4 py-4 text-left"
                  >
                    <span className={`flex-1 font-display text-[clamp(1.3rem,2.4vw,1.9rem)] font-medium transition-colors ${open ? 'text-ink' : 'text-muted hover:text-ink'}`}>
                      {f.label}
                    </span>
                    <span aria-hidden className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors ${open ? 'border-accent/60 bg-accent/15 text-accent' : 'border-hairline text-muted'}`}>
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
                        <p className="pb-5 pr-12 font-sans text-[1.05rem] leading-relaxed text-muted">{f.body}</p>
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
