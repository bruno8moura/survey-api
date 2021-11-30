import { EmailValidator, AccountModel, AddAccount, AddAccountModel } from '../../controllers/signUp/protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { badRequest, created } from '../../helpers/http-helper'
import { SignUpController } from './SignUpController'

interface SutTypes {
  sut: SignUpController
  emailValidator: EmailValidator
  addAccount: AddAccount
  error: Error
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }

      return await Promise.resolve(fakeAccount)
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

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidator: emailValidatorStub,
    addAccount: addAccountStub,
    error: new Error('An Error!')
  }
}

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', async () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.execute(httpRequest)

    expect(httpResponse).toEqual(badRequest({ error: new MissingParamError('name') }))
  })

  test('should return 400 if no email is provided', async () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.execute(httpRequest)

    expect(httpResponse).toEqual(badRequest({ error: new MissingParamError('email') }))
  })

  test('should return 400 if no password is provided', async () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.execute(httpRequest)

    expect(httpResponse).toEqual(badRequest({ error: new MissingParamError('password') }))
  })

  test('should return 400 if no passwordConfirmation is provided', async () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.execute(httpRequest)

    expect(httpResponse).toEqual(badRequest({ error: new MissingParamError('passwordConfirmation') }))
  })

  test('should return 400 if passwordConfirmation fails', async () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }

    const httpResponse = await sut.execute(httpRequest)

    expect(httpResponse).toEqual(badRequest({ error: new InvalidParamError('passwordConfirmation') }))
  })

  test('should return 400 if invalid email is provided', async () => {
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

    const httpResponse = await sut.execute(httpRequest)

    // O toBe compara o ponteiro dos objetos. Ou seja os objetos tem que ser identicos.
    expect(httpResponse).toEqual(badRequest({ error: new InvalidParamError('email') }))
  })

  test('should call EmailValidator with correct email', async () => {
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

    await sut.execute(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidator, error } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new ServerError(error)
    })

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const promise = sut.execute(httpRequest)

    // O toBe compara o ponteiro dos objetos. Ou seja os objetos tem que ser identicos.
    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccount with correct values', async () => {
    const { sut, addAccount } = makeSut()
    const addSpy = jest.spyOn(addAccount, 'add')

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.execute(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('should return 500 if AddAccount throws', async () => {
    const { sut, addAccount, error } = makeSut()
    jest.spyOn(addAccount, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(new ServerError(error))
    })

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const promise = sut.execute(httpRequest)

    await expect(promise).rejects.toThrow()
  })

  test('should return 201 if valid data is provided', async () => {
    // System Under Test - identifica quem está sendo testado.
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual(created({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }))
  })
})
