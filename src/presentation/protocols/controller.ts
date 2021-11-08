import { HttpRequest, HttpResponse } from './http'

export interface Controller {
  execute: (request: HttpRequest) => HttpResponse
}
