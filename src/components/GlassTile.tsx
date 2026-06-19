import { useRef } from 'react'
import type { ReactNode, PointerEvent } from 'react'
import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform } from 'framer-motion'

type GlassTileProps = { children: ReactNode; className?: string }

// A glass plate that tilts in 3D toward the cursor (pressing its near edge
// down) and carries a specular light that tracks the pointer across its surface.
// On touch devices the tilt is softened (lighter springs, smaller angle) and the
// glare pool is dropped entirely — coarse pointers never "hover", so the glare
// only flickered during pan gestures and read as jitter rather than polish.
export default function GlassTile({ children, className = '' }: GlassTileProps) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 220, damping: 22 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-7, 7]), { stiffness: 220, damping: 22 })

  const glareX = useTransform(px, (v) => `${v * 100}%`)
  const glareY = useTransform(py, (v) => `${v * 100}%`)
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, oklch(0.85 0.13 205 / 0.22), transparent 55%)`

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const reset = () => { px.set(0.5); py.set(0.5) }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1000, willChange: 'transform' }}
      whileHover={{ scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className={`group relative overflow-hidden rounded-2xl border border-[oklch(0.6_0.02_235/0.18)] bg-[oklch(0.22_0.015_240/0.4)] shadow-[0_30px_80px_-40px_oklch(0.05_0_0/0.9)] backdrop-blur-xl transition-shadow duration-300 [transform-style:preserve-3d] hover:border-[oklch(0.82_0.13_205/0.4)] hover:shadow-[0_40px_90px_-40px_oklch(0.05_0_0/0.95),0_0_40px_-6px_oklch(0.82_0.13_205/0.35)] tile-tilt-soft tile-no-glare ${className}`}
    >
      {/* glass top sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.9_0.02_235/0.4)] to-transparent" />
      {/* specular light pool — hover only, hidden on coarse pointers */}
      <motion.div
        aria-hidden
        style={{ background: glare }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative [transform:translateZ(40px)]">{children}</div>
    </motion.div>
  )
}
