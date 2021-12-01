import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, created } from '../../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'
interface LoginControllerParams{
  emailValidator: EmailValidator
}
export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor ({ emailValidator }: LoginControllerParams) {
    this.emailValidator = emailValidator
  }

  async execute (request: HttpRequest): Promise<HttpResponse> {
    if (!request.body.email) {
      return badRequest({ error: new MissingParamError('email') })
    }

    if (!request.body.password) {
      return badRequest({ error: new MissingParamError('password') })
    }

    if (!this.emailValidator.isValid(request.body.email)) {
      return badRequest({ error: new InvalidParamError('email') })
    }

    return created({})
  }
}
