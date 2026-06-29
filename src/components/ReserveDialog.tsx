import { useEffect, useRef, useState, type JSX, type SyntheticEvent } from 'react'

// Reserve / waitlist flow built on the native <dialog> element: it gives us a
// real top-layer modal with focus trapping, Escape-to-close and an inert
// backdrop for free — no focus-management library, no portal. The form uses the
// browser's own constraint validation (type="email" required), and the
// form→confirmation swap is animated with the View Transitions API where
// supported, falling back to an instant swap everywhere else.
interface ReserveDialogProps {
  open: boolean
  onClose: () => void
}

const ReserveDialog = ({ open, onClose }: ReserveDialogProps): JSX.Element => {
  const ref = useRef<HTMLDialogElement>(null)
  const [done, setDone] = useState(false)

  // Drive the native modal from React state. showModal()/close() are the only
  // ways to enter/leave the top layer, so mirror `open` onto them.
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      setDone(false)
      d.showModal()
    } else if (!open && d.open) {
      d.close()
    }
  }, [open])

  const onSubmit = (e: SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault()
    // No backend in this concept build — just confirm. Wrap the swap in a view
    // transition so the form cross-fades into the confirmation instead of
    // popping. Reach the API through a loose cast so older browsers (no
    // startViewTransition) fall back to an instant swap.
    const swap = (): void => { setDone(true) }
    const vt = (document as unknown as { startViewTransition?: (cb: () => void) => void }).startViewTransition
    if (vt) vt.call(document, swap)
    else swap()
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // Native dialogs don't light-dismiss; close when the backdrop itself is
      // clicked (the dialog element fills the viewport, its children don't).
      onClick={(e) => { if (e.target === ref.current) onClose() }}
      aria-labelledby="reserve-title"
      className="reserve-dialog w-[min(92vw,30rem)] rounded-3xl border border-hairline-soft bg-bg-soft p-0 text-ink backdrop:bg-[oklch(0.08_0.01_245/0.6)] backdrop:backdrop-blur-sm"
    >
      <div className="relative p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-hairline text-muted transition-colors hover:border-accent/40 hover:text-ink"
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
            <h2 className="mt-6 font-display text-[1.7rem] font-medium">You're on the list.</h2>
            <p className="mx-auto mt-3 max-w-[34ch] font-sans text-[0.98rem] text-muted">
              We'll reach you the moment first-run reservations open. Until then —
              measured in light.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 rounded-full border border-accent/40 bg-accent/10 px-7 py-3 font-sans text-[0.95rem] font-medium text-ink transition-colors hover:bg-accent/20"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="text-left">
            <p className="font-sans text-[0.72rem] uppercase tracking-[0.34em] text-accent">First run · 2120</p>
            <h2 id="reserve-title" className="mt-3 font-display text-[1.8rem] font-medium leading-tight">
              Reserve the first light.
            </h2>
            <p className="mt-3 font-sans text-[0.96rem] text-muted">
              Join the waitlist — no payment, no commitment.
            </p>

            <label htmlFor="reserve-name" className="mt-6 block font-sans text-[0.82rem] text-muted">Name</label>
            <input
              id="reserve-name"
              name="name"
              type="text"
              autoComplete="name"
              className="mt-2 w-full rounded-xl border border-hairline bg-bg px-4 py-3 font-sans text-ink outline-none transition-colors placeholder:text-faint focus-visible:border-accent/60"
              placeholder="Jane Doe"
            />

            <label htmlFor="reserve-email" className="mt-4 block font-sans text-[0.82rem] text-muted">Email</label>
            <input
              id="reserve-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-hairline bg-bg px-4 py-3 font-sans text-ink outline-none transition-colors placeholder:text-faint focus-visible:border-accent/60"
              placeholder="you@example.com"
            />

            <button
              type="submit"
              className="mt-7 w-full rounded-full border border-accent/40 bg-[linear-gradient(100deg,oklch(0.86_0.13_200),oklch(0.7_0.15_215))] px-7 py-3.5 font-sans text-[1rem] font-medium text-[oklch(0.16_0.02_245)] transition-transform hover:scale-[1.02]"
            >
              Reserve your Aura
            </button>
          </form>
        )}
      </div>
    </dialog>
  )
}

export default ReserveDialog
