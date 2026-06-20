import { useRef, type JSX } from 'react'
import { m, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { ease } from '../anim'
import GlassTile from './GlassTile'

const TILES = [
  { k: 'Titanium', t: 'One block of aerospace-grade brushed titanium.' },
  { k: 'Health', t: 'Continuous vitals, read by a single beam of light.' },
  { k: 'Calls', t: 'Talk on your wrist — no phone required.' },
  { k: 'Hologram', t: 'A display that lifts off the glass.' },
]

// Signature hero: a full-bleed lifestyle frame holds while the wordmark sits
// over it. As the user scrolls, the image blurs and scales back, the wordmark
// recedes, and a cluster of feature tiles rises into focus. Apple-style
// "background defocus → content reveal" built on a single sticky scroll track.
const HeroReveal = (): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // Each scroll value carries an explicit terminal keyframe at progress 1 so it
  // holds its end state across the rest of the track. Without it, framer-motion
  // extrapolates past the last point — which made the faded-out wordmark ride
  // back up into the tiles.
  const blur = useTransform(scrollYProgress, [0, 0.55, 1], [0, 13, 13])
  const filter = useMotionTemplate`blur(${blur}px)`
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.16])
  const bgDim = useTransform(scrollYProgress, [0, 0.55, 1], [0.35, 0.72, 0.72])

  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [1, 0, 0])
  const titleY = useTransform(scrollYProgress, [0, 0.28, 1], [0, -60, -60])

  const tilesOpacity = useTransform(scrollYProgress, [0, 0.32, 0.48, 1], [0, 0, 1, 1])
  const tilesY = useTransform(scrollYProgress, [0, 0.32, 0.6, 1], [50, 50, 0, 0])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12, 1], [1, 0, 0])

  return (
    <section id="top" ref={ref} className="relative h-[230vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Defocusing lifestyle backdrop */}
        <m.div style={{ scale, filter }} className="absolute inset-0 z-0 will-change-transform">
          <picture>
            <source
              type="image/webp"
              srcSet="assets/aura_lifestyle_1000.webp 1000w, assets/aura_lifestyle_1600.webp 1600w, assets/aura_lifestyle_2400.webp 2400w"
              sizes="100vw"
            />
            <img
              src="assets/aura_lifestyle_1600.jpg"
              alt="A person wearing the AETHER Aura, its cyan display glowing"
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
          </picture>
        </m.div>

        {/* Dimming + vignette so text stays legible at every scroll position */}
        <m.div
          aria-hidden
          style={{ opacity: bgDim }}
          className="absolute inset-0 z-10 bg-[radial-gradient(70%_70%_at_50%_42%,transparent_0%,oklch(0.13_0.013_245/0.55)_70%,oklch(0.13_0.013_245/0.9)_100%)]"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-[42vh] bg-gradient-to-b from-transparent to-bg" />

        {/* Wordmark layer */}
        <m.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute inset-0 z-20 grid place-items-center px-[6vw] text-center"
        >
          <m.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease }}
          >
            {/* Gentle vertical drift (CSS keyframe on its own element so it
                doesn't fight framer's scroll/entrance transforms). */}
            <div className="float-soft">
              <p className="mb-5 font-sans text-[0.78rem] uppercase tracking-[0.42em] text-accent">
                The Aura · in titanium
              </p>
              <h1 className="font-display text-[clamp(3.2rem,15vw,12rem)] font-medium leading-[0.9] tracking-[-0.02em] text-gradient">
                AETHER
              </h1>
              <p className="mx-auto mt-7 max-w-[42ch] font-sans text-[clamp(1rem,1.6vw,1.2rem)] text-muted">
                Where elegance meets the edge of technology. A titanium smartwatch
                that reads your body in light — and answers with a hologram.
              </p>
            </div>
          </m.div>
        </m.div>

        {/* Revealed feature cluster */}
        <m.div
          style={{ opacity: tilesOpacity, y: tilesY }}
          className="absolute inset-0 z-20 grid place-items-center px-[6vw]"
        >
          <div className="w-full max-w-shell">
            <div className="mb-7 text-center">
              <p className="font-sans text-[0.74rem] uppercase tracking-[0.34em] text-accent">More than a watch</p>
              <h2 className="mx-auto mt-3 max-w-[20ch] font-display text-[clamp(1.6rem,3.4vw,2.8rem)] font-medium leading-[1.06]">
                Four ideas, sealed in one shell.
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {TILES.map((tile) => (
                <GlassTile key={tile.k} label={tile.k}>
                  {tile.t}
                </GlassTile>
              ))}
            </div>
          </div>
        </m.div>

        {/* Scroll cue */}
        <m.div
          style={{ opacity: cueOpacity }}
          className="absolute bottom-[3.5vh] left-1/2 z-20 -translate-x-1/2 text-center"
        >
          <span className="font-sans text-[0.68rem] uppercase tracking-[0.3em] text-muted">Scroll</span>
          <div className="mx-auto mt-2 h-9 w-[1px] bg-gradient-to-b from-accent to-transparent" />
        </m.div>
      </div>
    </section>
  )
}

export default HeroReveal
