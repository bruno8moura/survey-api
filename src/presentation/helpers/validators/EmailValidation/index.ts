import { InvalidParamError } from '../../../errors'
import { EmailValidator } from '../../../protocols/EmailValidator'
import { Validation } from '../../../protocols/Validation'

export class EmailValidation implements Validation {
  private readonly fieldName: string
  private readonly validator: EmailValidator
  constructor (fieldName: string, validator: EmailValidator) {
    this.fieldName = fieldName
    this.validator = validator
  }

  validate (input: any): Error {
    const validEmail = this.validator.isValid(input[this.fieldName])
    if (!validEmail) return new InvalidParamError(this.fieldName)
  }
}
