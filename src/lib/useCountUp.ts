import { useEffect, useState } from 'react'

// Animate an integer from 0 to `target` with an ease-out cubic curve, but only
// once `run` becomes true (so it can be gated on scroll-into-view). For
// reduced-motion users the value is derived straight from the target, with no
// animation frames scheduled.
const useCountUp = (target: number, run: boolean, ms = 1400, reduced = false): number => {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!run || reduced) return

    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / ms)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); }
  }, [run, target, ms, reduced])

  if (reduced) return run ? target : 0
  return value
}

export { useCountUp }
