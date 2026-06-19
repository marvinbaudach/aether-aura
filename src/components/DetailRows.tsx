import { motion } from 'framer-motion'
import { ease } from '../anim'

type Row = { n: string; h: string; t: string }

const rows: Row[] = [
  {
    n: '01',
    h: 'Forty hours between charges',
    t: 'The 1.2 watt-hour cell runs forty hours on a charge, measured at sixty percent brightness with the emitter active.',
  },
  {
    n: '02',
    h: 'Five grams of shell',
    t: 'The bare titanium case weighs five grams and survives a two metre fall onto stone without a scratch on the sapphire.',
  },
  {
    n: '03',
    h: 'Sealed to one hundred metres',
    t: 'Every Aura is pressure tested to one hundred metres of water before it leaves the bench.',
  },
]

export default function DetailRows() {
  return (
    <section className="mx-auto max-w-[1100px] px-[6vw] py-[clamp(5rem,12vh,12rem)]">
      {rows.map((r, i) => (
        <motion.div
          key={r.n}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-12%' }}
          transition={{ duration: 0.7, delay: i * 0.05, ease }}
          className="grid grid-cols-[auto_1fr] items-baseline gap-[clamp(1.5rem,5vw,5rem)] border-t border-hairline py-[clamp(2rem,5vh,4rem)] md:grid-cols-[auto_0.9fr_1.1fr]"
        >
          <span className="font-display text-[clamp(1.4rem,2.4vw,2.2rem)] text-accent">{r.n}</span>
          <h3 className="font-display text-[clamp(1.5rem,3.2vw,2.6rem)] font-medium leading-[1.06]">{r.h}</h3>
          <p className="col-start-2 max-w-[48ch] font-sans text-[1.05rem] text-muted md:col-start-3">{r.t}</p>
        </motion.div>
      ))}
    </section>
  )
}
