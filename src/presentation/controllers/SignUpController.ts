import { MissingParamError } from '../errors/missing-param-error'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/EmailValidator'
import { InvalidParamError } from '../errors/InvalidParamError'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  execute (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest({ error: new MissingParamError(field) })
      }
    }
    const { body: { email } } = httpRequest
    const isValidEmail = this.emailValidator.isValid(email)
    if (!isValidEmail) {
      return badRequest({ error: new InvalidParamError('email') })
    }
  }
}
