import { LoginController } from '.'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { Authentication, AuthenticationParams, AuthToken, EmailValidator, HttpRequest } from './protocols'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
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
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController({ emailValidator: emailValidatorStub, authentication: authenticationStub })

  return { sut, emailValidatorStub, authenticationStub }
}

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    delete httpRequest.body.email

    const httpResponse = await sut.execute(httpRequest)
    const aBadRequest = badRequest({ error: new MissingParamError('email') })
    expect(httpResponse).toEqual(aBadRequest)
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    delete httpRequest.body.password

    const httpResponse = await sut.execute(httpRequest)
    const aBadRequest = badRequest({ error: new MissingParamError('password') })
    expect(httpResponse).toEqual(aBadRequest)
  })

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeFakeRequest()

    await sut.execute(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => false)
    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual(badRequest({
      error: new InvalidParamError('email')
    }))
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const anError = new Error()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw anError })
    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual(serverError({ error: anError }))
  })

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeFakeRequest()

    await sut.execute(httpRequest)
    const { body: { email, password } } = httpRequest
    const authenticationParams = { email, password }
    expect(authSpy).toHaveBeenCalledWith(authenticationParams)
  })

  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async ({ email, password }): Promise<AuthToken> => ({ accessToken: undefined }))
    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()

    const anError = new Error()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => { throw anError })
    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual(serverError({ error: anError }))
  })

  test('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual(ok(httpResponse.body))
  })
})
