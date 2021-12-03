import { LoginController } from '.'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { EmailValidator, HttpRequest } from '../../protocols'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
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

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController({ emailValidator: emailValidatorStub })

  return { sut, emailValidatorStub }
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
})
