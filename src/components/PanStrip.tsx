import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import GlassTile from './GlassTile'

// Horizontal pan-lock on md+ screens: vertical scroll through the tall section
// pans a row of panels sideways. On mobile the same three panels stack vertically
// instead — the sticky scroll-pan is unusable on touch (the last panel is
// unreachable) and the long 260vh spacer wastes the small viewport.
export default function PanStrip() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // The track holds three panels plus generous side padding. The end offset is
  // derived from the track width so the final panel fully reaches the left
  // edge on every desktop viewport rather than being clipped short.
  const x = useTransform(scrollYProgress, [0, 1], ['2vw', '-62vw'])

  const profile = (
    <figure className="relative h-[64vh] w-full shrink-0 overflow-hidden rounded-[3px] md:w-[52vw]">
      <img
        alt="Side profile of the flush titanium chassis and the cyan emitter"
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        src="assets/img_profile_900.jpg"
        srcSet="assets/img_profile_600.webp 600w, assets/img_profile_900.webp 900w, assets/img_profile.jpg 1536w"
        sizes="(max-width: 767px) 88vw, 52vw"
      />
      <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[oklch(0.12_0.012_240/0.85)] to-transparent p-6 font-sans text-[1.05rem] font-medium">
        Flush to four <span className="text-accent">microns</span>
      </figcaption>
    </figure>
  )

  const face = (
    <GlassTile className="h-[64vh] w-full shrink-0 md:w-[38vw]">
      <div className="flex h-full flex-col justify-between p-[clamp(1.6rem,3vw,3rem)]">
        <span className="font-sans text-[0.74rem] uppercase tracking-[0.3em] text-muted">The face</span>
        <p className="font-display text-[clamp(1.6rem,2.8vw,2.6rem)] font-medium leading-[1.08]">
          A sapphire lens sits level with the titanium, so nothing on the surface
          casts a shadow on the beam.
        </p>
        <span className="font-sans text-[0.9rem] text-muted">Sapphire, 0.8 mm</span>
      </div>
    </GlassTile>
  )

  const pulse = (
    <GlassTile className="h-[64vh] w-full shrink-0 md:w-[38vw]">
      <div className="flex h-full flex-col justify-between p-[clamp(1.6rem,3vw,3rem)]">
        <span className="font-sans text-[0.74rem] uppercase tracking-[0.3em] text-muted">The pulse</span>
        <p className="font-display text-[clamp(1.6rem,2.8vw,2.6rem)] font-medium leading-[1.08]">
          The emitter samples your heartbeat ninety times a second and sleeps
          between readings to save the cell.
        </p>
        <span className="font-sans text-[0.9rem] text-muted">90 Hz optical</span>
      </div>
    </GlassTile>
  )

  if (isMobile) {
    return (
      <section className="px-[6vw] py-[clamp(4rem,10vh,10rem)]">
        <div className="mx-auto flex max-w-[460px] flex-col gap-[1.5rem]">
          {profile}
          {face}
          {pulse}
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex items-stretch gap-[2vw] pl-[6vw] pr-[40vw]">
          {profile}
          {face}
          {pulse}
        </motion.div>
      </div>
    </section>
  )
}
