import type { JSX } from 'react'
const ITEMS = [
  'Grade-5 Titanium',
  'Sapphire Crystal',
  'Holographic Display',
  'Nuclear Cell · Never Charge',
  'Optical Vitals',
  'Standalone Calls',
  'WR-100 Sealed',
  'Machined From One Block',
]

// Quiet brand ticker that bridges the hero and the film. Pure CSS transform
// loop (see .marquee-track), paused for reduced-motion users.
const Marquee = (): JSX.Element => {
  const row = [...ITEMS, ...ITEMS]
  return (
    <section className="relative border-y border-hairline-soft bg-bg py-5 overflow-hidden">
      <div className="flex w-max marquee-track">
        {row.map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="px-7 font-sans text-[0.82rem] uppercase tracking-[0.28em] text-muted whitespace-nowrap">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-accent/60" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Marquee
