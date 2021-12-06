import { makeSignUpValidation } from '.'
import { CompareFieldValidations } from '../../../presentation/helpers/validators/CompareFieldsValidation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/RequiredFieldValidation'
import { ValidationComposite } from '../../../presentation/helpers/validators/ValidationComposite'

jest.mock('../../../presentation/helpers/validators/ValidationComposite')

describe('SignUp validation factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()

    const validations = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldValidations('password', 'passwordConfirmation'))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
