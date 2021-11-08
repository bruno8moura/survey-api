import { SignUpController } from './SigUpController'

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    // System Under Test - identifica quem está sendo testado.
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.execute(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
