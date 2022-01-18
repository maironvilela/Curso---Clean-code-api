import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log-error';
import { SignUpController } from '../../presentation/controllers/signup';
import { Controllers } from '../../presentation/protocols';
import { EmailValidator } from '../../presentation/protocols/email-validator';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { LogControllerDecorator } from '../decorators/log/log-controller-decorator ';
import { makeSignUpValidation } from './signup-validation';

export const makeSignUpController = (): Controllers => {
  const salt = 12;

  const emailValidator: EmailValidator = new EmailValidatorAdapter();
  const encrypt = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMongoRepository();
  const logMongoRepository = new LogMongoRepository();
  const addAccount = new DbAddAccount(encrypt, addAccountRepository);
  const signupValidation = makeSignUpValidation();
  const signUpController = new SignUpController(
    emailValidator,
    addAccount,
    signupValidation,
  );
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
