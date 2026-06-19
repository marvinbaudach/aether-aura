import { motion } from 'framer-motion'
import { ease } from '../anim'

type RevealTextProps = {
  text: string
  className?: string
  as?: 'h2' | 'h3' | 'p'
  delay?: number
  stagger?: number
  duration?: number
}

// Apple-style reading reveal: each word rises and fades in from below a mask as
// the block scrolls into view, lightly staggered. Plays once.
export default function RevealText({
  text,
  className,
  as = 'p',
  delay = 0,
  stagger = 0.045,
  duration = 0.6,
}: RevealTextProps) {
  const Comp = as === 'h2' ? motion.h2 : as === 'h3' ? motion.h3 : motion.p
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
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: '115%' }, show: { y: '0%' } }}
            transition={{ duration, ease }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Comp>
  )
}
