import { useCallback, useSyncExternalStore } from 'react'

// Subscribe to a CSS media query and re-render when it flips. Built on
// useSyncExternalStore so it stays correct across concurrent renders and
// degrades to `false` in any non-DOM (SSR) context.
const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => { mql.removeEventListener('change', onChange); }
    },
    [query],
  )

  const getSnapshot = () => window.matchMedia(query).matches
  const getServerSnapshot = () => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export { useMediaQuery }
