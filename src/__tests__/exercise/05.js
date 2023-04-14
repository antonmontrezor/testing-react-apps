// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {handlers} from 'test/server-handlers'
import Login from '../../components/login-submission'

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

// clears handlers after each test
afterEach(() => {
  server.resetHandlers()
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

test('ommiting the password results in an error', async () => {
  render(<Login />)
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

test('unknown server error displays the error message', async () => {
  // we specify that this error message we expect to get on line 84
  const testErrorMessage = 'Oh no, something went wrong'
  server.use(
    rest.post(
      'https://auth-provider.example.com/api/login',
      async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({message: testErrorMessage}))
      },
    ),
  )

  render(<Login />)
  // we don't care about typing into any inputs
  // const {username, password} = buildLoginForm()

  // await userEvent.type(screen.getByLabelText(/username/i), username)
  // await userEvent.type(screen.getByLabelText(/password/i), password)
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(screen.getByLabelText(/loading/i))
  expect(screen.getByRole('alert')).toHaveTextContent(testErrorMessage)
})
