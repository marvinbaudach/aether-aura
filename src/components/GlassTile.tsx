import { useRef } from 'react'
import type { JSX, PointerEvent, ReactNode } from 'react'
import { m, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

interface GlassTileProps {
  label: string
  children: ReactNode
  icon?: ReactNode
  index?: string
}

// Interactive frosted tile: tracks the cursor for a soft spring-damped 3D tilt
// and a specular glare, lifts on hover and presses on tap. All motion is
// suppressed for reduced-motion users, who still get the static glass card.
const GlassTile = ({ label, children, icon, index }: GlassTileProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion() ?? false

  // Tilt: normalised pointer position (0..1), spring-smoothed, recentred on leave.
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 150, damping: 18 })
  const sy = useSpring(py, { stiffness: 150, damping: 18 })
  const rotateX = useTransform(sy, [0, 1], [7, -7])
  const rotateY = useTransform(sx, [0, 1], [-7, 7])

  // Glare position (percent). Kept independent of the tilt so it can fade out
  // where the cursor left rather than snapping to the tile's centre.
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const glareX = useTransform(gx, (v) => `${String(v)}%`)
  const glareY = useTransform(gy, (v) => `${String(v)}%`)
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, oklch(0.86 0.13 200 / 0.22), transparent 55%)`

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || reduced) return
    const r = el.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width
    const ny = (e.clientY - r.top) / r.height
    px.set(nx)
    py.set(ny)
    gx.set(nx * 100)
    gy.set(ny * 100)
  }
  const onLeave = () => {
    // Recentre the tilt only; leave the glare where it was so it fades in place.
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <m.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      whileHover={reduced ? undefined : { scale: 1.025 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="glass glass-mobile-flat group relative overflow-hidden rounded-2xl p-5 text-left transition-[border-color,box-shadow] duration-300 hover:border-accent/60 hover:shadow-[0_8px_32px_-8px_oklch(0.82_0.14_205/0.35),inset_0_1px_0_oklch(0.95_0.07_200/0.3)] sm:p-6"
    >
      <m.span
        aria-hidden
        style={reduced ? undefined : { background: glare }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {/* light-catching top edge */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      {(icon ?? index) && (
        <div className="relative flex items-center justify-between">
          {icon && (
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-hairline-soft bg-bg-soft/50 text-accent transition-colors duration-300 group-hover:border-accent/50 group-hover:bg-accent/10">
              <span className="block h-5 w-5">{icon}</span>
            </span>
          )}
          {index && (
            <span className="font-mono text-[0.72rem] tabular-nums text-faint transition-colors duration-300 group-hover:text-accent">
              {index}
            </span>
          )}
        </div>
      )}

      <span className="relative mt-4 block font-sans text-[0.72rem] uppercase tracking-[0.28em] text-accent">{label}</span>
      <p className="relative mt-2 font-display text-[clamp(0.98rem,1.5vw,1.18rem)] font-medium leading-[1.25] text-ink">
        {children}
      </p>
    </m.div>
  )
}

export default GlassTile
