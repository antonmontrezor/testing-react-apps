// form testing
// http://localhost:3000/login

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import faker from 'faker'
import {build, perBuild} from '@jackfranklin/test-data-bot'
import Login from '../../components/login'

// overrides gives a chance to communicate better what speecific values tests require
// function buildLoginForm(overrides) {
//   return {
//     username: faker.internet.userName(),
//     password: faker.internet.password(),
//     ...overrides
//   }

// }

// this factory function is more flexible than the one before as it comes from the package
const buildLoginForm = build({
  fields: {
    username: perBuild(() => faker.internet.userName()),
    password: perBuild(() => faker.internet.password()),
  }
})

test('submitting the form calls onSubmit with username and password', async () => {
  const user = userEvent.setup()

  // this is the powerful feature as we can use multiple implementations available like mockImplementation and mockReturnValue and many more
  // now, it doesn't matter what this function does, what matters is what it's called with
  const handleSubmit = jest.fn()

  render(<Login onSubmit={handleSubmit} />)
  // const {username, password} = buildLoginForm({password: 'abc'})
  // const {username, password} = buildLoginForm()

  const {username, password} = buildLoginForm()

  await user.type(screen.getByLabelText(/username/i), username)
  await user.type(screen.getByLabelText(/password/i), password)
  await user.click(screen.getByRole('button', {name: /submit/i}))

  expect(handleSubmit).toHaveBeenCalledWith({username, password})
  expect(handleSubmit).toHaveBeenCalledTimes(1)
})

/*
eslint
  no-unused-vars: "off",
*/
