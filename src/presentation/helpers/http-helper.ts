import { HttpResponse } from '../protocols/http'
interface BadRequestParam {
  error: Error
}
export const badRequest = ({ error }: BadRequestParam): HttpResponse => ({
  statusCode: 400,
  body: error
})
