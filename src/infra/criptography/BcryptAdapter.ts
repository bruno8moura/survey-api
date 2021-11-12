import { Encrypter } from '../../data/protocols'
import { hash } from 'bcrypt'
export class BcryptAdapter implements Encrypter {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    await hash(value, this.salt)
    return null
  }
}
