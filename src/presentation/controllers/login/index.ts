import { MissingParamError } from '../../errors'
import { badRequest, created } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async execute (request: HttpRequest): Promise<HttpResponse> {
    if (!request.body.email) {
      return badRequest({ error: new MissingParamError('email') })
    }

    if (!request.body.password) {
      return badRequest({ error: new MissingParamError('password') })
    }

    return created({})
  }
}
