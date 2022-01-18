/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ServerError, MissingParamError, InvalidParamError } from '../../error';
import { SignUpController } from '.';
import {
  AddAccount,
  AccountModel,
  AddAccountModel,
  EmailValidator,
  HttpRequest,
} from './signup-protocols';
import { Validation } from '../../protocols/Validation';

interface MakeSutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
  validationStub: Validation;
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
const makeValidation = (): Validation => {
  class ValidatorStub implements Validation {
    constructor(private readonly fieldName: string) {}
    validate(input: string): Error | null {
      return null;
    }
  }
  return new ValidatorStub('');
};
// Factory para a criação do makeAddAccount
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
      };

      return await new Promise(resolve => resolve(fakeAccount));
    }
  }

  return new AddAccountStub();
};

// Factory para a criação do makeSutFactory
const makeSutFactory = (): MakeSutTypes => {
  const validationStub = makeValidation();
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();

  const sut = new SignUpController(
    emailValidatorStub,
    addAccountStub,
    validationStub,
  );
  return { sut, emailValidatorStub, addAccountStub, validationStub };
};

const makeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'valid_password',
    passwordConfirmation: 'valid_password',
  },
});

describe('SignUp Controller', () => {
  test('should be able return code 400 if the password Confirmation fails', async () => {
    const { sut } = makeSutFactory();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@emnail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toEqual(400);
    expect(httpResponse.body).toBeInstanceOf(InvalidParamError);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation'),
    );
  });
  test('should be able return code 400 if the email is invalid', async () => {
    const { sut, emailValidatorStub } = makeSutFactory();

    jest.spyOn(emailValidatorStub, 'validate').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(makeHttpRequest());

    expect(httpResponse.statusCode).toEqual(400);
    expect(httpResponse.body).toBeInstanceOf(InvalidParamError);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });
  test('should be able called with correct email', async () => {
    const { sut, emailValidatorStub } = makeSutFactory();
    const validateSpy = jest.spyOn(emailValidatorStub, 'validate');
    await sut.handle(makeHttpRequest());
    expect(validateSpy).toHaveBeenCalledWith(makeHttpRequest().body.email);
  });
  test('should be able return code 500 if there is an error on the server when validating the email', async () => {
    const { sut, emailValidatorStub } = makeSutFactory();

    jest.spyOn(emailValidatorStub, 'validate').mockImplementationOnce(() => {
      throw new ServerError('Internal Server Error');
    });

    const httpResponse = await sut.handle(makeHttpRequest());

    expect(httpResponse.statusCode).toEqual(500);
    expect(httpResponse.body).toBeInstanceOf(ServerError);
    expect(httpResponse.body).toEqual(new ServerError('Internal Server Error'));
  });
  test('should be able called the addAccount function with the correct values', async () => {
    const { sut, addAccountStub } = makeSutFactory();

    const addSpy = jest.spyOn(addAccountStub, 'add');

    await sut.handle(makeHttpRequest());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
    });
  });
  test('should be able return code 500 if there is an error on the server when when to save account', async () => {
    const { sut, addAccountStub } = makeSutFactory();

    jest
      .spyOn(addAccountStub, 'add')
      .mockImplementationOnce(async (): Promise<any> => {
        const promise = await new Promise((resolve, reject) =>
          reject(new ServerError('Internal Server Error')),
        );
        return promise;
      });

    const httpResponse = await sut.handle(makeHttpRequest());

    expect(httpResponse.statusCode).toEqual(500);
    expect(httpResponse.body).toEqual(new ServerError('Internal Server Error'));
  });

  test('should be able return code 201 when the account is saved successfully', async () => {
    const { sut } = makeSutFactory();

    const httpResponse = await sut.handle(makeHttpRequest());

    expect(httpResponse.statusCode).toEqual(201);
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
    });
  });

  test('should be able called the validator function with the correct values', async () => {
    const { sut, validationStub } = makeSutFactory();

    const addSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeHttpRequest();

    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test('should be able return code 400 if there is validator error', async () => {
    const { sut, validationStub } = makeSutFactory();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_param'));

    const httpResponse = await sut.handle(makeHttpRequest());
    console.log(httpResponse);

    expect(httpResponse.statusCode).toEqual(400);
  });
});
