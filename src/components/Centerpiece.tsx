import { useEffect, useRef, type JSX } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '../lib/useMediaQuery'

const SRC_DESKTOP = 'assets/aura_centerpiece_film.mp4'
const SRC_MOBILE = 'assets/aura_centerpiece_film_720.mp4'

// Cinematic centerpiece: a single self-contained product film. The camera makes
// a full 360° orbit around the watch, then pushes in on the front display where
// a video call lights up. Because the watch has a display front and back, scroll
// scrubbing made no sense — the clip tells a story on its own timeline, so it
// just plays through (and loops) while pinned on screen. Honours reduced-motion
// by holding the poster frame instead of animating.
const Centerpiece = (): JSX.Element => {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const reduced = useReducedMotion()
  const desktop = useMediaQuery('(min-width: 768px)')

  // The `media` attribute on <source> is ignored outside <picture>, so pick the
  // right file in JS — otherwise every device downloads the full desktop clip.
  const videoSrc = desktop ? SRC_DESKTOP : SRC_MOBILE

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video || reduced) return

    // Only play while the section is on screen: rewind on entry so the orbit
    // always starts from the top, pause when it scrolls away to save decode.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            void video.play().catch(() => undefined)
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.35 },
    )
    io.observe(section)
    return () => { io.disconnect() }
  }, [reduced, videoSrc])

  return (
    <section ref={sectionRef} className="relative h-screen bg-bg">
      <div className="grid h-full w-full place-items-center overflow-hidden">
        <video
          key={videoSrc}
          ref={videoRef}
          src={videoSrc}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="auto"
          poster="assets/aura_centerpiece_film_poster.jpg"
          autoPlay={!reduced}
        />

        <div
          aria-hidden
          className="absolute inset-0 z-10"
          style={{ background: 'radial-gradient(70% 80% at 50% 50%, transparent 35%, oklch(0.13 0.013 245 / 0.45) 80%, oklch(0.13 0.013 245 / 0.9) 100%)' }}
        />
      </div>
    </section>
  )
}

export default Centerpiece
