import { makeSignUpValidation } from '.'
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

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
