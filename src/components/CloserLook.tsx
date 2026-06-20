import { useState, type JSX } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ease } from '../anim'
import Reveal from './Reveal'

interface Feature {
  key: string
  label: string
  body: string
  view: 'hero' | 'profile'
}

const FEATURES: Feature[] = [
  { key: 'shell', label: 'Machined shell', body: 'A single billet of Grade-5 titanium, milled for fourteen hours into a seamless monocoque. There is no back panel to remove — the Aura is sealed, not assembled.', view: 'hero' },
  { key: 'profile', label: 'Slim profile', body: 'At its thinnest the chassis tapers to a knife-clean edge, so it disappears under a cuff yet still houses the full optical sensor stack.', view: 'profile' },
  { key: 'crown', label: 'Digital crown', body: 'A precision-knurled titanium crown clicks through menus and doubles as the trigger for an on-demand vitals reading.', view: 'profile' },
  { key: 'sapphire', label: 'Level sapphire', body: 'The sapphire lens is set flush to four microns of the case, so light leaves the display without a single shadow line.', view: 'hero' },
]

// Sticky product viewer: a pinned render on one side, an accordion of design
// notes on the other. Selecting a note crossfades the product to the matching
// camera angle — the same physical watch, shown from two consistent views.
const CloserLook = (): JSX.Element => {
  const [active, setActive] = useState(0)
  const view = FEATURES[active]?.view ?? 'hero'

  const img = view === 'profile'
    ? { webp: 'assets/aura_profile_1200.webp', jpg: 'assets/aura_profile_1000.jpg', alt: 'Side profile of the titanium Aura' }
    : { webp: 'assets/aura_hero_1200.webp', jpg: 'assets/aura_hero_1000.jpg', alt: 'Three-quarter view of the titanium Aura' }

  return (
    <section id="design" className="relative bg-bg px-[max(1.25rem,6vw)] py-[clamp(4rem,12vh,10rem)]">
      <div className="mx-auto max-w-shell">
        <Reveal className="mb-12 max-w-[22ch]">
          <p className="font-sans text-[0.74rem] uppercase tracking-[0.34em] text-accent">Take a closer look</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.6vw,3.6rem)] font-medium leading-[1.04] text-gradient">
            Design you can feel before you read a spec.
          </h2>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {/* Sticky product */}
          <div className="md:sticky md:top-24 md:h-fit">
            <div className="relative overflow-hidden rounded-[28px] border border-hairline-soft bg-[radial-gradient(120%_120%_at_50%_0%,oklch(0.22_0.016_242)_0%,oklch(0.145_0.014_245)_70%)]">
              <div className="relative aspect-[4/5]">
                <AnimatePresence mode="wait">
                  <m.picture
                    key={view}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.55, ease }}
                    className="absolute inset-0"
                  >
                    <source type="image/webp" srcSet={img.webp} />
                    <img src={img.jpg} alt={img.alt} className="h-full w-full object-contain p-6" loading="lazy" decoding="async" />
                  </m.picture>
                </AnimatePresence>
                <div className="pointer-events-none absolute left-1/2 top-[12%] h-[1px] w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
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
                    onClick={() => { setActive(idx); }}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 py-6 text-left"
                  >
                    <span className={`font-display text-[clamp(1.3rem,2.4vw,1.9rem)] font-medium transition-colors ${open ? 'text-ink' : 'text-faint hover:text-muted'}`}>
                      {f.label}
                    </span>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors ${open ? 'border-accent/60 bg-accent/15 text-accent' : 'border-hairline text-muted'}`}>
                      <m.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3, ease }} className="text-lg leading-none">+</m.span>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease }}
                        className="overflow-hidden"
                      >
                        <p className="pb-7 pr-8 font-sans text-[1.05rem] leading-relaxed text-muted">{f.body}</p>
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
