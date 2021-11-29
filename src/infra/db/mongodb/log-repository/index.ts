import { LogErrorRepository } from '../../../../data/protocols/LogErrorRepository'
import { mongoHelper } from '../helpers/MongoHelper'

export class LogMongoRepository implements LogErrorRepository {
  async logError (error: Error): Promise<void> {
    const errorCollection = await mongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stack: error.stack,
      date: new Date()
    })
  }
}
