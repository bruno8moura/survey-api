import { ValidationComposite } from '.'
import { Validation } from '../Validation'

describe('Validation Composite', () => {
  test('should return an error if any validation failed', () => {
    class ValidationStub implements Validation {
      validate (input: any): Error {
        return new Error('Validation Error!')
      }
    }

    const validations = [
      new ValidationStub()
    ]

    const input = { any_field: 'any_value' }
    const sut = new ValidationComposite(validations)
    const error = sut.validate(input)

    expect(error).toBeTruthy()
  })
})
