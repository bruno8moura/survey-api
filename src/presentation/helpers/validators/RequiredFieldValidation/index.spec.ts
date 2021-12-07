import { RequiredFieldValidation } from '.'
import { MissingParamError } from '../../../errors'
import { Validation } from '../Validation'

interface SutTypes {
  sut: Validation
  anyField: string
}

const makeSut = (): SutTypes => {
  const anyField = 'any_field'
  const sut = new RequiredFieldValidation(anyField)

  return {
    sut,
    anyField
  }
}

describe('Required Field Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const { sut, anyField } = makeSut()

    const error = sut.validate({ name: 'any_name' })

    expect(error).toEqual(new MissingParamError(anyField))
  })
})
