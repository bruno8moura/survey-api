import { DbAddAccount } from '../../../data/usecases/AddAccount'
import { BcryptAdapter } from '../../../infra/criptography/BcryptAdapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository'
import { SignUpController } from '../../../presentation/controllers/signUp'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/Log'
import { makeSignUpValidation } from '../signUpValidation'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository)

  const validationComposite = makeSignUpValidation()
  const controller = new SignUpController(dbAddAccount, validationComposite)

  return new LogControllerDecorator(controller, new LogMongoRepository())
}
