import { ServerError } from '../errors'
import { HttpResponse } from '../protocols'
interface BadRequestParam {
  error: Error
}
export const badRequest = ({ error }: BadRequestParam): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error)
})

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})
