import { LogControllerDecorator } from '.'
import { LogErrorRepository } from '../../../data/protocols/LogErrorRepository'
import { serverError } from '../../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error('A fake Error!')
  fakeError.stack = 'any_stack'
  return serverError({ error: fakeError })
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    a: '1'
  }
})
interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (_: Error): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}

const makeControllerStub = (): Controller => {
  class AControllerStub implements Controller {
    async execute (request: HttpRequest): Promise<HttpResponse> {
      return { body: { z: 9 }, statusCode: 200 }
    }
  }

  return new AControllerStub()
}

const makeSut = (): SutTypes => {
  const logErrorRepositoryStub = makeLogErrorRepository()
  const controllerStub = makeControllerStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return { sut, controllerStub, logErrorRepositoryStub }
}

describe('Log Decorator', () => {
  test('should call the encapsulated controller with the correct values', async () => {
    const { sut, controllerStub } = makeSut()

    const executeSpy = jest.spyOn(controllerStub, 'execute')

    const request: HttpRequest = makeFakeRequest()
    await sut.execute(request)

    expect(executeSpy).toHaveBeenCalledWith(request)
  })

  test('should return the same as encapsulated controller', async () => {
    const { sut, controllerStub } = makeSut()

    const request: HttpRequest = makeFakeRequest()
    const sutResponse = await sut.execute(request)
    const stubResponse = await controllerStub.execute(request)

    expect(sutResponse).toEqual(stubResponse)
  })

  test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const aServerError = makeFakeServerError()
    jest.spyOn(controllerStub, 'execute').mockReturnValueOnce(Promise.resolve(aServerError))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')

    const request: HttpRequest = makeFakeRequest()
    await sut.execute(request)

    expect(logSpy).toHaveBeenCalledWith(aServerError.body)
  })

  test('should not create LogDecorator without LogErrorRepository', async () => {
    const controllerStub = makeControllerStub()
    let newLogControllerDecorator: LogControllerDecorator
    try {
      newLogControllerDecorator = new LogControllerDecorator(controllerStub, null)
    } catch (error) {
    }
    expect(newLogControllerDecorator).toBeUndefined()
  })

  test('should not create LogDecorator without Controller', async () => {
    let newLogControllerDecorator: LogControllerDecorator
    try {
      newLogControllerDecorator = new LogControllerDecorator(null, makeLogErrorRepository())
    } catch (error) {
    }
    expect(newLogControllerDecorator).toBeUndefined()
  })
})
