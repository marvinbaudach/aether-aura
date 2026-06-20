// Shared motion tokens.
import type { Variants } from 'framer-motion'

// Apple-style soft ease-out cubic bezier, typed as a tuple for strict TS.
export const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

// Block fade-up reveal used across sections.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}

export const viewportOnce = { once: true, margin: '-12%' } as const
