// One button pair for the whole page. Primary is the single main action
// (reserve); secondary is for anything that backs out or repeats it.
const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-7 py-3 font-sans text-[1rem] font-medium transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60'

export const btnPrimary = `${base} border border-accent bg-accent text-bg hover:bg-[color-mix(in_oklab,var(--accent)_82%,white)]`

export const btnSecondary = `${base} border border-hairline text-muted hover:border-accent/50 hover:text-ink`
