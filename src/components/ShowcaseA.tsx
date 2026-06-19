import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ease } from '../anim'

// Large alternating product showcase. The exploded render parallaxes gently as
// the section passes, with the feature copy revealing alongside.
export default function ShowcaseA() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <section className="px-[6vw] py-[clamp(4rem,10vh,10rem)]">
      <div ref={ref} className="relative mx-auto grid max-w-[1300px] items-center gap-[clamp(2rem,6vw,6rem)] md:grid-cols-2">
        <figure className="relative overflow-hidden rounded-[3px]">
          <motion.img
            src="assets/img_exploded.jpg"
            alt="The Aura separated into its titanium chassis, sensor array and optics"
            loading="lazy"
            decoding="async"
            style={{ y }}
            className="block aspect-[4/5] w-full scale-110 object-cover"
          />
          <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[oklch(0.12_0.012_240/0.85)] to-transparent p-6 font-sans text-[clamp(0.95rem,1.6vw,1.2rem)] font-medium">
            Sealed, not <span className="text-accent">assembled</span>
          </figcaption>
        </figure>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-18%' }}
          transition={{ duration: 0.9, ease }}
        >
          <h2 className="font-display text-[clamp(2rem,4.4vw,3.6rem)] font-medium leading-[1.04]">
            Cut from one block
          </h2>
          <p className="mt-6 max-w-[44ch] font-sans text-[1.08rem] text-muted">
            The Aura shell is machined from a single billet of Grade 5 titanium across
            fourteen hours. There are no seams, no glue, and no removable back.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
