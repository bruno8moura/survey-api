import { AuthToken } from '../models/AuthToken'
export interface AuthenticationModel {
  email: string
  password: string
}

export interface Authentication {
  auth: (params: AuthenticationModel) => Promise<AuthToken>
}
