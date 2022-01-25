import { DBAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { LoginController } from '../../../presentation/controllers/login/login-controller';
import { makeLoginValidation } from './login-validation-controller';
import { LogControllerDecorator } from '../../decorators/log/log-controller-decorator ';
import { LogErrorMongoRepository } from '../../../infra/db/mongodb/log/log-error-mongo-repository';
import { Controllers } from '../../../presentation/protocols';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { makeBcryptAdapter } from '../infra/bcrypt-adapter-factory';
import { makeJWTAdapter } from '../infra/jwt-adapter-factory';

export const makeLoginController = (): Controllers => {
  const loginController = new LoginController(
    makeDBAuthentication(),
    makeLoginValidation(),
  );

  return makeLogMongoRepository(loginController);
};

const makeDBAuthentication = (): DBAuthentication => {
  return new DBAuthentication(
    makeAccountMongoRepository(),
    makeBcryptAdapter(),
    makeJWTAdapter(),
    makeAccountMongoRepository(),
  );
};

const makeLogMongoRepository = (
  controller: Controllers,
): LogControllerDecorator => {
  const logMongoRepository = new LogErrorMongoRepository();
  return new LogControllerDecorator(controller, logMongoRepository);
};

const makeAccountMongoRepository = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};
