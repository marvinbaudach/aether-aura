import { useState, type CSSProperties, type JSX } from 'react'
import { btnPrimary } from './buttonStyles'
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
      className="cv-section relative flex min-h-svh flex-col justify-center overflow-hidden px-[max(1.25rem,6vw)] py-[clamp(4rem,9vh,6.5rem)]"
      // Scope the accent tokens to the section so labels, swatch glows and the
      // reserve button all follow the chosen light signature.
      style={{ '--accent': signature.accent, '--accent-deep': signature.accentDeep } as CSSProperties}
    >
      <div className="mx-auto grid w-full max-w-shell items-center gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
        {/* Live preview. The filter chain (finish grade + signature hue) is
            transitioned, so every change cross-fades instead of snapping. */}
        <div className="flex justify-center">
          <picture>
            <source type="image/webp" srcSet="assets/aura_hero_800.webp 800w, assets/aura_hero_1200.webp 1200w" sizes="(min-width: 768px) 44vw, 88vw" />
            <img
              src="assets/aura_hero_1000.jpg"
              alt={`The Aura in ${finish.name} with a ${signature.name} light signature`}
              className="w-full max-w-[min(88vw,30rem)] rounded-2xl transition-[filter] duration-700 motion-reduce:transition-none"
              style={{ filter: `${finish.filter} hue-rotate(${String(signature.rotate)}deg)`.trim() }}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>

        <div>
          <h2 className="font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.04]">
            Choose your light signature.
          </h2>
          <p className="mt-5 max-w-[42ch] font-sans text-[1.05rem] text-muted">
            The display, the hologram and the halo all follow one signature.
            Choose it, then the case it lives in.
          </p>

          <fieldset className="mt-10 border-0 p-0">
            <legend className="font-sans text-[0.9rem] text-muted">Light signature</legend>
            <div className="mt-4 flex flex-wrap gap-3">
              {SIGNATURES.map((s) => (
                <label key={s.id} className="group flex cursor-pointer items-center gap-2.5 min-h-11 rounded-full border border-hairline bg-bg-soft/50 py-2 pl-3 pr-4 transition-colors has-checked:border-accent/60 has-checked:bg-accent/10">
                  <input
                    type="radio"
                    name="light-signature"
                    className="peer sr-only"
                    checked={signature.id === s.id}
                    onChange={() => { setSignature(s) }}
                  />
                  <span
                    aria-hidden
                    className="h-5 w-5 rounded-full peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"
                    style={{ background: s.accent }}
                  />
                  <span className="font-sans text-[0.9rem] text-muted transition-colors group-has-checked:text-ink">{s.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-8 border-0 p-0">
            <legend className="font-sans text-[0.9rem] text-muted">Case finish</legend>
            <div className="mt-4 flex flex-wrap gap-3">
              {FINISHES.map((f) => (
                <label key={f.id} className="flex min-h-11 cursor-pointer items-center rounded-full border border-hairline bg-bg-soft/50 px-4 py-2 transition-colors has-checked:border-accent/60 has-checked:bg-accent/10">
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
            <button type="button" onClick={() => { setReserveOpen(true) }} className={btnPrimary}>
              Reserve this build
            </button>
            <p aria-live="polite" className="font-sans text-[0.9rem] text-muted">{summary}</p>
          </div>
        </div>
      </div>

      <ReserveDialog open={reserveOpen} onClose={() => { setReserveOpen(false) }} config={summary} />
    </section>
  )
}

export default Configurator
