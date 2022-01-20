import { DBAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { LoginController } from '../../../presentation/controllers/login';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { JWTAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter';
import { makeLoginValidation } from './login-validation';
import { LogControllerDecorator } from '../../decorators/log/log-controller-decorator ';
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-error';
import { Controllers } from '../../../presentation/protocols';

export const makeLoginController = (): Controllers => {
  const salt = 12;
  // DB AuthenticationStub
  const accountRepository = new AccountMongoRepository();
  const hashedCompare = new BcryptAdapter(salt);
  const tokenGenerator = new JWTAdapter();
  const authentication = new DBAuthentication(
    accountRepository,
    hashedCompare,
    tokenGenerator,
    accountRepository,
  );
  // Login Controller
  const loginController = new LoginController(
    authentication,
    makeLoginValidation(),
  );

  const logMongoRepository = new LogMongoRepository();

  return new LogControllerDecorator(loginController, logMongoRepository);
};
