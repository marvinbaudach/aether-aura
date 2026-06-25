import { useEffect, useRef, useState, type RefObject } from 'react'

// One-way "has this element come within `rootMargin` of the viewport yet?"
// signal. Flips to true once and disconnects — used to defer mounting heavy,
// below-the-fold work (a WebGL chunk, a video download) until the visitor is
// about to reach it, so it never weighs on the initial load and visitors who
// never scroll that far never pay for it.
const useNearViewport = <T extends Element>(
  rootMargin = '400px 0px',
): [RefObject<T | null>, boolean] => {
  const ref = useRef<T>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || near) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => { io.disconnect(); }
  }, [rootMargin, near])

  return [ref, near]
}

export { useNearViewport }
