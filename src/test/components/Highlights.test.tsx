import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import Highlights from '../../components/Highlights'
import { REDUCED, mockMedia } from '../helpers/browserStubs'

const AUTO_ADVANCE_MS = 5200

const selectedTab = (): string | null =>
  screen.getAllByRole('tab').find((t) => t.getAttribute('aria-selected') === 'true')?.textContent ?? null

describe('Highlights reduced motion', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('auto-advances and offers a pause control when motion is allowed', () => {
    mockMedia()
    render(<Highlights />)
    expect(screen.getByRole('button', { name: /pause auto-advancing/i })).toBeInTheDocument()
    const first = selectedTab()

    act(() => { vi.advanceTimersByTime(AUTO_ADVANCE_MS + 100) })
    expect(selectedTab()).not.toBe(first)
  })

  it('never advances and drops the pause control under reduced motion', () => {
    mockMedia([REDUCED])
    render(<Highlights />)
    expect(screen.queryByRole('button', { name: /auto-advancing/i })).toBeNull()
    const first = selectedTab()

    act(() => { vi.advanceTimersByTime(AUTO_ADVANCE_MS * 3) })
    expect(selectedTab()).toBe(first)
  })

  it('stops advancing when the preference flips on while mounted', () => {
    const media = mockMedia()
    render(<Highlights />)
    media.set(REDUCED, true)
    const first = selectedTab()

    act(() => { vi.advanceTimersByTime(AUTO_ADVANCE_MS * 3) })
    expect(selectedTab()).toBe(first)
    expect(screen.queryByRole('button', { name: /auto-advancing/i })).toBeNull()
  })
})
