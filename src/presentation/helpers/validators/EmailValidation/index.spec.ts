import { EmailValidation } from '.'
import { InvalidParamError } from '../../../errors'
import { EmailValidator } from '../../../protocols'
import { Validation } from '../Validation'

interface SutTypes {
  sut: Validation
  emailValidator: EmailValidator
  fieldName: string
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
  const emailValidator = makeEmailValidator()
  const fieldName = 'email'
  const sut = new EmailValidation(fieldName, emailValidator)

  return {
    sut,
    emailValidator,
    fieldName
  }
}

const makeSutEmailValidatorIsUndefined = (): SutTypes => {
  const emailValidator = undefined
  const fieldName = 'email'
  const sut = new EmailValidation(fieldName, emailValidator)

  return {
    sut,
    emailValidator,
    fieldName
  }
}

interface EmailValidatorParams {
  email: string
}

const makeEmailValidatorParams = (): EmailValidatorParams => ({
  email: 'valid_email@mail.com'
})

describe('Email Validation', () => {
  test('should return an InvalidParamError if invalid email is provided', () => {
    const { sut, emailValidator, fieldName } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockReturnValue(false)

    const { email } = makeEmailValidatorParams()

    const sutResponse = sut.validate({ email })

    expect(sutResponse).toEqual(new InvalidParamError(fieldName))
  })

  test('should call EmailValidator with correct email', () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut, emailValidator } = makeSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    const { email } = makeEmailValidatorParams()

    sut.validate({ email })

    expect(isValidSpy).toHaveBeenCalledWith(email)
  })

  test('should throw if EmailValidator throws', async () => {
    const { sut, emailValidator } = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => { throw new Error('An error!') })

    try {
      sut.validate(makeEmailValidatorParams())
    } catch (error) {
      expect(sut.validate).toThrow()
    }
  })

  test('should throw if EmailValidator is undefined', async () => {
    const { sut } = makeSutEmailValidatorIsUndefined()

    try {
      sut.validate(makeEmailValidatorParams())
    } catch (error) {
      expect(sut.validate).toThrow()
    }
  })
})
