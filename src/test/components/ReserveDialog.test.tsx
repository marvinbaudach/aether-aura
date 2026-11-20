import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ReserveDialog from '../../components/ReserveDialog'

interface ViewTransitionDocument {
  startViewTransition?: (cb: () => void) => void
}

const submitEmail = (): void => {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } })
  fireEvent.click(screen.getByRole('button', { name: 'Reserve your Aura' }))
}

describe('ReserveDialog confirmation', () => {
  const proto = HTMLDialogElement.prototype
  // Descriptors, not method references, so restoring puts back exactly what was there.
  const original = {
    showModal: Object.getOwnPropertyDescriptor(proto, 'showModal'),
    close: Object.getOwnPropertyDescriptor(proto, 'close'),
  }

  beforeEach(() => {
    // jsdom has no top-layer support; mirror the open attribute instead.
    Object.defineProperty(proto, 'showModal', {
      configurable: true,
      value: function showModal(this: HTMLDialogElement) { this.setAttribute('open', '') },
    })
    Object.defineProperty(proto, 'close', {
      configurable: true,
      value: function close(this: HTMLDialogElement) { this.removeAttribute('open') },
    })
  })

  afterEach(() => {
    for (const key of ['showModal', 'close'] as const) {
      const descriptor = original[key]
      if (descriptor === undefined) Reflect.deleteProperty(proto, key)
      else Object.defineProperty(proto, key, descriptor)
    }
    delete (document as ViewTransitionDocument).startViewTransition
  })

  it('moves focus to the confirmation heading after submit so it is announced', () => {
    render(<ReserveDialog open onClose={() => undefined} />)
    submitEmail()

    const heading = screen.getByRole('heading', { name: "You're on the list." })
    expect(heading).toHaveAttribute('tabindex', '-1')
    expect(heading).toHaveFocus()
  })

  it('still lands focus on the heading when the swap runs in a view transition callback', async () => {
    // Real browsers run the callback asynchronously, after the submit handler returned.
    ;(document as ViewTransitionDocument).startViewTransition = (cb) => {
      void Promise.resolve().then(cb)
    }
    render(<ReserveDialog open onClose={() => undefined} />)
    submitEmail()
    expect(screen.queryByRole('heading', { name: "You're on the list." })).toBeNull()

    const heading = await screen.findByRole('heading', { name: "You're on the list." })
    await waitFor(() => { expect(heading).toHaveFocus() })
  })
})
