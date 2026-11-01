import { render, screen } from '@testing-library/react'
import Newsletter from '@/themes/opc/Newsletter'

jest.mock('styled-jsx/style', () => () => null)

it('does not expose a subscription form before a real account and form are configured', () => {
  const { container, rerender } = render(<Newsletter />)
  expect(container).toBeEmptyDOMElement()
  rerender(<Newsletter formUrl='https://example.com/form' />)
  expect(container).toBeEmptyDOMElement()
  rerender(<Newsletter formUrl='javascript:alert(1)' />)
  expect(container).toBeEmptyDOMElement()
})

it('places the configured provider form in the approved newsletter section', () => {
  const formUrl = 'https://preview.mailerlite.io/forms/123/456/share'
  const { unmount } = render(<Newsletter formUrl={formUrl} />)
  expect(screen.getByRole('region')).toHaveAttribute('id', 'newsletter')
  expect(screen.getByTitle('Klarraum Newsletter – E-Mail-Anmeldung')).toHaveAttribute('src', formUrl)
  unmount()
  render(<Newsletter formUrl={formUrl} />)
  expect(screen.getByTitle('Klarraum Newsletter – E-Mail-Anmeldung')).toHaveAttribute('src', formUrl)
})
