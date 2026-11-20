import { act } from '@testing-library/react'
import { vi, type MockInstance } from 'vitest'

const REDUCED = '(prefers-reduced-motion: reduce)'
const COARSE = '(pointer: coarse)'

type Listener = () => void

// Query-aware matchMedia: only the queries in `initial` match, and `set` flips
// one live and notifies subscribers, like a user changing the OS setting.
interface MediaControl {
  set: (query: string, matches: boolean) => void
}

const mockMedia = (initial: readonly string[] = []): MediaControl => {
  const active = new Set(initial)
  const listeners = new Map<string, Set<Listener>>()
  const subscribers = (query: string): Set<Listener> => {
    const existing = listeners.get(query)
    if (existing !== undefined) return existing
    const created = new Set<Listener>()
    listeners.set(query, created)
    return created
  }

  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    get matches() { return active.has(query) },
    media: query,
    onchange: null,
    addEventListener: (_: string, cb: Listener) => { subscribers(query).add(cb) },
    removeEventListener: (_: string, cb: Listener) => { subscribers(query).delete(cb) },
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

  return {
    set(query: string, matches: boolean) {
      if (matches) active.add(query)
      else active.delete(query)
      act(() => { subscribers(query).forEach((cb) => { cb() }) })
    },
  }
}

// The global setup stubs IntersectionObserver so it never fires. Components
// that gate work on visibility then never reach their motion path, which would
// make a "reduced motion turns it off" assertion pass vacuously. This variant
// reports every observed element as intersecting.
const stubVisibleIntersectionObserver = (): void => {
  class VisibleIO {
    constructor(private readonly cb: (entries: IntersectionObserverEntry[]) => void) {}
    observe = (target: Element) => {
      this.cb([{ isIntersecting: true, target } as IntersectionObserverEntry])
    }
    unobserve = vi.fn()
    disconnect = vi.fn()
    takeRecords = vi.fn().mockReturnValue([])
  }
  vi.stubGlobal('IntersectionObserver', VisibleIO)
  ;(window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = VisibleIO
}

// jsdom leaves media playback unimplemented; play() must return a promise
// because the components chain .catch() on it.
const stubMediaPlayback = (): { play: MockInstance; pause: MockInstance } => {
  const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
  const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined)
  return { play, pause }
}

export { COARSE, REDUCED, mockMedia, stubMediaPlayback, stubVisibleIntersectionObserver }
