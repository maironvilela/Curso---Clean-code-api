/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ServerError, MissingParamError, InvalidParamError } from '../../error';
import { SignUpController } from '.';
import {
  AddAccount,
  AccountModel,
  AddAccountModel,
  EmailValidator,
} from './signup-protocols';

interface MakeSutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

// Factory para a criação do makeEmailValidator
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    validate(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

// Factory para a criação do makeAddAccount
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
      };
    }
  }

  return new AddAccountStub();
};

// Factory para a criação do makeSutFactory
const makeSutFactory = (): MakeSutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();

  const sut = new SignUpController(emailValidatorStub, addAccountStub);
  return { sut, emailValidatorStub, addAccountStub };
};

describe('SignUp Controller', () => {
  test('should be able return code 400 if the username is not provided', () => {
    const { sut } = makeSutFactory();

    const httpRequest = {
      body: {
        email: 'any_email@emnail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toEqual(400);
    expect(httpResponse.body).toBeInstanceOf(MissingParamError);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });
  test('should be able return code 400 if the email is not provided', () => {
    const { sut } = makeSutFactory();

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toEqual(400);
    expect(httpResponse.body).toBeInstanceOf(MissingParamError);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });
  test('should be able return code 400 if the password is not provided', () => {
    const { sut } = makeSutFactory();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@emnail.com',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toEqual(400);
    expect(httpResponse.body).toBeInstanceOf(MissingParamError);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });
  test('should be able return code 400 if the passwordConfirmation is not provided', () => {
    const { sut } = makeSutFactory();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@emnail.com',
        password: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toEqual(400);
    expect(httpResponse.body).toBeInstanceOf(MissingParamError);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation'),
    );
  });
  test('should be able return code 400 if the password Confirmation fails', () => {
    const { sut } = makeSutFactory();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@emnail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toEqual(400);
    expect(httpResponse.body).toBeInstanceOf(InvalidParamError);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation'),
    );
  });
  test('should be able return code 400 if the email is invalid', () => {
    const { sut, emailValidatorStub } = makeSutFactory();

    jest.spyOn(emailValidatorStub, 'validate').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toEqual(400);
    expect(httpResponse.body).toBeInstanceOf(InvalidParamError);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });
  test('should be able called with correct email', () => {
    const { sut, emailValidatorStub } = makeSutFactory();

    const validateSpy = jest.spyOn(emailValidatorStub, 'validate');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'correct.email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith('correct.email@email.com');
  });
  test('should be able return code 500 if there is an error on the server when validating the email', () => {
    const { sut, emailValidatorStub } = makeSutFactory();

    jest.spyOn(emailValidatorStub, 'validate').mockImplementationOnce(() => {
      throw new ServerError();
    });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    console.log(httpResponse.body);

    expect(httpResponse.statusCode).toEqual(500);
    expect(httpResponse.body).toBeInstanceOf(ServerError);
    expect(httpResponse.body).toEqual(new ServerError());
  });
  test('should be able called the addAccount function with the correct parameters', () => {
    const { sut, addAccountStub } = makeSutFactory();

    const addSpy = jest.spyOn(addAccountStub, 'add');

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    };
    sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
    });
  });

  test('should be able return code 500 if there is an error on the server when when to save account', () => {
    const { sut, addAccountStub } = makeSutFactory();

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new ServerError();
    });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toEqual(500);
    expect(httpResponse.body).toBeInstanceOf(ServerError);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('should be able return code 200 when the account is saved successfully', () => {
    const { sut } = makeSutFactory();

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toEqual(200);
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
    });
  });
});
