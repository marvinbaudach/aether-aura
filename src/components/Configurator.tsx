import { useState, type CSSProperties, type JSX } from 'react'
import Reveal from './Reveal'
import ReserveDialog from './ReserveDialog'

// The build options are purely visual: the product render is a cyan-on-black
// studio shot, so a CSS hue-rotate shifts only the display's light signature
// while the titanium stays neutral, and brightness/contrast reads as a case
// finish. No extra image assets, instant switching, and the filter transition
// gives a free cross-fade.
interface LightSignature {
  id: string
  name: string
  /** hue-rotate (deg) from the render's native cyan to this signature. */
  rotate: number
  /** Swatch + section accent. Mirrors the shifted display glow. */
  accent: string
  accentDeep: string
}

const SIGNATURES = [
  { id: 'cyan', name: 'Aurora Cyan', rotate: 0, accent: 'oklch(0.82 0.14 205)', accentDeep: 'oklch(0.70 0.15 215)' },
  { id: 'violet', name: 'Nebula Violet', rotate: 95, accent: 'oklch(0.74 0.16 300)', accentDeep: 'oklch(0.62 0.18 305)' },
  { id: 'emerald', name: 'Ion Emerald', rotate: -45, accent: 'oklch(0.80 0.16 160)', accentDeep: 'oklch(0.68 0.17 165)' },
  { id: 'amber', name: 'Solar Amber', rotate: -130, accent: 'oklch(0.83 0.14 80)', accentDeep: 'oklch(0.72 0.15 70)' },
] as const satisfies readonly LightSignature[]

interface CaseFinish {
  id: string
  name: string
  /** Finish grade applied before the signature's hue-rotate. */
  filter: string
}

const FINISHES = [
  { id: 'natural', name: 'Titanium Natural', filter: '' },
  { id: 'midnight', name: 'Midnight', filter: 'brightness(0.72) contrast(1.15)' },
  { id: 'lunar', name: 'Lunar Silver', filter: 'brightness(1.16) saturate(0.8)' },
] as const satisfies readonly CaseFinish[]

const Configurator = (): JSX.Element => {
  const [signature, setSignature] = useState<LightSignature>(SIGNATURES[0])
  const [finish, setFinish] = useState<CaseFinish>(FINISHES[0])
  const [reserveOpen, setReserveOpen] = useState(false)

  const summary = `${signature.name} · ${finish.name}`

  return (
    <section
      id="configure"
      className="cv-section relative snap-start overflow-hidden px-[max(1.25rem,6vw)] py-[clamp(4rem,9vh,6.5rem)]"
      // Scope the accent tokens to the section so labels, swatch glows and the
      // reserve button all follow the chosen light signature.
      style={{ '--accent': signature.accent, '--accent-deep': signature.accentDeep } as CSSProperties}
    >
      <div className="mx-auto grid max-w-shell items-center gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
        {/* Live preview. The filter chain (finish grade + signature hue) is
            transitioned, so every change cross-fades instead of snapping. */}
        <Reveal className="relative flex justify-center">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl transition-[background] duration-700"
            style={{ background: `radial-gradient(circle, color-mix(in oklab, ${signature.accent} 30%, transparent), transparent 70%)` }}
          />
          <picture>
            <source type="image/webp" srcSet="assets/aura_hero_800.webp 800w, assets/aura_hero_1200.webp 1200w" sizes="(min-width: 768px) 44vw, 88vw" />
            <img
              src="assets/aura_hero_1000.jpg"
              alt={`The Aura in ${finish.name} with a ${signature.name} light signature`}
              className="relative w-full max-w-[min(88vw,30rem)] rounded-[28px] transition-[filter] duration-700"
              style={{ filter: `${finish.filter} hue-rotate(${String(signature.rotate)}deg)`.trim() }}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="font-sans text-[0.74rem] uppercase tracking-[0.34em] text-accent transition-colors duration-500">Make it yours</p>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.02] text-gradient">
            One Aura. Your light.
          </h2>
          <p className="mt-5 max-w-[42ch] font-sans text-[1.05rem] text-muted">
            The display, the hologram, the halo — every photon the Aura emits
            follows one signature. Choose it, and the case it lives in.
          </p>

          <fieldset className="mt-10 border-0 p-0">
            <legend className="font-sans text-[0.78rem] uppercase tracking-[0.28em] text-faint">Light signature</legend>
            <div className="mt-4 flex flex-wrap gap-3">
              {SIGNATURES.map((s) => (
                <label key={s.id} className="group flex cursor-pointer items-center gap-2.5 rounded-full border border-hairline bg-bg-soft/50 py-2 pl-2.5 pr-4 transition-colors has-checked:border-accent/60 has-checked:bg-accent/10">
                  <input
                    type="radio"
                    name="light-signature"
                    className="peer sr-only"
                    checked={signature.id === s.id}
                    onChange={() => { setSignature(s) }}
                  />
                  <span
                    aria-hidden
                    className="h-5 w-5 rounded-full transition-shadow duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"
                    style={{ background: s.accent, boxShadow: signature.id === s.id ? `0 0 12px ${s.accent}` : 'none' }}
                  />
                  <span className="font-sans text-[0.9rem] text-muted transition-colors group-has-checked:text-ink">{s.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-8 border-0 p-0">
            <legend className="font-sans text-[0.78rem] uppercase tracking-[0.28em] text-faint">Case finish</legend>
            <div className="mt-4 flex flex-wrap gap-3">
              {FINISHES.map((f) => (
                <label key={f.id} className="flex cursor-pointer items-center rounded-full border border-hairline bg-bg-soft/50 px-4 py-2 transition-colors has-checked:border-accent/60 has-checked:bg-accent/10">
                  <input
                    type="radio"
                    name="case-finish"
                    className="peer sr-only"
                    checked={finish.id === f.id}
                    onChange={() => { setFinish(f) }}
                  />
                  <span className="font-sans text-[0.9rem] text-muted transition-colors peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-ink">{f.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => { setReserveOpen(true) }}
              className="rounded-full border border-accent/40 bg-accent/10 px-8 py-3.5 font-sans text-[1rem] font-medium text-ink transition-colors duration-300 hover:bg-accent/25"
            >
              Reserve this build
            </button>
            <p aria-live="polite" className="font-mono text-[0.82rem] tabular-nums text-faint">{summary}</p>
          </div>
        </Reveal>
      </div>

      <ReserveDialog open={reserveOpen} onClose={() => { setReserveOpen(false) }} config={summary} />
    </section>
  )
}

export default Configurator
