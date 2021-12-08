import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, Authentication, Validation } from './protocols'
interface LoginControllerParams{
  validation: Validation
  authentication: Authentication
}
export class LoginController implements Controller {
  private readonly validation: Validation
  private readonly authentication: Authentication
  constructor ({ validation, authentication }: LoginControllerParams) {
    this.validation = validation
    this.authentication = authentication
  }

  async execute (request: HttpRequest): Promise<HttpResponse> {
    const { body: { email, password } } = request
    try {
      const error = this.validation.validate({ email, password })
      if (error) {
        return badRequest({ error })
      }

      const authToken = await this.authentication.auth({ email, password })
      if (!authToken.accessToken) {
        return unauthorized()
      }

      return ok({ authToken })
    } catch (e: any) {
      return serverError({ error: e })
    }
  }
}
