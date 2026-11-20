import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeroReveal from '../../components/HeroReveal'
import { REDUCED, mockMedia, stubMediaPlayback } from '../helpers/browserStubs'

describe('HeroReveal reduced motion', () => {
  afterEach(() => { vi.restoreAllMocks() })

  it('plays the scroll-linked film when motion is allowed', () => {
    mockMedia()
    const media = stubMediaPlayback()
    const { container } = render(<HeroReveal />)
    expect(container.querySelector('video')).not.toBeNull()
    expect(media.play).toHaveBeenCalled()
  })

  it('renders a static poster with the wordmark and tiles, and no film', () => {
    mockMedia([REDUCED])
    const media = stubMediaPlayback()
    const { container } = render(<HeroReveal />)
    expect(container.querySelector('video')).toBeNull()
    expect(screen.getByAltText('The AETHER Aura titanium smartwatch')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('AETHER')
    expect(media.play).not.toHaveBeenCalled()
  })
})
