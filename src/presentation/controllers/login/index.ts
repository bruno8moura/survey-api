import { Authentication } from '../../../domain/protocols/usecases/Authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, created, serverError } from '../../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'
interface LoginControllerParams{
  emailValidator: EmailValidator
  authentication: Authentication
}
export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication
  constructor ({ emailValidator, authentication }: LoginControllerParams) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async execute (request: HttpRequest): Promise<HttpResponse> {
    const { body: { email, password } } = request
    try {
      if (!email) {
        return badRequest({ error: new MissingParamError('email') })
      }

      if (!password) {
        return badRequest({ error: new MissingParamError('password') })
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest({ error: new InvalidParamError('email') })
      }

      await this.authentication.auth({ email, password })

      return created({})
    } catch (e: any) {
      return serverError({ error: e })
    }
  }
}
