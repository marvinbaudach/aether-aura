import { useEffect, useRef, type JSX } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '../lib/useMediaQuery'
import { useNearViewport } from '../lib/useNearViewport'

const SRC_DESKTOP = 'assets/aura_holo_film.mp4'
const SRC_MOBILE = 'assets/aura_holo_film_720.mp4'

// Holographic display showcase. The generated clip is lazy-mounted only when
// the section approaches the viewport (saves the download for visitors who
// never scroll this far), then autoplays muted and loops. Reduced-motion
// visitors get the poster frame and no video.
const HoloFeature = (): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null)
  // Defer the (heavy) clip download until the section nears the viewport.
  const [sectionRef, load] = useNearViewport<HTMLDivElement>('500px 0px')

  const reduced = useReducedMotion() ?? false
  const desktop = useMediaQuery('(min-width: 768px)')
  // `media` on a <video><source> is ignored by browsers; pick the file in JS.
  const videoSrc = desktop ? SRC_DESKTOP : SRC_MOBILE

  useEffect(() => {
    const v = videoRef.current
    const section = sectionRef.current
    if (v === null || section === null || !load || reduced) return

    let onScreen = false
    const play = () => { void v.play().catch(() => undefined) }

    // Drive playback off the whole section (not the video box) so it keeps
    // running while anywhere near the viewport instead of pausing the moment
    // the frame is less than a quarter visible — the cause of the "freezes".
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          onScreen = e.isIntersecting
          if (onScreen) play()
          else v.pause()
        })
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(section)

    // Resilience: a light watchdog restarts the loop if the browser ever pauses
    // or stalls it while it should be visible (tab switch, power saving, decode
    // hiccup) — the cause of it "standing still". An interval avoids the
    // play()/pause() race that event-driven resumes hit.
    const watchdog = window.setInterval(() => {
      if (onScreen && !document.hidden && v.paused) play()
    }, 1000)

    return () => {
      io.disconnect()
      window.clearInterval(watchdog)
    }
  }, [load, reduced, sectionRef])

  return (
    <section id="hologram" ref={sectionRef} className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-bg px-[max(1.25rem,6vw)] py-[clamp(4rem,9vh,6.5rem)]">
      <div className="mx-auto grid w-full max-w-shell items-center gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div>
          <h2 className="font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.04]">
            Face to face
            <br />
            off your wrist.
          </h2>
          <p className="mt-6 max-w-[40ch] font-sans text-[1.08rem] text-muted">
            The Aura lifts your caller into the air as a life-size hologram.
          </p>
        </div>

        {/* Center the frame in the grid track and cap its width so the derived
            3:4 height can never exceed the viewport. Source and box are both
            exactly 3:4, so object-cover shows the whole image with no crop. */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-[min(100%,calc(82vh*3/4))] overflow-hidden rounded-2xl border border-hairline-soft bg-black">
            <div className="relative aspect-3/4">
              {load && !reduced ? (
                <video
                  key={videoSrc}
                  ref={videoRef}
                  src={videoSrc}
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover"
                  muted
                  playsInline
                  loop
                  preload="none"
                  poster="assets/aura_holo_film_poster.jpg"
                />
              ) : (
                <picture>
                  <source type="image/webp" srcSet="assets/aura_holo_film_poster.webp" />
                  <img src="assets/aura_holo_film_poster.jpg" alt="The Aura projecting a holographic video call of a person above its face" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
                </picture>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HoloFeature
