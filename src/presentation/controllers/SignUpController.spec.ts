import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols/EmailValidator'
import { SignUpController } from './SignUpController'

interface SutTypes {
  sut: SignUpController
  emailValidator: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)

  return {
    sut,
    emailValidator: emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.execute(httpRequest)

    // O toBe compara o ponteiro dos objetos. Ou seja os objetos tem que ser identicos.
    expect(httpResponse.statusCode).toBe(400)

    // O 'toEqual' compara apenas os valores do objeto.
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.execute(httpRequest)

    // O toBe compara o ponteiro dos objetos. Ou seja os objetos tem que ser identicos.
    expect(httpResponse.statusCode).toBe(400)

    // O 'toEqual' compara apenas os valores do objeto.
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.execute(httpRequest)

    // O toBe compara o ponteiro dos objetos. Ou seja os objetos tem que ser identicos.
    expect(httpResponse.statusCode).toBe(400)

    // O 'toEqual' compara apenas os valores do objeto.
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 400 if no passwordConfirmation is provided', () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }

    const httpResponse = sut.execute(httpRequest)

    // O toBe compara o ponteiro dos objetos. Ou seja os objetos tem que ser identicos.
    expect(httpResponse.statusCode).toBe(400)

    // O 'toEqual' compara apenas os valores do objeto.
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('should return 400 if invalid email is provided', () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut, emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockReturnValue(false)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.execute(httpRequest)

    // O toBe compara o ponteiro dos objetos. Ou seja os objetos tem que ser identicos.
    expect(httpResponse.statusCode).toBe(400)

    // O 'toEqual' compara apenas os valores do objeto.
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should call EmailValidator with correct email', () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut, emailValidator } = makeSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid').mockReturnValue(false)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    sut.execute(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 500 if EmailValidator throws', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }

    const emailValidator = new EmailValidatorStub()
    const sut = new SignUpController(emailValidator)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.execute(httpRequest)

    // O toBe compara o ponteiro dos objetos. Ou seja os objetos tem que ser identicos.
    expect(httpResponse.statusCode).toBe(500)

    // O 'toEqual' compara apenas os valores do objeto.
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
