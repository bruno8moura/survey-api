import { AccountModel, AddAccount, AddAccountModel, HttpRequest, Validation } from './protocols'
import { MissingParamError, ServerError } from '../../errors'
import { badRequest, created } from '../../helpers/http-helper'
import { SignUpController } from '.'

interface SutTypes {
  sut: SignUpController
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

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub)

  return {
    sut,
    addAccount: addAccountStub,
    validation: validationStub,
    error: new Error('An Error!')
  }
}

describe('SignUp Controller', () => {
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

  test('should return 400 if Validation returns an error', async () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut, validation } = makeSut()
    const error = new MissingParamError('any_field')
    jest.spyOn(validation, 'validate').mockReturnValueOnce(error)

    const httpRequest = makeHttpRequest()
    httpRequest.body.email = 'any_email'

    const httpResponse = await sut.execute(httpRequest)

    expect(httpResponse).toEqual(badRequest({ error }))
  })
})
