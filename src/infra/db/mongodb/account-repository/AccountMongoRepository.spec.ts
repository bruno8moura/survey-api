import { AddAccountRepository } from '../../../../data/protocols'
import { mongoHelper } from '../helpers/MongoHelper'
import { AccountMongoRepository } from './AccountMongoRepository'

jest.setTimeout(30000)
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    // The lib @shelf/jest-mongodb sets the env var MONGO_URL
    await mongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    const accountCollection = await mongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  interface SutTypes {
    sut: AddAccountRepository
  }

  const makeSut = (): SutTypes => {
    const sut = new AccountMongoRepository()
    return {
      sut
    }
  }

  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const newAccount = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    const createdAccount = await sut.add(newAccount)
    expect(createdAccount).toBeTruthy() // No matter the value. It just have to exist.
    expect(createdAccount.id).toBeTruthy() // No matter the value. It just have to exist.
    expect(createdAccount.name).toBe(newAccount.name)
    expect(createdAccount.email).toBe(newAccount.email)
    expect(createdAccount.password).toBe(newAccount.password)
  })
})
