import { AccountModel } from '../../domain/protocols/models/AccountModel'
import { AddAccountModel } from '../../domain/protocols/usecases/AddAccount'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
