import { motion } from 'framer-motion'
import { ease } from '../anim'

// Branded loading veil that holds until the hero video plays, so the poster
// never pops to video.
export default function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease }}
      className="fixed inset-0 z-[60] grid place-items-center bg-bg"
    >
      <div className="flex flex-col items-center">
        <motion.span
          className="block h-2 w-2 rounded-full bg-accent"
          animate={{ opacity: [0.3, 1, 0.3], boxShadow: ['0 0 0px var(--accent)', '0 0 22px var(--accent)', '0 0 0px var(--accent)'] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        />
        <p className="mt-7 font-display text-[clamp(1.4rem,4vw,2rem)] font-medium tracking-[0.42em] text-ink">
          AETHER
        </p>
        <p className="mt-3 font-sans text-[0.7rem] uppercase tracking-[0.4em] text-muted">Aura</p>
      </div>
    </motion.div>
  )
}
