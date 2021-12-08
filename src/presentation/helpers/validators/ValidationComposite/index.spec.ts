import { ValidationComposite } from '.'
import { Validation } from '../../../protocols/Validation'

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return undefined
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidationStub(), makeValidationStub()]

  const sut = new ValidationComposite(validationStubs)

  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('should return an error if any validation failed', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValue(new Error('A validation error!'))
    const input = { any_field: 'any_value' }
    const error = sut.validate(input)

    expect(error).toBeTruthy()
  })
  test('should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValue(new Error('A validation error1!'))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValue(new Error('A validation error2!'))
    const input = { any_field: 'any_value' }
    const error = sut.validate(input)

    expect(error).toEqual(new Error('A validation error1!'))
  })

  test('should not return error if validation succeeds', () => {
    const { sut } = makeSut()
    const input = { any_field: 'any_value' }
    const error = sut.validate(input)

    expect(error).toBeFalsy()
  })
})
