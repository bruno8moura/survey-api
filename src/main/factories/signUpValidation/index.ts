import { RequiredFieldValidation } from '../../../presentation/helpers/validators/RequiredFieldValidation'
import { Validation } from '../../../presentation/helpers/validators/Validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/ValidationComposite'

export const makeSignUpValidation = (): Validation => {
  const validations = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
