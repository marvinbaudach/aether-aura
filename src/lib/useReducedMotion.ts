import { useMediaQuery } from './useMediaQuery'

// Live `prefers-reduced-motion` flag. Unlike framer's useReducedMotion, which
// reads the preference once, this re-renders when the user flips the setting.
const useReducedMotion = (): boolean => useMediaQuery('(prefers-reduced-motion: reduce)')

export { useReducedMotion }
