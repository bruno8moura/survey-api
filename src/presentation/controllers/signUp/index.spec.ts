import { EmailValidator, AccountModel, AddAccount, AddAccountModel, HttpRequest, Validation } from './protocols'
import { InvalidParamError, ServerError } from '../../errors'
import { badRequest, created } from '../../helpers/http-helper'
import { SignUpController } from '.'

interface SutTypes {
  sut: SignUpController
  emailValidator: EmailValidator
  addAccount: AddAccount
  validation: Validation
  error: Error
}
interface GenericObject {
  id: string
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

const makeGenericObject = (): GenericObject => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  passwordConfirmation: 'valid_password'
})

const makeHttpRequest = (): HttpRequest => {
  const { name, email, password, passwordConfirmation } = makeGenericObject()

  return { body: { name, email, password, passwordConfirmation } }
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const { id, email, name, password } = makeGenericObject()

      return { id, email, name, password }
    }
  }

  return new AddAccountStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub)

  return {
    sut,
    emailValidator: emailValidatorStub,
    addAccount: addAccountStub,
    validation: validationStub,
    error: new Error('An Error!')
  }
}

describe('SignUp Controller', () => {
  test('should return 400 if passwordConfirmation fails', async () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    httpRequest.body.passwordConfirmation = 'invalid_password'

    const httpResponse = await sut.execute(httpRequest)

    expect(httpResponse).toEqual(badRequest({ error: new InvalidParamError('passwordConfirmation') }))
  })

  test('should return 400 if invalid email is provided', async () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut, emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockReturnValue(false)

    const httpRequest = makeHttpRequest()
    httpRequest.body.email = 'any_email'

    const httpResponse = await sut.execute(httpRequest)

    // O toBe compara o ponteiro dos objetos. Ou seja os objetos tem que ser identicos.
    expect(httpResponse).toEqual(badRequest({ error: new InvalidParamError('email') }))
  })

  test('should call EmailValidator with correct email', async () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut, emailValidator } = makeSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid').mockReturnValue(false)

    const httpRequest = makeHttpRequest()

    await sut.execute(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidator, error } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new ServerError(error)
    })

    const httpRequest = makeHttpRequest()

    const promise = sut.execute(httpRequest)

    // O toBe compara o ponteiro dos objetos. Ou seja os objetos tem que ser identicos.
    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccount with correct values', async () => {
    const { sut, addAccount } = makeSut()
    const addSpy = jest.spyOn(addAccount, 'add')

    const httpRequest = makeHttpRequest()

    await sut.execute(httpRequest)
    const { body: { name, email, password } } = httpRequest
    expect(addSpy).toHaveBeenCalledWith({
      name,
      email,
      password
    })
  })

  test('should return 500 if AddAccount throws', async () => {
    const { sut, addAccount, error } = makeSut()
    jest.spyOn(addAccount, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(new ServerError(error))
    })

    const httpRequest = makeHttpRequest()

    const promise = sut.execute(httpRequest)

    await expect(promise).rejects.toThrow()
  })

  test('should return 201 if valid data is provided', async () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.execute(httpRequest)

    const { id, name, email, password } = makeGenericObject()
    expect(httpResponse).toEqual(created({
      id,
      name,
      email,
      password
    }))
  })

  test('should call Validation with correct values', async () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut, validation } = makeSut()
    const validateSpy = jest.spyOn(validation, 'validate')

    const httpRequest = makeHttpRequest()

    await sut.execute(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
