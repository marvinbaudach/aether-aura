import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest'
import { render } from '@testing-library/react'
import Centerpiece from '../../components/Centerpiece'
import { COARSE, REDUCED, mockMedia, stubMediaPlayback, stubVisibleIntersectionObserver } from '../helpers/browserStubs'

const POSTER_ALT = 'The Aura seen from its titanium back'

describe('Centerpiece reduced motion', () => {
  let raf: MockInstance
  let cancelRaf: MockInstance
  let frames: number

  beforeEach(() => {
    stubVisibleIntersectionObserver()
    raf = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1)
    cancelRaf = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined)
    // A bare 2d context is enough for the scrub effect to start up.
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      { clearRect: vi.fn(), drawImage: vi.fn() } as unknown as CanvasRenderingContext2D,
    )
    // Count frame-sequence preloads (151 Image objects on the scrub path).
    frames = 0
    vi.stubGlobal('Image', class {
      complete = false
      naturalWidth = 0
      naturalHeight = 0
      decoding = ''
      onload: (() => void) | null = null
      set src(_: string) { frames += 1 }
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('scrubs a canvas frame sequence when motion is allowed on a fine pointer', () => {
    mockMedia()
    const { container } = render(<Centerpiece />)
    expect(container.querySelector('canvas')).not.toBeNull()
    expect(container.querySelector('video')).toBeNull()
    expect(frames).toBeGreaterThan(0)
    expect(raf).toHaveBeenCalled()
  })

  it('shows only the still poster and starts no frame loading or animation loop', () => {
    mockMedia([REDUCED])
    const { container, getByAltText } = render(<Centerpiece />)
    expect(getByAltText(POSTER_ALT)).toBeInTheDocument()
    expect(container.querySelector('canvas')).toBeNull()
    expect(container.querySelector('video')).toBeNull()
    expect(frames).toBe(0)
    expect(raf).not.toHaveBeenCalled()
  })

  it('does not autoplay anything on touch when reduced motion is on', () => {
    mockMedia([REDUCED, COARSE])
    const media = stubMediaPlayback()
    const { container, getByAltText } = render(<Centerpiece />)
    expect(getByAltText(POSTER_ALT)).toBeInTheDocument()
    expect(container.querySelector('video')).toBeNull()
    expect(media.play).not.toHaveBeenCalled()
  })

  it('plays the muted loop on touch when motion is allowed', () => {
    mockMedia([COARSE])
    const media = stubMediaPlayback()
    const { container } = render(<Centerpiece />)
    expect(container.querySelector('video')).not.toBeNull()
    expect(container.querySelector('canvas')).toBeNull()
    expect(media.play).toHaveBeenCalled()
  })

  it('reacts live when the preference flips while mounted', () => {
    const media = mockMedia()
    const { container } = render(<Centerpiece />)
    expect(container.querySelector('canvas')).not.toBeNull()

    media.set(REDUCED, true)
    expect(container.querySelector('canvas')).toBeNull()
    expect(container.querySelector('img')).not.toBeNull()
    expect(cancelRaf).toHaveBeenCalled()

    media.set(REDUCED, false)
    expect(container.querySelector('canvas')).not.toBeNull()
  })
})

describe('Centerpiece stage height', () => {
  beforeEach(() => { stubVisibleIntersectionObserver() })
  afterEach(() => { vi.restoreAllMocks() })

  const stageOf = (container: HTMLElement) => container.querySelector('.sticky')

  it('uses the small viewport height whenever the section itself is h-svh', () => {
    mockMedia([COARSE])
    stubMediaPlayback()
    const { container } = render(<Centerpiece />)
    expect(container.querySelector('section')).toHaveClass('h-svh')
    expect(stageOf(container)).toHaveClass('h-svh')
    expect(stageOf(container)).not.toHaveClass('h-screen')
  })

  it('uses h-svh for reduced motion on a fine pointer, where the section is h-svh too', () => {
    mockMedia([REDUCED])
    const { container } = render(<Centerpiece />)
    expect(container.querySelector('section')).toHaveClass('h-svh')
    expect(stageOf(container)).toHaveClass('h-svh')
    expect(stageOf(container)).not.toHaveClass('h-screen')
  })

  it('swaps the stage height live when the preference flips', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const media = mockMedia()
    const { container } = render(<Centerpiece />)
    expect(stageOf(container)).toHaveClass('h-screen')

    media.set(REDUCED, true)
    expect(container.querySelector('section')).toHaveClass('h-svh')
    expect(stageOf(container)).toHaveClass('h-svh')

    media.set(REDUCED, false)
    expect(container.querySelector('section')).toHaveClass('h-[200vh]')
    expect(stageOf(container)).toHaveClass('h-screen')
  })

  it('keeps h-screen for the scrub track', () => {
    mockMedia()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const { container } = render(<Centerpiece />)
    expect(container.querySelector('section')).toHaveClass('h-[200vh]')
    expect(stageOf(container)).toHaveClass('h-screen')
  })
})
