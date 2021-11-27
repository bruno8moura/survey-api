import { Collection, MongoClient, ObjectId } from 'mongodb'
interface MapperProps {
  objectId: ObjectId
  data: any
}

class MongoHelper {
  private client: MongoClient
  private uri: string

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  }

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  }

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri)
    }

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
