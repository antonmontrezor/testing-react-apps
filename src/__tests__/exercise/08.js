// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useCounter from '../../components/use-counter'

function TestedComponent() {
  const {count, increment, decrement} = useCounter()
  return (
    <div>
      <div>Current count: {count}</div>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
    </div>
  )
}

// this test has a good coverage of the useCounter functionality, but we could also add a test for the config like initialCount, step (check the hook)
test('exposes the count and increment/decrement functions', async () => {
  const user = userEvent.setup()
  render(<TestedComponent />)

  const message = screen.getByText(/current count/i)
  const increment = screen.getByRole('button', {name: /increment/i})
  const decrement = screen.getByRole('button', {name: /decrement/i})

  expect(message).toHaveTextContent('Current count: 0')
  await user.click(increment)
  expect(message).toHaveTextContent('Current count: 1')
  await user.click(decrement)
  expect(message).toHaveTextContent('Current count: 0')
})

test('exposes the count and increment/decrement functions with custom initial count and steps', async () => {
  const user = userEvent.setup()
  render(<TestedComponent />)
  screen.debug()

  const message = screen.getByText(/current count/i)
  const increment = screen.getByRole('button', {name: /increment/i})
  const decrement = screen.getByRole('button', {name: /decrement/i})

  expect(message).toHaveTextContent('Current count: 0')
  await user.click(increment)
  expect(message).toHaveTextContent('Current count: 1')
  await user.click(decrement)
  expect(message).toHaveTextContent('Current count: 0')
})

/* eslint no-unused-vars:0 */
