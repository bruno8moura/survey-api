import { LogErrorRepository } from '../../../data/protocols/LogErrorRepository'
import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepository: LogErrorRepository

  constructor (controller: Controller, logErrorRepository: LogErrorRepository) {
    this.logErrorRepository = logErrorRepository
    this.controller = controller
  }

  async execute (request: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.execute(request)

    if (httpResponse.statusCode === 500) {
      const error = httpResponse.body
      await this.logErrorRepository.logError(error)
    }

    return httpResponse
  }
}
