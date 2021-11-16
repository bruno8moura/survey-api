import { DbAddAccount } from '../../data/usecases/AddAccount/DbAddAccount'
import { BcryptAdapter } from '../../infra/criptography/BcryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/AccountMongoRepository'
import { SignUpController } from '../../presentation/controllers/signUp/SignUpController'
import { EmailValidatorAdapter } from '../../utils/EmailValidatorAdapter'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository)

  const emailValidatorAdapter = new EmailValidatorAdapter()
  return new SignUpController(emailValidatorAdapter, dbAddAccount)
}
