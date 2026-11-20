import { lazy, Suspense, useState, type JSX } from 'react'
import { useNearViewport } from '../lib/useNearViewport'
import { btnPrimary } from './buttonStyles'
import ReserveDialog from './ReserveDialog'

// The aurora is a WebGL effect (ogl) that only lives in this below-the-fold
// section. Split it into its own chunk and mount it only once the section nears
// the viewport, so ogl never weighs on the initial load and most visitors who
// don't scroll this far never download it at all.
const AuroraGlow = lazy(() => import('./AuroraGlow'))

const CTA = (): JSX.Element => {
  // Load + mount the aurora a little before the section scrolls into view, so the
  // ogl chunk has time to fetch and the effect is ready when the user arrives.
  const [sectionRef, showGlow] = useNearViewport<HTMLElement>('400px 0px')
  const [reserveOpen, setReserveOpen] = useState(false)

  return (
    <section ref={sectionRef} id="reserve" className="relative flex min-h-svh flex-col justify-center overflow-hidden px-[max(1.25rem,6vw)] py-[clamp(4rem,9vh,6.5rem)] text-center">
      {showGlow && (
        <Suspense fallback={null}>
          <AuroraGlow />
        </Suspense>
      )}
      <div className="relative">
        <h2 className="mx-auto max-w-[16ch] font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.04]">
          Reserve the first light.
        </h2>
        <p className="mx-auto mt-6 max-w-[42ch] font-sans text-[1.08rem] text-ink/85">
          The first run is open for reservations and arrives in 2120.
        </p>
        <div className="mt-10">
          <button type="button" onClick={() => { setReserveOpen(true) }} className={btnPrimary}>
            Reserve your Aura
          </button>
        </div>
      </div>
      <ReserveDialog open={reserveOpen} onClose={() => { setReserveOpen(false) }} />
    </section>
  )
}

export default CTA
