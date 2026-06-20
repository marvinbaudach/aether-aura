import { Fragment } from 'react'
import type { JSX } from 'react'
import { m } from 'framer-motion'
import { ease } from '../anim'

interface RevealTextProps {
  text: string
  className?: string
  as?: 'h2' | 'h3' | 'p'
  delay?: number
  stagger?: number
  duration?: number
}

// Apple-style reading reveal: each word rises and fades in from below a mask as
// the block scrolls into view, lightly staggered. Plays once.
const RevealText = ({
  text,
  className,
  as = 'p',
  delay = 0,
  stagger = 0.045,
  duration = 0.6,
}: RevealTextProps): JSX.Element => {
  const Comp = as === 'h2' ? m.h2 : as === 'h3' ? m.h3 : m.p
  const words = text.split(' ')

  return (
    <Comp
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-12%' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        // The space sits *between* the clipped word wrappers (not inside them),
        // otherwise overflow-hidden eats it and words run together.
        <Fragment key={i}>
          <span aria-hidden className="inline-block overflow-hidden align-bottom">
            <m.span
              className="inline-block"
              variants={{ hidden: { y: '115%' }, show: { y: '0%' } }}
              transition={{ duration, ease }}
            >
              {word}
            </m.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </Comp>
  )
}

export default RevealText
