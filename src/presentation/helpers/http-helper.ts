import { ServerError } from '../errors'
import { HttpResponse } from '../protocols'
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
