import { JWTAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter';

export const makeJWTAdapter = (): JWTAdapter => {
  return new JWTAdapter();
};
