import { AuthToken } from '../../../domain/protocols/models/AuthToken'
import { Authentication, AuthenticationModel } from '../../../domain/protocols/usecases/Authentication'
import { LoadAccountByEmailRepository } from '../../protocols/LoadAccountByEmailRepository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmail: LoadAccountByEmailRepository
  constructor (loadAccountByEmail: LoadAccountByEmailRepository) {
    this.loadAccountByEmail = loadAccountByEmail
  }

  async auth (params: AuthenticationModel): Promise<AuthToken> {
    await this.loadAccountByEmail.load(params.email)
    return null
  }
}
