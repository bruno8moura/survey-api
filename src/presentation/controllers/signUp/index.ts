import { HttpRequest, HttpResponse, Controller, AddAccount, EmailValidator, Validation } from './protocols'
import { badRequest, serverError, created } from '../../helpers/http-helper'
import { InvalidParamError } from '../../errors'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly validation: Validation
  private readonly addAccount: AddAccount
  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async execute (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest({ error })
      }

      const { body: { email } } = httpRequest
      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest({ error: new InvalidParamError('email') })
      }

      const { body: { name, password } } = httpRequest
      const account = await this.addAccount.add({ name, email, password })

      return created(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
