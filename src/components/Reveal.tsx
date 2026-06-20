import type { ReactNode, JSX } from 'react'
import { m } from 'framer-motion'
import { fadeUp, viewportOnce } from '../anim'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'ul' | 'li' | 'figure'
}

// Lightweight scroll-into-view fade-up. Plays once. Respects reduced motion
// automatically because framer-motion reads the OS setting for tween springs
// when wrapped by MotionConfig (set in App).
const Reveal = ({ children, className, delay = 0, as = 'div' }: RevealProps): JSX.Element => {
  const Comp = m[as]
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </Comp>
  )
}

export default Reveal
