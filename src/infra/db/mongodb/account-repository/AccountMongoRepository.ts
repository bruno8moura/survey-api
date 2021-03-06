import { AddAccountRepository } from '../../../../data/protocols'
import { AccountModel } from '../../../../domain/protocols/models/AccountModel'
import { AddAccountModel } from '../../../../domain/protocols/usecases/AddAccount'
import { mongoHelper } from '../helpers/MongoHelper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await mongoHelper.getCollection('accounts')
    await accountCollection.insertOne(accountData)
    return mongoHelper.modelMap({ data: accountData })
  }
}
