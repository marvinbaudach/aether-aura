import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest'
import { render } from '@testing-library/react'
import AuroraGlow from '../../components/AuroraGlow'
import { REDUCED, mockMedia } from '../helpers/browserStubs'

// Spy on the WebGL entry point instead of running it: jsdom has no GL context.
const { Renderer } = vi.hoisted(() => ({
  Renderer: vi.fn().mockImplementation(function () {
    return {
      gl: {
        canvas: document.createElement('canvas'),
        clearColor: vi.fn(),
        getExtension: vi.fn().mockReturnValue(null),
      },
      dpr: 1,
      setSize: vi.fn(),
      render: vi.fn(),
    }
  }),
}))

vi.mock('ogl', () => ({
  Renderer,
  Triangle: vi.fn(),
  Program: vi.fn().mockImplementation(function () { return { uniforms: { uRes: { value: [] }, uTime: { value: 0 }, uMouse: { value: [] } } } }),
  Mesh: vi.fn(),
}))

describe('AuroraGlow reduced motion', () => {
  let raf: MockInstance

  beforeEach(() => {
    Renderer.mockClear()
    raf = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1)
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined)
  })
  afterEach(() => { vi.restoreAllMocks() })

  it('starts the WebGL renderer when motion is allowed', () => {
    mockMedia()
    render(<AuroraGlow />)
    expect(Renderer).toHaveBeenCalledTimes(1)
  })

  it('creates no WebGL context and no canvas under reduced motion', () => {
    mockMedia([REDUCED])
    const { container } = render(<AuroraGlow />)
    expect(Renderer).not.toHaveBeenCalled()
    expect(container.querySelector('canvas')).toBeNull()
    expect(raf).not.toHaveBeenCalled()
  })

  it('tears the renderer down when the preference flips on', () => {
    const media = mockMedia()
    const { container } = render(<AuroraGlow />)
    expect(container.querySelector('canvas')).not.toBeNull()

    media.set(REDUCED, true)
    expect(container.querySelector('canvas')).toBeNull()
    expect(Renderer).toHaveBeenCalledTimes(1)
  })
})
