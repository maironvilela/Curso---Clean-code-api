import { Router } from 'express';
import { expressRouterAdapter } from '../../adapters/express-router-adapter';
import { makeSignUpController } from '../../factories/signup';

export default (router: Router): void => {
  router.post('/signup', expressRouterAdapter(makeSignUpController()));
};
