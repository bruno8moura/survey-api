import { AddAccountRepository } from '../../../../data/protocols'
import { AccountModel } from '../../../../domain/protocols/models/AccountModel'
import { AddAccountModel } from '../../../../domain/protocols/usecases/AddAccount'
import { mongoHelper } from '../helpers/MongoHelper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = mongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne(accountData)
    return mongoHelper.modelMap({ data: accountData, objectId: insertedId })
  }
}
