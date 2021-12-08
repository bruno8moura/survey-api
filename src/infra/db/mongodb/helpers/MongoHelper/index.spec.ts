import { mongoHelper as sut } from '.'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()

    await sut.disconnect()
    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })

  test('should return field "id" instead of "_id"', async () => {
    const accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    const newJson = {
      a: '1'
    }
    await accountCollection.insertOne(newJson)
    const modeledNewJson = sut.modelMap({ data: newJson })
    expect(modeledNewJson).toEqual({ id: modeledNewJson.id, a: newJson.a })
  })
})
