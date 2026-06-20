import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Reset the DOM and fake timers between every test so state never leaks.
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

// ---- Browser API stubs ----
// jsdom doesn't implement these, but most components rely on them.

beforeEach(() => {
  // matchMedia: defaults to "no match" so reduced-motion is off and the
  // pointer is treated as fine. Tests can override per-case.
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

  // IntersectionObserver: every observed element reports as intersecting so
  // scroll-reveal and autoplay effects fire. Tests can flip this.
  class IO {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    takeRecords = vi.fn().mockReturnValue([])
    root = null
    rootMargin = ''
    thresholds = []
  }
  ;(window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IO
  ;(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IO

  // ResizeObserver: no-op, components just need it to exist.
  class RO {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
  ;(window as unknown as { ResizeObserver: unknown }).ResizeObserver = RO
  ;(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = RO

  // requestAnimationFrame: drive synchronously via fake timers when needed;
  // default to an immediate callback so hooks that schedule RAF settle.
  // (Tests using fake timers replace this.)
})
