import { CompareFieldValidations } from '../../../presentation/helpers/validators/CompareFieldsValidation'
import { EmailValidation } from '../../../presentation/helpers/validators/EmailValidation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/RequiredFieldValidation'
import { Validation } from '../../../presentation/helpers/validators/Validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/ValidationComposite'
import { EmailValidatorAdapter } from '../../../utils/EmailValidatorAdapter'

export const makeSignUpValidation = (): Validation => {
  const validations = []
  const fields = ['email', 'password', 'passwordConfirmation', 'name']
  for (const field of fields) {
    validations.push(new RequiredFieldValidation(field))
  }

  const [email, password, passwordConfirmation] = fields
  validations.push(new CompareFieldValidations(password, passwordConfirmation))
  validations.push(new EmailValidation(email, new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
