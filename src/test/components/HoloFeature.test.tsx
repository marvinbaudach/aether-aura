import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import HoloFeature from '../../components/HoloFeature'
import { REDUCED, mockMedia, stubMediaPlayback, stubVisibleIntersectionObserver } from '../helpers/browserStubs'

describe('HoloFeature reduced motion', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('mounts and plays the film once the section is near the viewport', () => {
    mockMedia()
    stubVisibleIntersectionObserver()
    const media = stubMediaPlayback()
    const { container } = render(<HoloFeature />)
    expect(container.querySelector('video')).not.toBeNull()
    expect(media.play).toHaveBeenCalled()
  })

  it('keeps the poster and never mounts or plays the film, even when near the viewport', () => {
    mockMedia([REDUCED])
    stubVisibleIntersectionObserver()
    const media = stubMediaPlayback()
    const { container } = render(<HoloFeature />)
    expect(container.querySelector('video')).toBeNull()
    expect(container.querySelector('img')).not.toBeNull()
    expect(media.play).not.toHaveBeenCalled()
  })
})
