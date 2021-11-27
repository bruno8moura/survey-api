import { LogControllerDecorator } from '.'
import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'

describe('Log Decorator', () => {
  test('should call the encapsulated controller with the correct values', async () => {
    class AControllerStub implements Controller {
      async execute (request: HttpRequest): Promise<HttpResponse> {
        return { body: { z: 9 }, statusCode: 200 }
      }
    }

    const aController = new AControllerStub()
    const executeSpy = jest.spyOn(aController, 'execute')

    const sut = new LogControllerDecorator(aController)

    const request: HttpRequest = {
      body: {
        a: '1'
      }
    }

    await sut.execute(request)

    expect(executeSpy).toHaveBeenCalledWith(request)
  })
})
