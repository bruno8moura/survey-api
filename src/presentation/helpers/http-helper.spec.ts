import { badRequest, created, serverError } from './http-helper'
describe('Http Helper', () => {
  test('should return a patterned http response payload when 400 http code happens', () => {
    const error = new Error('An error!')
    const payload = badRequest({ error })

    expect(payload.statusCode).toBeDefined()
    expect(payload.body).toBeDefined()
    expect(payload.statusCode).toBe(400)
    expect(payload.body).toBeInstanceOf(Error)
  })

  test('should return a patterned http response payload when 500 http code happens', () => {
    const error = new Error('An error!')
    const payload = serverError({ error })

    expect(payload.statusCode).toBeDefined()
    expect(payload.body).toBeDefined()
    expect(payload.statusCode).toBe(500)
    expect(payload.body).toBeInstanceOf(Error)
  })

  test('should return a patterned http response payload when 201 http code happens', () => {
    const payload = created({ ok: true })

    expect(payload.statusCode).toBeDefined()
    expect(payload.statusCode).toBe(201)
    expect(payload.body).toBeDefined()
  })
})
