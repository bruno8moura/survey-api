export class ServerError extends Error {
  public readonly originalMessage: string
  constructor ({ stack, message }: Error) {
    super('Internal server Error')
    this.name = 'ServerError'
    this.originalMessage = message
    this.stack = stack
  }
}
