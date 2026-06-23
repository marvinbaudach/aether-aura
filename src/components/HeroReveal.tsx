import { useRef, type JSX } from 'react'
import { m, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { ease } from '../anim'
import GlassTile from './GlassTile'

// Line-art glyphs inherit the accent colour via currentColor.
const IconTitanium = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
    <path d="M12 3 21 7.5v9L12 21 3 16.5v-9L12 3Z" />
    <path d="M3 7.5 12 12l9-4.5M12 12v9" />
  </svg>
)
const IconHealth = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h4l2-5 3 10 2-6 1.5 3H21" />
  </svg>
)
const IconCalls = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 4.5 6a2 2 0 0 1 2-2Z" />
  </svg>
)
const IconHologram = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <ellipse cx="12" cy="18.5" rx="7" ry="2" />
    <path d="M8.6 14.8c.9-1.8 5.9-1.8 6.8 0M9.6 11.3c.8-1.3 4-1.3 4.8 0M10.7 7.8c.5-.9 2.1-.9 2.6 0" />
  </svg>
)

const TILES = [
  { k: 'Titanium', t: 'One block of aerospace-grade brushed titanium.', icon: IconTitanium },
  { k: 'Health', t: 'Continuous vitals, read by a single beam of light.', icon: IconHealth },
  { k: 'Calls', t: 'Talk on your wrist — no phone required.', icon: IconCalls },
  { k: 'Hologram', t: 'A display that lifts off the glass.', icon: IconHologram },
]

// Signature hero: a full-bleed product film holds while the wordmark sits over
// it. As the user scrolls, the film blurs and scales back, the wordmark
// recedes, and a cluster of feature tiles rises into focus. Apple-style
// "background defocus → content reveal" built on a single sticky scroll track.
const HeroReveal = (): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // Each scroll value carries an explicit terminal keyframe at progress 1 so it
  // holds its end state across the rest of the track. Without it, framer-motion
  // extrapolates past the last point — which made the faded-out wordmark ride
  // back up into the tiles.
  // The reveal is heavily front-loaded: every keyframe completes within the
  // first ~third of the track so a small flick of the wheel already snaps the
  // hero into its end state (tiles revealed, wordmark gone). The rest of the
  // track is a deliberate hold — the visitor never has to wonder whether the
  // animation is still running, they just see "done" almost immediately.
  const blur = useTransform(scrollYProgress, [0, 0.42, 1], [0, 13, 13])
  const filter = useMotionTemplate`blur(${blur}px)`
  const scale = useTransform(scrollYProgress, [0, 0.42, 1], [1.04, 1.15, 1.15])
  const bgDim = useTransform(scrollYProgress, [0, 0.42, 1], [0.35, 0.72, 0.72])

  const titleOpacity = useTransform(scrollYProgress, [0, 0.18, 1], [1, 0, 0])
  const titleY = useTransform(scrollYProgress, [0, 0.24, 1], [0, -60, -60])

  const tilesOpacity = useTransform(scrollYProgress, [0, 0.22, 0.42, 1], [0, 0, 1, 1])
  const tilesY = useTransform(scrollYProgress, [0, 0.22, 0.42, 1], [50, 50, 0, 0])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.1, 1], [1, 0, 0])

  return (
    <section id="top" ref={ref} className="relative h-[185vh] snap-start">
      {/* Near-black base matched to the video's own dark studio edges, so the
          centered watch clip blends seamlessly into a full-width field with no
          lighter side bars. A soft cyan glow spans the whole width for the
          living brand atmosphere. */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[oklch(0.07_0.014_245)]">
        <div
          aria-hidden
          className="absolute inset-0 z-0 bg-[radial-gradient(85%_60%_at_50%_38%,oklch(0.32_0.08_212/0.55),transparent_75%)]"
        />
        {/* Product film: the watch turns through a slow, seamless 360° loop. It
            autoplays on its own (no scroll needed) and only blurs / scales back
            as the visitor scrolls into the tiles. The clip is already shot on
            the brand slate-and-cyan palette, so no colour wash is needed. */}
        <m.div style={{ scale, filter }} className="absolute inset-0 z-0 will-change-transform">
          <video
            src="assets/aura_hero360_wide16x9.mp4"
            className="h-full w-full object-cover"
            poster="assets/hero360/hero_wide16x9_poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="The AETHER Aura titanium smartwatch turning slowly through a full rotation"
          />
        </m.div>

        {/* Dimming + vignette so text stays legible at every scroll position */}
        <m.div
          aria-hidden
          style={{ opacity: bgDim }}
          className="absolute inset-0 z-10 bg-[radial-gradient(70%_70%_at_50%_42%,transparent_0%,oklch(0.13_0.013_245/0.55)_70%,oklch(0.13_0.013_245/0.9)_100%)]"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-[42vh] bg-gradient-to-b from-transparent to-bg" />
        {/* Central scrim: the vignette darkens the edges but leaves the bright
            watch in the middle — exactly behind the wordmark — so add a soft
            dark pool there to keep the title and copy legible. */}
        <div
          aria-hidden
          className="absolute inset-0 z-10 bg-[radial-gradient(50%_42%_at_50%_46%,oklch(0.13_0.013_245/0.6)_0%,oklch(0.13_0.013_245/0.32)_45%,transparent_72%)]"
        />

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
            {/* No vertical drift: a floating wordmark fights the "machined,
                precise titanium" message — the brushed-metal sheen carries the
                life instead. Just depth + a faint accent halo here. */}
            <div className="[filter:drop-shadow(0_2px_22px_oklch(0.13_0.013_245/0.85))_drop-shadow(0_0_40px_oklch(0.7_0.13_205/0.25))]">
              <h1 className="text-titanium font-display text-[clamp(3.2rem,15vw,12rem)] font-medium leading-[0.9] tracking-[-0.02em]">
                AETHER
              </h1>
              <p className="mx-auto mt-7 font-sans text-[clamp(0.95rem,1.4vw,1.15rem)] tracking-[0.2em] text-ink/85">
                Titanium · Light · Hologram
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
              {TILES.map((tile, i) => (
                <GlassTile key={tile.k} label={tile.k} icon={tile.icon} index={`0${String(i + 1)}`}>
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
