import { AccountModel } from '../usecases/AddAccount/protocols'

export interface LoadAccountByEmailRepository {
  load: (email: string) => Promise<AccountModel>
}
