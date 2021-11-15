import { AddAccountRepository } from '../../../../data/protocols'
import { AccountModel } from '../../../../domain/models/AccountModel'
import { AddAccountModel } from '../../../../domain/usecases/AddAccount'
import { mongoHelper } from '../helpers/MongoHelper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = mongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne(accountData)
    return {
      id: insertedId.id.toString('hex'),
      ...accountData
    }
  }
}
