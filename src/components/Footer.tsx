import { motion } from 'framer-motion'
import { ease } from '../anim'

export default function Footer() {
  return (
    <footer className="border-t border-hairline px-[6vw] py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left"
      >
        <p className="font-display text-[clamp(1.8rem,4.5vw,3rem)] font-semibold leading-none tracking-[0.16em]">
          AETHER
        </p>
        <p className="font-sans text-[0.78rem] uppercase tracking-[0.3em] text-muted">
          Aura &middot; Measured in light
        </p>
      </motion.div>
    </footer>
  )
}
