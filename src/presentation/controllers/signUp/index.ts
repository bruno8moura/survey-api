import { HttpRequest, HttpResponse, Controller, AddAccount, Validation } from './protocols'
import { badRequest, serverError, created } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly validation: Validation
  private readonly addAccount: AddAccount
  constructor (addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async execute (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest({ error })
      }

      const { body: { name, password, email } } = httpRequest
      const account = await this.addAccount.add({ name, email, password })

      return created(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
