import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ease } from '../anim'

const SRC = 'assets/video_assembly.mp4'

type HeroProps = { onReady?: () => void }

// Scroll-scrub hero: the tall section drives the assembly video timeline, so the
// watch builds itself only while the user scrolls. Camera is locked to the
// scroll axis with no drift, exactly per the video laws.
export default function Hero({ onReady }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return

    // Initialise from readyState in case loadedmetadata already fired before
    // this effect attached its listener (a common race that freezes the scrub).
    let ready = video.readyState >= 1
    let raf = 0
    const onMeta = () => { ready = true }
    video.addEventListener('loadedmetadata', onMeta)
    const signalReady = () => onReady?.()
    video.addEventListener('canplaythrough', signalReady, { once: true })
    video.addEventListener('loadeddata', signalReady, { once: true })

    const tick = () => {
      if (ready && video.duration && !video.seeking) {
        const rect = section.getBoundingClientRect()
        const scrollable = section.offsetHeight - window.innerHeight
        const p = Math.min(1, Math.max(0, -rect.top / scrollable))
        const t = p * video.duration
        if (Math.abs(video.currentTime - t) > 1 / 50) video.currentTime = t
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); video.removeEventListener('loadedmetadata', onMeta) }
  }, [onReady])

  return (
    <section id="top" ref={sectionRef} className="relative h-[340vh]">
      <div className="sticky top-0 grid h-screen w-full place-items-center overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          muted playsInline preload="auto"
        >
          <source src={SRC} type="video/mp4" />
        </video>

        {/* soft dark halo so the wordmark never washes out */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              'radial-gradient(60% 65% at 50% 52%, oklch(0.12 0.012 240 / 0.72) 0%, oklch(0.12 0.012 240 / 0.3) 46%, oklch(0.12 0.012 240 / 0) 74%), linear-gradient(to bottom, oklch(0.14 0.012 240 / 0.55), oklch(0.14 0.012 240 / 0.08) 30%, oklch(0.14 0.012 240 / 0.1) 70%, oklch(0.14 0.012 240 / 0.72))',
          }}
        />

        {/* Hero content drifts gently before the first scroll. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: [6, -6, 6] }}
          transition={{
            opacity: { duration: 1.1, ease },
            y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="relative z-20 px-[6vw] text-center"
        >
          <p className="mb-5 font-sans text-[0.78rem] uppercase tracking-[0.42em] text-accent">
            The Aura. Now forming.
          </p>
          <h1 className="font-display text-[clamp(3.4rem,15vw,12rem)] font-medium leading-[0.9] tracking-[-0.02em]">
            AETHER
          </h1>
          <p className="mx-auto mt-7 max-w-[44ch] font-sans text-[1.05rem] text-muted">
            A circular lens emitter reads your pulse through a single beam of light.
            No wires, no contacts, no compromise.
          </p>
        </motion.div>

        <p className="absolute bottom-[4vh] left-1/2 z-20 -translate-x-1/2 font-sans text-[0.7rem] uppercase tracking-[0.3em] text-muted">
          Scroll to build it
        </p>
      </div>
    </section>
  )
}
