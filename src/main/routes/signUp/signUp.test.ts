import request from 'supertest'
import { mongoHelper } from '../../../infra/db/mongodb/helpers/MongoHelper'
import app from '../../config/app'

describe('SignUp routes', () => {
  beforeAll(async () => {
    // The lib @shelf/jest-mongodb sets the env var MONGO_URL
    await mongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    const accountCollection = mongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })
  test('should return 201 when create a new account', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      })
      .expect(201)
  })
})
