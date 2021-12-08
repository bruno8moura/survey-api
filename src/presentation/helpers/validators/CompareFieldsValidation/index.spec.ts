/* eslint-disable @typescript-eslint/naming-convention */
import { CompareFieldValidation } from '.'
import { InvalidParamError } from '../../../errors'
import { Validation } from '../../../protocols/Validation'

interface SutTypes {
  sut: Validation
  sutObj: SutParamObj
}

interface SutParamObj {
  any_field: string
  any_field2: string
}

const makeSut = (): SutTypes => {
  const sutObj: SutParamObj = { any_field: 'any_value', any_field2: 'any_value' }
  const sut = new CompareFieldValidation(Object.keys(sutObj)[0], Object.keys(sutObj)[1])

  return {
    sut,
    sutObj
  }
}

describe('Compare Field Validation', () => {
  test('should return a InvalidParamError if validation fails', () => {
    const { sut, sutObj } = makeSut()

    const { any_field } = sutObj
    const error = sut.validate({ any_field, any_field2: 'another_value' })

    expect(error).toEqual(new InvalidParamError(Object.keys(sutObj)[1]))
  })

  test('should not return if validation succeeds', () => {
    const { sut, sutObj } = makeSut()

    const error = sut.validate(sutObj)
    expect(error).toBeFalsy()
  })
})
