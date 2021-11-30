export class ServerError extends Error {
  public readonly detail: string
  constructor ({ stack, message }: Error) {
    super('Internal server Error')
    this.name = 'ServerError'
    this.detail = this.message
    this.stack = stack
  }
}
