import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { LogErrorMongoRepository } from '../../../infra/db/mongodb/log/log-error-mongo-repository';
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller';
import { Controllers } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log/log-controller-decorator ';
import { makeSignUpValidation } from './signup-validation';

export const makeSignUpController = (): Controllers => {
  const salt = 12;

  const hash = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMongoRepository();
  const logMongoRepository = new LogErrorMongoRepository();
  const addAccount = new DbAddAccount(hash, addAccountRepository);
  const signupValidation = makeSignUpValidation();
  const signUpController = new SignUpController(addAccount, signupValidation);
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
