import { ServerError } from '../../errors'
import { UnauthorizedError } from '../../errors/UnauthorizedError'
import { HttpResponse } from '../../protocols'
interface ErrorParam {
  error: Error
}
export const badRequest = ({ error }: ErrorParam): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = ({ error }: ErrorParam): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(error)
  }
}

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
