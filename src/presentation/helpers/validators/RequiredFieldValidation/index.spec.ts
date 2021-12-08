import { RequiredFieldValidation } from '.'
import { MissingParamError } from '../../../errors'
import { Validation } from '../../../protocols/Validation'

interface SutTypes {
  sut: Validation
  sutObj: any
}

const makeSut = (): SutTypes => {
  const sutObj = { any_field: 'any_value' }
  const anyField = 'any_field'
  const sut = new RequiredFieldValidation(anyField)

  return {
    sut,
    sutObj
  }
}

describe('Required Field Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const { sut, sutObj } = makeSut()

    const error = sut.validate({ name: 'any_name' })

    expect(error).toEqual(new MissingParamError(Object.keys(sutObj)[0]))
  })

  test('should not return if validation succeeds', () => {
    const { sut, sutObj } = makeSut()

    const error = sut.validate(sutObj)
    expect(error).toBeFalsy()
  })
})
