import { DbAddAccount } from '../../data/usecases/AddAccount/DbAddAccount'
import { BcryptAdapter } from '../../infra/criptography/BcryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/AccountMongoRepository'
import { SignUpController } from '../../presentation/controllers/signUp/SignUpController'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/EmailValidatorAdapter'
import { LogControllerDecorator } from '../decorators/Log'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository)

  const emailValidatorAdapter = new EmailValidatorAdapter()
  const controller = new SignUpController(emailValidatorAdapter, dbAddAccount)

  return new LogControllerDecorator(controller)
}
