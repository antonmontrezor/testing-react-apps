// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {render, act, renderHook} from '@testing-library/react'
import useCounter from '../../components/use-counter'

// (...args) because we can call setup with multiple arguments
function setup(...args) {
  const returnVal = {}
  function TestComponent() {
    Object.assign(returnVal, useCounter(...args))
    return null
  }

  render(<TestComponent />)
  return returnVal
}

// this test has a good coverage of the useCounter functionality, but we could also add a test for the config like initialCount, step (check the hook)
test('exposes the count and increment/decrement functions', () => {
  // we cannot destructure as we need to keep the binding to what useCounter returns like count, increment, decrement. we are just updating properties on the same object
  const returnVal = setup()

  expect(returnVal.count).toBe(0)
  act(() => {
    returnVal.increment()
  })
  expect(returnVal.count).toBe(1)
  act(() => {
    returnVal.decrement()
  })
  expect(returnVal.count).toBe(0)
})

test('allows customization of the initial count', async () => {
  const returnVal = setup({initialCount: 2})

  expect(returnVal.count).toBe(2)
  act(() => {
    returnVal.increment()
  })
  expect(returnVal.count).toBe(3)
  act(() => {
    returnVal.decrement()
  })
  expect(returnVal.count).toBe(2)
})

test('allows customization of the step', async () => {
  const returnVal = setup({step: 2})

  expect(returnVal.count).toBe(0)
  act(() => {
    returnVal.increment()
  })
  expect(returnVal.count).toBe(2)
  act(() => {
    returnVal.decrement()
  })
  expect(returnVal.count).toBe(0)
})

test('exposes the count and increment/decrement functions with custom initial count and steps', async () => {
  const {result} = renderHook(() => useCounter({initialCount: 2, step: 2}))

  expect(result.current.count).toBe(2)
  act(() => {
    result.current.increment()
  })
  expect(result.current.count).toBe(4)
  act(() => {
    result.current.decrement()
  })
  expect(result.current.count).toBe(2)
})

// the same test as the 1st one but with renderHook
test('exposes the count and increment/decrement functions', () => {
  const {result} = renderHook(useCounter)

  expect(result.current.count).toBe(0)
  act(() => {
    result.current.increment()
  })
  expect(result.current.count).toBe(1)
  act(() => {
    result.current.decrement()
  })
  expect(result.current.count).toBe(0)
})

test('step can change', () => {
  const {result, rerender} = renderHook(useCounter)

  expect(result.current.count).toBe(0)
  act(() => {
    result.current.increment()
  })
  expect(result.current.count).toBe(1)

  rerender({step: 5})
  
  act(() => {
    result.current.decrement()
  })
  expect(result.current.count).toBe(-4)
})
/* eslint no-unused-vars:0 */
