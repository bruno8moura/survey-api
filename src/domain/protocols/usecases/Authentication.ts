import { AuthToken } from '../models/AuthToken'
export interface AuthenticationParams {
  email: string
  password: string
}

export interface Authentication {
  auth: (params: AuthenticationParams) => Promise<AuthToken>
}
