import { makeLoginValidation } from '.'
import { EmailValidation } from '../../../presentation/helpers/validators/EmailValidation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/RequiredFieldValidation'
import { ValidationComposite } from '../../../presentation/helpers/validators/ValidationComposite'
import { EmailValidator } from '../../../presentation/protocols'

jest.mock('../../../presentation/helpers/validators/ValidationComposite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('Login validation factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeLoginValidation()

    const validations = []
    const fields = ['email', 'password']
    for (const field of fields) {
      validations.push(new RequiredFieldValidation(field))
    }
    const [email] = fields
    validations.push(new EmailValidation(email, makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
