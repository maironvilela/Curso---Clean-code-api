import { Router } from 'express';
import { makeSignUpController } from '../factories/signup';
import { expressRouterAdapter } from '../adapters/express-router-adapter';

export default (router: Router): void => {
  router.post('/signup', expressRouterAdapter(makeSignUpController()));
};
