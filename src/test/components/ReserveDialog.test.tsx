import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ReserveDialog from '../../components/ReserveDialog'

describe('ReserveDialog confirmation', () => {
  beforeEach(() => {
    // jsdom has no top-layer support; mirror the open attribute instead.
    HTMLDialogElement.prototype.showModal = function showModal() { this.setAttribute('open', '') }
    HTMLDialogElement.prototype.close = function close() { this.removeAttribute('open') }
  })

  it('moves focus to the confirmation heading after submit so it is announced', () => {
    render(<ReserveDialog open onClose={() => undefined} />)
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Reserve your Aura' }))

    const heading = screen.getByRole('heading', { name: "You're on the list." })
    expect(heading).toHaveAttribute('tabindex', '-1')
    expect(heading).toHaveFocus()
  })
})
