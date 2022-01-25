import { Router } from 'express';
import { expressRouterAdapter } from '../../adapters/express/express-router-adapter';
import { makeSignUpController } from '../../factories/signup/signup-factory';

export default (router: Router): void => {
  router.post('/signup', expressRouterAdapter(makeSignUpController()));
};
