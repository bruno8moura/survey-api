import { DbAddAccount } from './DbAddAccount'
import { AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from './protocols'

const makeFakeAddAccount = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeFakeAccountModel = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password'
})

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepoStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }

  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccountModel()
      return await Promise.resolve(fakeAccount)
    }
  }

  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepoStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepoStub)

  return {
    sut,
    encrypterStub,
    addAccountRepoStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = makeFakeAddAccount()

    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('should throw Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = makeFakeAddAccount()

    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepoStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepoStub, 'add')
    const accountData = makeFakeAddAccount()

    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      ...makeFakeAddAccount(),
      password: 'hashed_password'
    })
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, addAccountRepoStub } = makeSut()
    jest.spyOn(addAccountRepoStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = makeFakeAddAccount()

    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = makeFakeAddAccount()

    const account = await sut.add(accountData)
    expect(account).toEqual(makeFakeAccountModel())
  })
})
