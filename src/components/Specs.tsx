import type { JSX } from 'react'
import RevealText from './RevealText'

interface Row { n: string; h: string; t: string }

const rows: Row[] = [
  { n: '01', h: 'Grade-5 titanium monocoque', t: 'Machined from a single billet over fourteen hours. Five grams of shell that survives a two-metre fall onto stone without a scratch on the sapphire.' },
  { n: '02', h: 'Holographic sapphire display', t: 'A 0.8 mm sapphire lens set flush to the case, paired with a volumetric projection layer that lifts your data into the air above the glass.' },
  { n: '03', h: 'Optical vitals engine', t: 'A cyan emitter samples your heartbeat ninety times a second and reads it through the skin — no contacts, no shadow on the beam.' },
  { n: '04', h: 'Lifetime nuclear cell', t: 'A sealed radioisotope fuel rod keeps the Aura running for a full lifetime — never charged, never opened, never refuelled. One watch. One life. One rod.' },
  { n: '05', h: 'Abyss-sealed to 500 metres', t: 'The titanium monocoque keeps its seal far below where any phone would drown — and a pair of sapphire-covered lenses capture stills and 4K video of the deep, straight from your wrist.' },
]

const Specs = (): JSX.Element => {
  return (
    <section id="specs" className="mx-auto max-w-shell px-[max(1.25rem,6vw)] py-[clamp(5rem,12vh,12rem)]">
      {rows.map((r) => (
        <div
          key={r.n}
          className="group grid grid-cols-[auto_1fr] items-baseline gap-[clamp(1.25rem,4vw,4rem)] border-t border-hairline-soft py-[clamp(1.75rem,4vh,3.5rem)] transition-colors hover:border-accent/40 md:grid-cols-[auto_0.9fr_1.1fr]"
        >
          <span className="font-display text-[clamp(1.3rem,2.2vw,2rem)] text-accent">{r.n}</span>
          <RevealText
            as="h3"
            text={r.h}
            className="font-display text-[clamp(1.4rem,3vw,2.4rem)] font-medium leading-[1.06]"
          />
          <RevealText
            as="p"
            text={r.t}
            delay={0.1}
            stagger={0.01}
            duration={0.5}
            className="col-start-2 max-w-[52ch] font-sans text-[1.05rem] text-muted md:col-start-3"
          />
        </div>
      ))}
    </section>
  )
}

export default Specs
