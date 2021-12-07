import { makeSignUpValidation } from '.'
import { CompareFieldValidations } from '../../../presentation/helpers/validators/CompareFieldsValidation'
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

describe('SignUp validation factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()

    const validations = []
    const fields = ['email', 'password', 'passwordConfirmation', 'name']
    for (const field of fields) {
      validations.push(new RequiredFieldValidation(field))
    }
    const [email, password, passwordConfirmation] = fields
    validations.push(new CompareFieldValidations(password, passwordConfirmation))
    validations.push(new EmailValidation(email, makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
