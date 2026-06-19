import { motion } from 'framer-motion'
import { ease } from '../anim'

export default function ThesisCallout() {
  return (
    <section className="mx-auto max-w-[min(92vw,64rem)] px-[6vw] py-[clamp(8rem,20vh,18rem)] text-center">
      <motion.h2
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.9, ease }}
        className="font-display text-[clamp(2.2rem,6.5vw,5.4rem)] font-medium leading-[1.04] tracking-[-0.01em]"
      >
        One shell of titanium. One beam of <span className="text-accent">light</span>.
      </motion.h2>
    </section>
  )
}
