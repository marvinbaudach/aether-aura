import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCountUp } from '../../lib/useCountUp'

describe('useCountUp', () => {
  beforeEach(() => {
    // Fake the clock from epoch 0 AND performance.now so the hook's
    // performance.now() start time and the requestAnimationFrame timestamp
    // argument advance together.
    vi.useFakeTimers({ now: 0, toFake: ['Date', 'setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('stays at 0 when run is false', () => {
    const { result, rerender } = renderHook(({ run }: { run: boolean }) => useCountUp(40, run), {
      initialProps: { run: false },
    })
    expect(result.current).toBe(0)
    // Reduced-motion short-circuits to target only when run is true.
    rerender({ run: false })
    expect(result.current).toBe(0)
  })

  it('jumps straight to target for reduced-motion users once running', () => {
    const { result } = renderHook(() => useCountUp(40, true, 1400, true))
    expect(result.current).toBe(40)
  })

  it('animates from 0 up to the target across frames', () => {
    const { result } = renderHook(() => useCountUp(40, true, 1400, false))
    expect(result.current).toBe(0)

    // Advance partway: the eased value should be > 0 but < target.
    act(() => { vi.advanceTimersByTime(700) })
    expect(result.current).toBeGreaterThan(0)
    expect(result.current).toBeLessThan(40)

    // Complete the animation.
    act(() => { vi.advanceTimersByTime(700) })
    expect(result.current).toBe(40)
  })

  it('clamps at the target and does not overshoot', () => {
    const { result } = renderHook(() => useCountUp(40, true, 1000, false))
    act(() => { vi.advanceTimersByTime(5000) })
    expect(result.current).toBe(40)
  })
})
