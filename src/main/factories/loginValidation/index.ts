import { EmailValidation } from '../../../presentation/helpers/validators/EmailValidation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/RequiredFieldValidation'
import { Validation } from '../../../presentation/helpers/validators/Validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/ValidationComposite'
import { EmailValidatorAdapter } from '../../../utils/EmailValidatorAdapter'

export const makeLoginValidation = (): Validation => {
  const validations = []
  const fields = ['email', 'password']
  for (const field of fields) {
    validations.push(new RequiredFieldValidation(field))
  }

  const [email] = fields
  validations.push(new EmailValidation(email, new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
