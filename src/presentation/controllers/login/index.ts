import { Authentication } from '../../../domain/protocols/usecases/Authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, created, serverError, unauthorized } from '../../helpers/http-helper'
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
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest({ error: new MissingParamError(field) })
        }
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest({ error: new InvalidParamError('email') })
      }

      const authToken = await this.authentication.auth({ email, password })
      if (!authToken.accessToken) {
        return unauthorized()
      }

      return created({})
    } catch (e: any) {
      return serverError({ error: e })
    }
  }
}
