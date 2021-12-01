import { LoginController } from '.'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const sut = new LoginController()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.execute(httpRequest)
    const aBadRequest = badRequest({ error: new MissingParamError('email') })
    expect(httpResponse).toEqual(aBadRequest)
  })

  test('should return 400 if no password is provided', async () => {
    const sut = new LoginController()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    const httpResponse = await sut.execute(httpRequest)
    const aBadRequest = badRequest({ error: new MissingParamError('password') })
    expect(httpResponse).toEqual(aBadRequest)
  })
})
