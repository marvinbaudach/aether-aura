import type { JSX, ReactNode } from 'react'

interface FeatureTileProps {
  label: string
  children: ReactNode
}

// Flat feature tile for the hero reveal. It sits over a blurred film, so it
// carries its own near-opaque ground for legibility instead of a backdrop blur.
const FeatureTile = ({ label, children }: FeatureTileProps): JSX.Element => (
  <div className="rounded-2xl border border-hairline bg-bg-soft/85 p-5 text-left sm:p-6">
    <h3 className="font-display text-[1.05rem] font-medium text-ink">{label}</h3>
    <p className="mt-2 font-sans text-[0.95rem] leading-snug text-muted">{children}</p>
  </div>
)

export default FeatureTile
