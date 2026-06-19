import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import GlassTile from './GlassTile'

// Horizontal pan-lock: vertical scroll through the tall section pans a row of
// panels sideways. One panel anchors the side-profile render, the others carry
// quiet structural data. No card grid, no SaaS clone.
export default function PanStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['2vw', '-58vw'])

  return (
    <section ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex items-stretch gap-[2vw] pl-[6vw] pr-[40vw]">
          <figure className="relative h-[64vh] w-[78vw] shrink-0 overflow-hidden rounded-[3px] md:w-[52vw]">
            <img
              src="assets/img_profile.jpg"
              alt="Side profile of the flush titanium chassis and the cyan emitter"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[oklch(0.12_0.012_240/0.85)] to-transparent p-6 font-sans text-[1.05rem] font-medium">
              Flush to four <span className="text-accent">microns</span>
            </figcaption>
          </figure>

          <GlassTile className="h-[64vh] w-[78vw] shrink-0 md:w-[38vw]">
            <div className="flex h-[64vh] flex-col justify-between p-[clamp(1.6rem,3vw,3rem)]">
              <span className="font-sans text-[0.74rem] uppercase tracking-[0.3em] text-muted">The face</span>
              <p className="font-display text-[clamp(1.6rem,2.8vw,2.6rem)] font-medium leading-[1.08]">
                A sapphire lens sits level with the titanium, so nothing on the surface
                casts a shadow on the beam.
              </p>
              <span className="font-sans text-[0.9rem] text-muted">Sapphire, 0.8 mm</span>
            </div>
          </GlassTile>

          <GlassTile className="h-[64vh] w-[78vw] shrink-0 md:w-[38vw]">
            <div className="flex h-[64vh] flex-col justify-between p-[clamp(1.6rem,3vw,3rem)]">
              <span className="font-sans text-[0.74rem] uppercase tracking-[0.3em] text-muted">The pulse</span>
              <p className="font-display text-[clamp(1.6rem,2.8vw,2.6rem)] font-medium leading-[1.08]">
                The emitter samples your heartbeat ninety times a second and sleeps
                between readings to save the cell.
              </p>
              <span className="font-sans text-[0.9rem] text-muted">90 Hz optical</span>
            </div>
          </GlassTile>
        </motion.div>
      </div>
    </section>
  )
}
