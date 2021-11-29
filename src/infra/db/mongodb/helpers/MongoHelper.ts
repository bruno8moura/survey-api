import { Collection, MongoClient } from 'mongodb'
interface MapperProps {
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

  modelMap ({ data }: MapperProps): any {
    const dataClone = { ...data }
    delete dataClone._id
    return {
      id: data._id,
      ...dataClone
    }
  }
}

const mongoHelper = new MongoHelper()

export { mongoHelper }
