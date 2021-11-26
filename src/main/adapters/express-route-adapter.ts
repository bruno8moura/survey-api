import { Request, RequestHandler, Response } from 'express'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export const adapterRoute = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse: HttpResponse = await controller.execute(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
