import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import RevealText from './RevealText'

// Second showcase, mirrored layout: the wrist silhouette holds the right side
// while the second feature block reveals on the left.
export default function ShowcaseB() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <section className="px-[6vw] py-[clamp(4rem,10vh,10rem)]">
      <div ref={ref} className="relative mx-auto grid max-w-[1300px] items-center gap-[clamp(2rem,6vw,6rem)] md:grid-cols-2">
        <div className="md:order-1">
          <RevealText
            as="h2"
            text="It reads light, not wires"
            className="font-display text-[clamp(2rem,4.4vw,3.6rem)] font-medium leading-[1.04]"
          />
          <RevealText
            as="p"
            text="The central emitter pulses a single cyan beam to track your heartbeat through the skin. Nothing on the back of the case ever touches your wrist."
            delay={0.1}
            stagger={0.014}
            duration={0.5}
            className="mt-6 max-w-[44ch] font-sans text-[1.08rem] text-muted"
          />
        </div>

        <figure className="relative overflow-hidden rounded-[3px] md:order-2">
          <motion.img
            alt="The Aura standing against a dark concrete surface"
            loading="lazy"
            decoding="async"
            style={{ y, willChange: 'transform' }}
            className="block aspect-[4/5] w-full object-cover"
            src="assets/img_wrist_900.jpg"
            srcSet="assets/img_wrist_600.webp 600w, assets/img_wrist_900.webp 900w, assets/img_wrist.jpg 1536w"
            sizes="(max-width: 767px) 88vw, (max-width: 1300px) 45vw, 560px"
          />
          <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[oklch(0.12_0.012_240/0.85)] to-transparent p-6 font-sans text-[clamp(0.95rem,1.6vw,1.2rem)] font-medium">
            <span className="text-accent">Titanium</span>, edge to edge
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
