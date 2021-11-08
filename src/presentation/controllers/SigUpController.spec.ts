import { MissingParamError } from '../errors/missing-param-error'
import { SignUpController } from './SigUpController'

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    // System Under Test - identifica quem está sendo testado.
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.execute(httpRequest)

    // O toBe compara o ponteiro dos objetos. Ou seja os objetos tem que ser identicos.
    expect(httpResponse.statusCode).toBe(400)

    // O 'toEqual' compara apenas os valores do objeto.
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', () => {
    // System Under Test - identifica quem está sendo testado.
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.execute(httpRequest)

    // O toBe compara o ponteiro dos objetos. Ou seja os objetos tem que ser identicos.
    expect(httpResponse.statusCode).toBe(400)

    // O 'toEqual' compara apenas os valores do objeto.
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', () => {
    // System Under Test - identifica quem está sendo testado.
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.execute(httpRequest)

    // O toBe compara o ponteiro dos objetos. Ou seja os objetos tem que ser identicos.
    expect(httpResponse.statusCode).toBe(400)

    // O 'toEqual' compara apenas os valores do objeto.
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 400 if no passwordConfirmation is provided', () => {
    // System Under Test - identifica quem está sendo testado.
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }

    const httpResponse = sut.execute(httpRequest)

    // O toBe compara o ponteiro dos objetos. Ou seja os objetos tem que ser identicos.
    expect(httpResponse.statusCode).toBe(400)

    // O 'toEqual' compara apenas os valores do objeto.
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
})
