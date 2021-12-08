import { LoginController } from '.'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { Authentication, AuthenticationParams, AuthToken, HttpRequest, Validation } from './protocols'

interface SutTypes {
  sut: LoginController
  validationStub: Validation
  authenticationStub: Authentication
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return undefined
    }
  }

  return new ValidationStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (params: AuthenticationParams): Promise<AuthToken> {
      return { accessToken: 'any_token' }
    }
  }

  return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController({ validation: validationStub, authentication: authenticationStub })

  return { sut, validationStub, authenticationStub }
}

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const error = new MissingParamError('email')
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValue(error)
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.execute(httpRequest)
    const aBadRequest = badRequest({ error })
    expect(httpResponse).toEqual(aBadRequest)
  })

  test('should return 400 if no password is provided', async () => {
    const error = new MissingParamError('password')
    const { sut, validationStub } = makeSut()
    const httpRequest = makeHttpRequest()
    jest.spyOn(validationStub, 'validate').mockReturnValue(error)

    const httpResponse = await sut.execute(httpRequest)
    const aBadRequest = badRequest({ error })
    expect(httpResponse).toEqual(aBadRequest)
  })

  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const isValidSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeHttpRequest()

    await sut.execute(httpRequest)

    const { body } = httpRequest
    expect(isValidSpy).toHaveBeenCalledWith(body)
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => new InvalidParamError('email'))
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual(badRequest({
      error: new InvalidParamError('email')
    }))
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, validationStub } = makeSut()

    const anError = new Error()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => { throw anError })
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual(serverError({ error: anError }))
  })

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeHttpRequest()

    await sut.execute(httpRequest)
    const { body: { email, password } } = httpRequest
    const authenticationParams = { email, password }
    expect(authSpy).toHaveBeenCalledWith(authenticationParams)
  })

  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async ({ email, password }): Promise<AuthToken> => ({ accessToken: undefined }))
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()

    const anError = new Error()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => { throw anError })
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual(serverError({ error: anError }))
  })

  test('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual(ok(httpResponse.body))
  })
})
