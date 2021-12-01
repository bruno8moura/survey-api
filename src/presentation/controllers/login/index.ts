import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async execute (request: HttpRequest): Promise<HttpResponse> {
    return badRequest({ error: new MissingParamError('email') })
  }
}
