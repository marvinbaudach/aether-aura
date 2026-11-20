import { useEffect, useId, useRef, useState, type JSX, type SyntheticEvent } from 'react'
import { btnPrimary, btnSecondary } from './buttonStyles'

// Reserve / waitlist flow built on the native <dialog> element: it gives us a
// real top-layer modal with focus trapping, Escape-to-close and an inert
// backdrop for free — no focus-management library, no portal. The form uses the
// browser's own constraint validation (type="email" required), and the
// form→confirmation swap is animated with the View Transitions API where
// supported, falling back to an instant swap everywhere else.
interface ReserveDialogProps {
  open: boolean
  onClose: () => void
  /** Configurator summary shown with the reservation, e.g. "Nebula Violet · Midnight". */
  config?: string
}

const ReserveDialog = ({ open, onClose, config }: ReserveDialogProps): JSX.Element => {
  const ref = useRef<HTMLDialogElement>(null)
  // Two dialogs live on the page (configurator and closing CTA), so every id
  // is generated per instance.
  const uid = useId()
  const titleId = `${uid}-title`
  const nameId = `${uid}-name`
  const emailId = `${uid}-email`
  const confirmRef = useRef<HTMLHeadingElement>(null)
  const [done, setDone] = useState(false)

  // Drive the native modal from React state. showModal()/close() are the only
  // ways to enter/leave the top layer, so mirror `open` onto them.
  useEffect(() => {
    const d = ref.current
    if (d === null) return
    if (open && !d.open) {
      setDone(false)
      d.showModal()
    } else if (!open && d.open) {
      d.close()
    }
  }, [open])

  // The submitted form unmounts and takes keyboard focus with it, so screen
  // readers would hear nothing. Move focus to the confirmation heading; the
  // focus change is what announces it. An effect (not onSubmit) because the swap
  // may run inside a view-transition callback, and only an effect is guaranteed
  // to see the mounted node.
  useEffect(() => {
    if (done) confirmRef.current?.focus()
  }, [done])

  const onSubmit = (e: SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault()
    // No backend in this concept build — just confirm. Wrap the swap in a view
    // transition so the form cross-fades into the confirmation instead of
    // popping. Reach the API through a loose cast so older browsers (no
    // startViewTransition) fall back to an instant swap.
    const swap = (): void => { setDone(true) }
    const vt = (document as unknown as { startViewTransition?: (cb: () => void) => void }).startViewTransition
    if (vt !== undefined) vt.call(document, swap)
    else swap()
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // Native dialogs don't light-dismiss; close when the backdrop itself is
      // clicked (the dialog element fills the viewport, its children don't).
      onClick={(e) => { if (e.target === ref.current) onClose() }}
      aria-labelledby={titleId}
      className="reserve-dialog m-auto w-[min(92vw,30rem)] rounded-2xl border border-hairline-soft bg-bg-soft p-0 text-ink backdrop:bg-[oklch(0.08_0.01_245/0.6)] backdrop:backdrop-blur-xs"
    >
      <div className="relative p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full border border-hairline text-muted transition-colors hover:border-accent/40 hover:text-ink"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {done ? (
          <div className="py-4 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-accent/50 bg-accent/10 text-accent">
              <svg viewBox="0 0 24 24" aria-hidden className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 ref={confirmRef} id={titleId} tabIndex={-1} className="mt-6 font-display text-[1.7rem] font-medium">You're on the list.</h2>
            <p className="mx-auto mt-3 max-w-[34ch] font-sans text-[0.98rem] text-muted">
              {config !== undefined && `Your ${config} build is noted. `}
              We'll reach you when first-run reservations open.
            </p>
            <button type="button" onClick={onClose} className={`${btnSecondary} mt-7`}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="text-left">
            <p className="pr-12 font-sans text-[0.9rem] text-muted">
              First run · 2120{config !== undefined && ` · ${config}`}
            </p>
            <h2 id={titleId} className="mt-3 font-display text-[1.8rem] font-medium leading-tight">
              Reserve the first light.
            </h2>
            <p className="mt-3 font-sans text-[0.96rem] text-muted">
              Join the waitlist. No payment is taken.
            </p>

            <label htmlFor={nameId} className="mt-6 block font-sans text-[0.9rem] text-muted">Name</label>
            <input
              id={nameId}
              name="name"
              type="text"
              autoComplete="name"
              className="mt-2 w-full rounded-xl border border-hairline bg-bg px-4 py-3 font-sans text-ink transition-colors placeholder:text-faint focus-visible:border-accent"
              placeholder="Jane Doe"
            />

            <label htmlFor={emailId} className="mt-4 block font-sans text-[0.9rem] text-muted">Email</label>
            <input
              id={emailId}
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-hairline bg-bg px-4 py-3 font-sans text-ink transition-colors placeholder:text-faint focus-visible:border-accent"
              placeholder="you@example.com"
            />

            <button type="submit" className={`${btnPrimary} mt-7 w-full`}>
              Reserve your Aura
            </button>
          </form>
        )}
      </div>
    </dialog>
  )
}

export default ReserveDialog
