// Avoid implementation details
// http://localhost:3000/counter

import * as React from 'react'
// 🐨 add `screen` to the import here:
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Counter from '../../components/counter'

test('counter increments and decrements when the buttons are clicked', async () => {
  // in new version we need to setup the userEvent
  const user = userEvent.setup()
  render(<Counter />)
  const increment = screen.getByRole('button', {name: /increment/i})
  const decrement = screen.getByRole('button', {name: /decrement/i})
  const message = screen.getByText(/current count/i)

  expect(message).toHaveTextContent('Current count: 0')
  // we should prefer using userEvent over fireEvent as if the event in implementattion changes from onClick to mouseUp, it won't break our tests
  await user.click(increment)
  expect(message).toHaveTextContent('Current count: 1')
  // in new version of userEvent, it's methods return promises that we have to handle
  await user.click(decrement)
  expect(message).toHaveTextContent('Current count: 0')
})
