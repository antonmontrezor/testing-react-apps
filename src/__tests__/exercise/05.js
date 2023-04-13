// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
// import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {handlers} from 'test/server-handlers'
import renderer from 'react-test-renderer'
import Login from '../../components/login-submission'
import LoginSubmission from '../../components/login-submission'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

const server = setupServer(...handlers)

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

test(`logging in displays the user's username`, async () => {
  render(<Login />)
  const {username, password} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.type(screen.getByLabelText(/password/i), password)
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(screen.getByLabelText(/loading/i))
  expect(screen.getByText(username)).toBeInTheDocument()
})

test('logging with missing password displays an error message', async () => {
  render(<LoginSubmission />)
  const {username} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/username/i), username)
  // not filling out the password field
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(screen.getByLabelText(/loading/i))

  // here we have a snapshot check, so if the error meassage changes for this failure, we'll be able to catpture it
  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"password required"`,
  )
})
