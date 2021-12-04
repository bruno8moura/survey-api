export class UnauthorizedError extends Error {
  public readonly detail: string
  constructor () {
    super('User not authorized')
    this.name = 'UnauthorizedError'
    this.detail = this.message
  }
}
