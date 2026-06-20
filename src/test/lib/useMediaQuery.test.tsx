import { describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMediaQuery } from '../../lib/useMediaQuery'

// Build a controllable matchMedia stub that lets tests flip the `matches`
// value and notify listeners.
const createMatchMedia = (initial: boolean) => {
  const listeners = new Set<(e: unknown) => void>()
  let matches = initial
  const mql = {
    get matches() { return matches },
    set matches(v: boolean) { matches = v },
    media: '',
    onchange: null,
    addEventListener: vi.fn((_: string, cb: (e: unknown) => void) => { listeners.add(cb) }),
    removeEventListener: vi.fn((_: string, cb: (e: unknown) => void) => { listeners.delete(cb) }),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }
  const matchMedia = vi.fn().mockReturnValue(mql)
  return {
    matchMedia,
    mql,
    setMatches(v: boolean) { mql.matches = v; listeners.forEach((l) => { l({}) }) },
  }
}

describe('useMediaQuery', () => {
  it('returns the current match state', () => {
    const { matchMedia } = createMatchMedia(true)
    window.matchMedia = matchMedia
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(true)
  })

  it('updates when the query result changes', () => {
    const ctx = createMatchMedia(false)
    window.matchMedia = ctx.matchMedia
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)

    act(() => { ctx.setMatches(true) })
    expect(result.current).toBe(true)

    act(() => { ctx.setMatches(false) })
    expect(result.current).toBe(false)
  })

  it('subscribes and unsubscribes a change listener', () => {
    const ctx = createMatchMedia(false)
    window.matchMedia = ctx.matchMedia
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(ctx.mql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))

    unmount()
    expect(ctx.mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
