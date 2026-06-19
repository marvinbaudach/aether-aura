import RevealText from './RevealText'

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
    <section id="specs" className="mx-auto max-w-[1100px] px-[6vw] py-[clamp(5rem,12vh,12rem)]">
      {rows.map((r) => (
        <div
          key={r.n}
          className="grid grid-cols-[auto_1fr] items-baseline gap-[clamp(1.5rem,5vw,5rem)] border-t border-hairline py-[clamp(2rem,5vh,4rem)] md:grid-cols-[auto_0.9fr_1.1fr]"
        >
          <span className="font-display text-[clamp(1.4rem,2.4vw,2.2rem)] text-accent">{r.n}</span>
          <RevealText
            as="h3"
            text={r.h}
            className="font-display text-[clamp(1.5rem,3.2vw,2.6rem)] font-medium leading-[1.06]"
          />
          <RevealText
            as="p"
            text={r.t}
            delay={0.1}
            stagger={0.012}
            duration={0.5}
            className="col-start-2 max-w-[48ch] font-sans text-[1.05rem] text-muted md:col-start-3"
          />
        </div>
      ))}
    </section>
  )
}
