import { HttpRequest, HttpResponse, Controller } from '../protocols'
import { badRequest, serverError } from '../helpers/http-helper'
import { EmailValidator } from '../protocols/EmailValidator'
import { InvalidParamError, MissingParamError } from '../errors'
import { AddAccount } from '../../domain/usecases/AddAccount'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  execute (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest({ error: new MissingParamError(field) })
        }
      }

      const { body: { name, password, passwordConfirmation, email } } = httpRequest
      if (password !== passwordConfirmation) {
        return badRequest({ error: new InvalidParamError('passwordConfirmation') })
      }

      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest({ error: new InvalidParamError('email') })
      }

      this.addAccount.add({ name, email, password })
    } catch (error) {
      return serverError()
    }
  }
}
