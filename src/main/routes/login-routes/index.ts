import { Router } from 'express';
import { expressRouterAdapter } from '../../adapters/express-router-adapter';
import { makeLoginController } from '../../factories/login/login-controller-factory';

export default (router: Router): void => {
  router.post('/login', expressRouterAdapter(makeLoginController()));
};
