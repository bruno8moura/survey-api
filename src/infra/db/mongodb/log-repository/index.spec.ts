import { Collection } from 'mongodb'
import { LogMongoRepository } from '.'
import { mongoHelper } from '../helpers/MongoHelper'

describe('Account Mongo Repository', () => {
  let errorCollection: Collection
  beforeAll(async () => {
    // The lib @shelf/jest-mongodb sets the env var MONGO_URL
    await mongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await mongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('should create an error log on success', async () => {
    const sut = new LogMongoRepository()
    await sut.logError(new Error())
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
