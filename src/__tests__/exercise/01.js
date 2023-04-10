// simple test with ReactDOM
// http://localhost:3000/counter

import * as React from 'react'
import {act} from 'react-dom/test-utils'
import {createRoot} from 'react-dom/client'
import ReactDOM from 'react-dom'
import Counter from '../../components/counter'

// NOTE: this is a new requirement in React 18
// https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment
// Luckily, it's handled for you by React Testing Library :)
global.IS_REACT_ACT_ENVIRONMENT = true

// check line 90 for explanation
beforeEach(() => {
  document.body.innerHTML = ''
})

test('counter increments and decrements when the buttons are clicked', () => {
  // const div = document.createElement('div')
  // document.body.append(div)

  // ReactDOM.render(<Counter />, div)

  // const message = div.firstChild.querySelector('div')
  // expect(message.textContent).toBe('Current count: 0')

  // const [decrement, increment] = div.querySelectorAll('button')

  // increment.click()
  // expect(message.textContent).toBe('Current count: 1')
  // decrement.click()
  // expect(message.textContent).toBe('Current count: 0')

  const div = document.createElement('div')
  document.body.append(div)

  act(() => createRoot(div).render(<Counter />))

  const message = div.firstChild.querySelector('div')
  expect(message.textContent).toBe('Current count: 0')

  const [decrement, increment] = div.querySelectorAll('button')
  const incrementClickEvent = new MouseEvent('click', {
    // in general it's necessary for event delegation
    //The idea is that if we have a lot of elements handled in a similar way, then instead of assigning a handler to each of them – we put a single handler on their common ancestor.
    // In the handler we get event.target to see where the event actually happened and handle it.
    bubbles: true,
    cancelable: true,
    button: 0,
  })

  act(() => increment.dispatchEvent(incrementClickEvent))
  expect(message.textContent).toBe('Current count: 1')
  const decrementClickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    button: 0,
  })
  act(() => decrement.dispatchEvent(decrementClickEvent))
  expect(message.textContent).toBe('Current count: 0')

  // 🦉 If you don't cleanup, then it could impact other tests and/or cause a memory leak
  // so it's important to cleanup after each of our tests. However, if there's an error prior to next line, it can still mess with future tests.
  // So it's better to use beforeEach() form Jest
  // div.remove()
})

test('counter increments and decrements when the buttons are clicked', () => {
  // const div = document.createElement('div')
  // document.body.append(div)

  // ReactDOM.render(<Counter />, div)

  // const message = div.firstChild.querySelector('div')
  // expect(message.textContent).toBe('Current count: 0')

  // const [decrement, increment] = div.querySelectorAll('button')

  // increment.click()
  // expect(message.textContent).toBe('Current count: 1')
  // decrement.click()
  // expect(message.textContent).toBe('Current count: 0')

  const div = document.createElement('div')
  document.body.append(div)

  act(() => createRoot(div).render(<Counter />))

  const message = div.firstChild.querySelector('div')
  expect(message.textContent).toBe('Current count: 0')

  // if no clean up on line 15 for the previous test,  const [decrement, increment] = document.querySelectorAll('button') will be getting the counter from previous test making the current fail
  const [decrement, increment] = div.querySelectorAll('button')

  act(() => increment.click())
  expect(message.textContent).toBe('Current count: 1')
  act(() => decrement.click())
  expect(message.textContent).toBe('Current count: 0')


  // 🦉 If you don't cleanup, then it could impact other tests and/or cause a memory leak
  // so it's important to cleanup after each of our tests. However, if there's an error prior to next line, it can still mess with future tests.
  // So it's better to use beforeEach() form Jest
  // div.remove()
})
/* eslint no-unused-vars:0 */
