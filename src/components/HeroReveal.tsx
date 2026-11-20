import { useEffect, useRef, type JSX } from 'react'
import { m, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { ease } from '../anim'
import { useReducedMotion } from '../lib/useReducedMotion'
import FeatureTile from './FeatureTile'

const TILES = [
  { k: 'Titanium', t: 'One block of aerospace-grade brushed titanium.' },
  { k: 'Health', t: 'Continuous vitals, read by a single beam of light.' },
  { k: 'Calls', t: 'Talk on your wrist without a phone.' },
  { k: 'Hologram', t: 'A display that lifts off the glass.' },
]

const POSTER = 'assets/hero360/hero_wide16x9_poster.webp'
const FILM = 'assets/aura_hero360_wide16x9.mp4'

const Wordmark = (): JSX.Element => (
  <div className="filter-[drop-shadow(0_2px_22px_oklch(0.13_0.013_245/0.85))]">
    <h1 className="font-display text-ink">
      <span className="block text-[clamp(3.2rem,15vw,12rem)] font-medium leading-[0.9] tracking-[-0.02em]">AETHER</span>
      <span className="mx-auto mt-7 block max-w-[28ch] font-sans text-[clamp(1rem,1.4vw,1.15rem)] font-normal">
        A titanium smartwatch with a holographic display.
      </span>
    </h1>
  </div>
)

const TileGrid = (): JSX.Element => (
  <div className="w-full max-w-shell">
    <h2 className="mx-auto mb-7 max-w-[20ch] text-center font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.04]">
      Four features in one titanium case.
    </h2>
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {TILES.map((tile) => (
        <FeatureTile key={tile.k} label={tile.k}>
          {tile.t}
        </FeatureTile>
      ))}
    </div>
  </div>
)

// Reduced motion: no film, no scroll-linked transforms. The poster frame, the
// wordmark and the tiles all sit in plain document flow.
const HeroStatic = (): JSX.Element => (
  <section id="top">
    <div className="relative grid h-svh w-full place-items-end overflow-hidden bg-[oklch(0.07_0.014_245)] px-[6vw] pb-[16vh] text-center">
      <img src={POSTER} alt="The AETHER Aura titanium smartwatch" className="absolute inset-0 h-full w-full object-cover" />
      <div aria-hidden className="absolute inset-0 bg-[oklch(0.13_0.013_245/0.55)]" />
      <div className="relative w-full">
        <Wordmark />
      </div>
    </div>
    <div className="grid place-items-center bg-bg px-[max(1.25rem,6vw)] py-[clamp(4rem,9vh,6.5rem)]">
      <TileGrid />
    </div>
  </section>
)

// Signature hero: a full-bleed product film holds while the wordmark sits over
// it. As the user scrolls, the film blurs and scales back, the wordmark
// recedes, and a cluster of feature tiles rises into focus, all on a single
// sticky scroll track.
const HeroMotion = (): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // The opaque preloader covers this clip while it would normally autoplay, and
  // Chrome skips/re-pauses muted autoplay for a video it treats as not visible.
  // Nothing resumes it once the loader lifts, so the hero would sit on its
  // poster frame. Nudge play() ourselves and keep re-checking until the clip is
  // actually rolling (long enough to outlast the loader), then stop.
  useEffect(() => {
    const v = videoRef.current
    if (v === null) return
    let timer = 0
    let tries = 0
    const ensurePlaying = () => {
      void v.play().catch(() => undefined)
      // ~7s of retries comfortably outlasts the preloader hold (2.2s) plus its
      // exit animation, after which the clip is fully visible and play()
      // sticks. Stops as soon as the video is actually rolling.
      if (tries < 20) {
        tries += 1
        timer = window.setTimeout(() => {
          if (v.paused) ensurePlaying()
        }, 350)
      }
    }
    ensurePlaying()
    return () => { window.clearTimeout(timer); }
  }, [])

  // Each scroll value carries an explicit terminal keyframe at progress 1 so it
  // holds its end state across the rest of the track; otherwise framer-motion
  // extrapolates past the last point. The reveal is front-loaded: every
  // keyframe completes within the first ~third of the track.
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
    <section id="top" ref={ref} className="relative h-[185vh]">
      {/* Near-black base matched to the video's own dark studio edges, so the
          clip blends into a full-width field with no lighter side bars. */}
      {/* Touch browsers collapse their toolbar while scrolling, so a 100vh stage
          overshoots the visible viewport and clips the tiles at the bottom.
          Size it to the small viewport there; mouse-driven desktop keeps h-screen. */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[oklch(0.07_0.014_245)] pointer-coarse:h-svh">
        {/* Product film: the watch turns through a slow, seamless 360° loop. It
            autoplays on its own and only blurs / scales back as the visitor
            scrolls into the tiles. */}
        <m.div style={{ scale, filter }} className="absolute inset-0 z-0 will-change-transform">
          <video
            ref={videoRef}
            src={FILM}
            className="h-full w-full object-cover"
            poster={POSTER}
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
        <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-[42vh] bg-linear-to-b from-transparent to-bg" />
        {/* Central scrim: keeps the wordmark legible over the bright watch face. */}
        <div
          aria-hidden
          className="absolute inset-0 z-10 bg-[radial-gradient(50%_42%_at_50%_46%,oklch(0.13_0.013_245/0.7)_0%,oklch(0.13_0.013_245/0.4)_45%,transparent_72%)]"
        />

        <m.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute inset-0 z-20 grid place-items-end px-[6vw] pb-[16vh] text-center"
        >
          <m.div
            className="w-full"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease }}
          >
            <Wordmark />
          </m.div>
        </m.div>

        <m.div
          style={{ opacity: tilesOpacity, y: tilesY }}
          className="absolute inset-0 z-20 grid place-items-center px-[6vw]"
        >
          <TileGrid />
        </m.div>

        <m.div
          aria-hidden
          style={{ opacity: cueOpacity }}
          className="absolute bottom-[3.5vh] left-1/2 z-20 -translate-x-1/2 text-center"
        >
          <span className="font-sans text-[0.75rem] text-muted">Scroll</span>
          <div className="mx-auto mt-2 h-9 w-px bg-linear-to-b from-accent to-transparent" />
        </m.div>
      </div>
    </section>
  )
}

const HeroReveal = (): JSX.Element => {
  const reduced = useReducedMotion()
  return reduced ? <HeroStatic /> : <HeroMotion />
}

export default HeroReveal
