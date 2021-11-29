import { LogErrorRepository } from '../../../data/protocols/LogErrorRepository'
import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepository: LogErrorRepository

  constructor (controller: Controller, logErrorRepository: LogErrorRepository) {
    if (!logErrorRepository) {
      throw new Error('LogErrorRepository is undefined!')
    }

    if (!controller) {
      throw new Error('Controller is undefined!')
    }

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
