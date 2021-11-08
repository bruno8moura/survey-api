import { MissingParamError } from '../errors/missing-param-error'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { badRequest } from '../helpers/http-helper'

export class SignUpController {
  execute (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return badRequest({ error: new MissingParamError('Missing param: name') })
    }

    if (!httpRequest.body.email) {
      return badRequest({ error: new MissingParamError('Missing param: email') })
    }
  }
}
