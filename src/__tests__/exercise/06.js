// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from 'react'
import {render, screen, act} from '@testing-library/react'
import {useCurrentPosition} from 'react-use-geolocation'
import Location from '../../examples/location'

// it'll create for function exports of this module a jest mock functions
jest.mock('react-use-geolocation')

test('displays the users current location', async () => {
  const fakePosition = {
    coords: {
      latitude: 12,
      longitude: 19,
    },
  }

  let setReturnValue
  function useMockCurrentPosition() {
    const state = React.useState([])

    setReturnValue = state[1]
    return state[0]
  }

  useCurrentPosition.mockImplementation(useMockCurrentPosition)

  render(<Location />)
  // if the hook we're mocking useCurrentPosition got called with any ars, we would check if was called with those
  // const [position, error] = useCurrentPosition('args')
  // expect(useCurrentPosition).toHaveBeenCalledWith('args')
  // here's no need to check how many times useCurrentPosition was called since we con't know how many times it would be called by React, and that's fine
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  act(() => {
    setReturnValue([fakePosition])
  })

  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
  expect(screen.getByText(/latitude/i)).toHaveTextContent(
    `Latitude: ${fakePosition.coords.latitude}`,
  )
  expect(screen.getByText(/longitude/i)).toHaveTextContent(
    `Longitude: ${fakePosition.coords.longitude}`,
  )
})

test('displays an error message', async () => {
  // specify that we are looking for this particular error message
  const errorMessage = 'Something went wrong'
  let setError
  function useMockCurrentPosition() {
    const [state, setState] = React.useState([null, null])

    setError = setState
    return state
  }

  useCurrentPosition.mockImplementation(useMockCurrentPosition)

  render(<Location />)
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  act(() => {
    setError([null, {message: errorMessage}])
  })

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"Something went wrong"`,
  )
})

/*
eslint
  no-unused-vars: "off",
*/
