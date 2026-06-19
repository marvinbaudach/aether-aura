import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ease } from '../anim'

// Second showcase, mirrored layout: the wrist silhouette holds the right side
// while the second feature block reveals on the left.
export default function ShowcaseB() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <section className="px-[6vw] py-[clamp(4rem,10vh,10rem)]">
      <div ref={ref} className="relative mx-auto grid max-w-[1300px] items-center gap-[clamp(2rem,6vw,6rem)] md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-18%' }}
          transition={{ duration: 0.9, ease }}
          className="md:order-1"
        >
          <h2 className="font-display text-[clamp(2rem,4.4vw,3.6rem)] font-medium leading-[1.04]">
            It reads light, not wires
          </h2>
          <p className="mt-6 max-w-[44ch] font-sans text-[1.08rem] text-muted">
            The central emitter pulses a single cyan beam to track your heartbeat through
            the skin. Nothing on the back of the case ever touches your wrist.
          </p>
        </motion.div>

        <figure className="relative overflow-hidden rounded-[3px] md:order-2">
          <motion.img
            src="assets/img_wrist.jpg"
            alt="The Aura standing against a dark concrete surface"
            loading="lazy"
            decoding="async"
            style={{ y }}
            className="block aspect-[4/5] w-full scale-110 object-cover"
          />
          <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[oklch(0.12_0.012_240/0.85)] to-transparent p-6 font-sans text-[clamp(0.95rem,1.6vw,1.2rem)] font-medium">
            <span className="text-accent">Titanium</span>, edge to edge
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
