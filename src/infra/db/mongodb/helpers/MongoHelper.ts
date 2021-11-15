import { Collection, MongoClient, ObjectId } from 'mongodb'
interface MapperProps {
  objectId: ObjectId
  data: any
}
class MongoHelper {
  private client: MongoClient

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  }

  async disconnect (): Promise<void> {
    await this.client.close()
  }

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  }

  modelMap ({ objectId, data }: MapperProps): any {
    return {
      id: objectId.id.toString('hex'),
      ...data
    }
  }
}

const mongoHelper = new MongoHelper()

export { mongoHelper }
