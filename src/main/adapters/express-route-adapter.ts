import { Request, RequestHandler, Response } from 'express'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export const adapterRoute = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse: HttpResponse = await controller.execute(httpRequest)
    const { body, statusCode } = httpResponse

    return res.status(statusCode).json(body)
  }
}
