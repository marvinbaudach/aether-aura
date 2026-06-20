import type { JSX } from 'react'
import { m } from 'framer-motion'
import { ease } from '../anim'

const Footer = (): JSX.Element => {
  return (
    <footer className="relative overflow-hidden border-t border-hairline-soft px-[max(1.25rem,6vw)] py-[clamp(5rem,14vh,11rem)]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[1px] w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/50 to-transparent"
      />
      <m.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease }}
        className="mx-auto max-w-shell text-center"
      >
        <p className="font-sans text-[0.74rem] uppercase tracking-[0.34em] text-accent">A concept prototype</p>
        <p className="mx-auto mt-6 max-w-[20ch] font-display text-[clamp(2.4rem,7vw,5rem)] font-medium leading-[0.98] text-gradient">
          Measured in light.
        </p>
        <div className="mx-auto mt-10 flex items-center justify-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="h-px w-12 bg-hairline-soft" />
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        </div>
        <p className="mt-10 font-sans text-[0.8rem] text-faint">
          © 2026 AETHER · Aura. All renders and footage are AI-generated.
        </p>
      </m.div>
    </footer>
  )
}

export default Footer
