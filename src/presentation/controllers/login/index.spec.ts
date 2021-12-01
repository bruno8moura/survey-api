import { LoginController } from '.'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { EmailValidator } from '../../protocols'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

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
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    const httpResponse = await sut.execute(httpRequest)
    const aBadRequest = badRequest({ error: new MissingParamError('password') })
    expect(httpResponse).toEqual(aBadRequest)
  })

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    await sut.execute(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
