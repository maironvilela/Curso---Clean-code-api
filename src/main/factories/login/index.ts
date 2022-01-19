import { DBAuthentication } from '../../../data/usecases/authentication/db-authentication';
import {
  HashComparer,
  LoadAccountByEmailRepository,
  TokenGenerator,
  UpdateAccessTokenRepository,
} from '../../../data/usecases/authentication/db-authentication.spec';
import { Authentication } from '../../../domain/usecases/authentication';
import { LoginController } from '../../../presentation/controllers/login';
import { Validation } from '../../../presentation/protocols/Validation';

export const makeLoginController = (): LoginController => {
  const loadAccountByEmailRepository: LoadAccountByEmailRepository = null;
  const hashedCompare: HashComparer = null;
  const tokenGenerator: TokenGenerator = null;
  const updateAccessTokenRepositoryStub: UpdateAccessTokenRepository = null;
  const authentication: Authentication = new DBAuthentication(
    loadAccountByEmailRepository,
    hashedCompare,
    tokenGenerator,
    updateAccessTokenRepositoryStub,
  );
  const validation: Validation = null;

  return new LoginController(authentication, validation);
};
