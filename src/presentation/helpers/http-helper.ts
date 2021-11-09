import { ServerError } from '../errors/ServerError'
import { HttpResponse } from '../protocols/http'
interface BadRequestParam {
  error: Error
}
export const badRequest = ({ error }: BadRequestParam): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})
