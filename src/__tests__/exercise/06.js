// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from 'react'
import {render, screen, act} from '@testing-library/react'
import Location from '../../examples/location'

beforeAll(() => {
  // run the following lines of code before all tests
  window.navigator.geolocation = {
    getCurrentPosition: jest.fn(),
  }
})

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

test('displays the users current location', async () => {
  const fakePosition = {
    coords: {
      latitude: 12,
      longitude: 19,
    },
  }

  const {promise, resolve} = deferred()

  // the location component uses useCurrentPosition hook that esentially calls getCurrentPosition like so:
  // navigator.geolocation.getCurrentPosition(function (position) {
  //   if (!canceled) {
  //     setPosition(position);
  //   }
  // }, function (error) {
  //   if (!canceled) {
  //     setError(error);
  //   }
  // }, options);

  window.navigator.geolocation.getCurrentPosition.mockImplementation(
    callback => {
      promise.then(() => callback(fakePosition))
    },
  )

  render(<Location />)
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  await act(async () => {
    resolve()
    await promise
  })
  screen.debug()

  // we are not using getByLabelText since it throw an error if it cannot find an element, but queryByLabelText doesn't
  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()

  expect(screen.getByText(/latitude/i)).toHaveTextContent(
    `Latitude: ${fakePosition.coords.latitude}`,
  )
  expect(screen.getByText(/longitude/i)).toHaveTextContent(
    `Longitude: ${fakePosition.coords.longitude}`,
  )

})

/*
eslint
  no-unused-vars: "off",
*/
