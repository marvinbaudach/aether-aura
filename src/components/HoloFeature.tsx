import { useEffect, useRef, useState, type JSX } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useMediaQuery } from '../lib/useMediaQuery'
import Reveal from './Reveal'

const SRC_DESKTOP = 'assets/aura_holo_film.mp4'
const SRC_MOBILE = 'assets/aura_holo_film_720.mp4'

// Holographic display showcase. The generated clip is lazy-mounted only when
// the section approaches the viewport (saves the download for visitors who
// never scroll this far), then autoplays muted and loops. A gentle parallax
// lifts the copy as it passes.
const HoloFeature = (): JSX.Element => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [load, setLoad] = useState(false)

  const reduced = useReducedMotion()
  const desktop = useMediaQuery('(min-width: 768px)')
  // `media` on a <video><source> is ignored by browsers; pick the file in JS.
  const videoSrc = desktop ? SRC_DESKTOP : SRC_MOBILE

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) =>
        { entries.forEach((e) => {
          if (e.isIntersecting) {
            setLoad(true)
            io.disconnect()
          }
        }); },
      { rootMargin: '500px 0px' },
    )
    io.observe(el)
    return () => { io.disconnect(); }
  }, [])

  useEffect(() => {
    const v = videoRef.current
    const section = sectionRef.current
    if (!v || !section || !load) return

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
  }, [load])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.7, 0.3])

  return (
    <section id="hologram" ref={sectionRef} className="relative overflow-hidden bg-bg px-[max(1.25rem,6vw)] py-[clamp(5rem,14vh,12rem)]">
      {/* ambient glow */}
      <m.div
        aria-hidden
        style={{ opacity: glow }}
        className="pointer-events-none absolute left-1/2 top-1/4 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.15_205/0.25),transparent_70%)] blur-3xl"
      />

      <div className="relative mx-auto grid max-w-shell items-center gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <m.div style={{ y }}>
          <Reveal>
            <p className="font-sans text-[0.74rem] uppercase tracking-[0.34em] text-accent">The frontier</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.02]">
              <span
                className="text-gradient-accent"
                style={reduced ? undefined : { backgroundSize: '200% auto', animation: 'holo-pan 6s linear infinite' }}
              >
                A display
              </span>
              <br />
              that lifts off the glass.
            </h2>
            <p className="mt-6 max-w-[44ch] font-sans text-[1.08rem] text-muted">
              Above the sapphire face, a volumetric layer projects your vitals,
              alerts and faces into the air — readable at a glance, without ever
              raising your wrist. This is where elegance meets the future.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Volumetric UI', 'Depth-true', 'Glance-readable'].map((t) => (
                <span key={t} className="rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 font-sans text-[0.84rem] text-ink">{t}</span>
              ))}
            </div>
          </Reveal>
        </m.div>

        {/* Center the frame in the grid track and cap its width so the derived
            3:4 height can never exceed the viewport — that's what was clipping
            the hologram + watch on short/narrow windows. Source and box are both
            exactly 3:4, so object-cover shows the whole image with no crop. */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-[min(100%,calc(82vh*3/4))] overflow-hidden rounded-[28px] border border-hairline-soft bg-black">
            <div className="relative aspect-[3/4]">
              {load ? (
                <video
                  key={videoSrc}
                  ref={videoRef}
                  src={videoSrc}
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
                  <img src="assets/aura_holo_film_poster.jpg" alt="The Aura projecting a holographic display" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
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
