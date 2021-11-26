import { Router } from 'express'
import { adapterRoute } from '../../adapters/express-route-adapter'
import { makeSignUpController } from '../../factories/signup'

export const signup = (router: Router): void => {
  router.post('/signup', adapterRoute(makeSignUpController()))
}
