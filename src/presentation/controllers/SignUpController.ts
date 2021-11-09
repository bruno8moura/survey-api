import { HttpRequest, HttpResponse, Controller } from '../protocols'
import { badRequest, serverError } from '../helpers/http-helper'
import { EmailValidator } from '../protocols/EmailValidator'
import { InvalidParamError, MissingParamError } from '../errors'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  execute (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest({ error: new MissingParamError(field) })
        }
      }

      const { body: { password, passwordConfirmation } } = httpRequest
      if (password !== passwordConfirmation) {
        return badRequest({ error: new InvalidParamError('passwordConfirmation') })
      }

      const { body: { email } } = httpRequest
      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest({ error: new InvalidParamError('email') })
      }
    } catch (error) {
      return serverError()
    }
  }
}
