import { LogControllerDecorator } from '.'
import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeSut = (): SutTypes => {
  class AControllerStub implements Controller {
    async execute (request: HttpRequest): Promise<HttpResponse> {
      return { body: { z: 9 }, statusCode: 200 }
    }
  }
  const controllerStub = new AControllerStub()
  const sut = new LogControllerDecorator(controllerStub)

  return { sut, controllerStub }
}

describe('Log Decorator', () => {
  test('should call the encapsulated controller with the correct values', async () => {
    const { sut, controllerStub } = makeSut()

    const executeSpy = jest.spyOn(controllerStub, 'execute')

    const request: HttpRequest = {
      body: {
        a: '1'
      }
    }

    await sut.execute(request)

    expect(executeSpy).toHaveBeenCalledWith(request)
  })

  test('should return the same as encapsulated controller', async () => {
    const { sut, controllerStub } = makeSut()

    const request: HttpRequest = {
      body: {
        a: '1'
      }
    }

    const sutResponse = await sut.execute(request)
    const stubResponse = await controllerStub.execute(request)

    expect(sutResponse).toEqual(stubResponse)
  })
})
