import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  constructor (controller: Controller) {
    this.controller = controller
  }

  async execute (request: HttpRequest): Promise<HttpResponse> {
    await this.controller.execute(request)

    return null
  }
}
