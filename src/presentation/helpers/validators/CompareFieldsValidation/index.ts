import { InvalidParamError } from '../../../errors'
import { Validation } from '../Validation'

export class CompareFieldValidations implements Validation {
  private readonly fieldName: string
  private readonly fieldToCompareName: string
  constructor (fieldName: string, fieldToCompareName: string) {
    this.fieldName = fieldName
    this.fieldToCompareName = fieldToCompareName
  }

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName)
    }
  }
}
