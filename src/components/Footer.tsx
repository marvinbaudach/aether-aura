import type { JSX } from 'react'

// Closing sign-off: the line, the wordmark and the fine print. The build's
// commit sha rides along as a data attribute instead of printed text.
const Footer = (): JSX.Element => (
  <footer
    data-commit={__COMMIT_SHA__}
    className="border-t border-hairline-soft px-[max(1.25rem,6vw)] py-[clamp(4rem,9vh,6.5rem)] text-center"
  >
    <div className="mx-auto max-w-shell">
      <p className="mx-auto max-w-[20ch] font-display text-[clamp(2.4rem,7vw,5rem)] font-medium leading-[0.98]">
        Measured in light.
      </p>
      <p className="mx-auto mt-12 w-fit font-display text-[1rem] font-semibold tracking-[0.24em] text-ink">
        AETHER <span className="font-sans text-[0.8rem] font-normal tracking-[0.2em] text-muted">Aura</span>
      </p>
      <p className="mt-6 font-sans text-[0.9rem] text-muted">
        AETHER Aura is a concept prototype. © 2026 AETHER. All renders and footage are AI-generated.
      </p>
    </div>
  </footer>
)

export default Footer
