/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ServerError, MissingParamError } from '../../error';
import { SignUpController } from '.';
import {
  AddAccount,
  AccountModel,
  AddAccountModel,
  HttpRequest,
} from './signup-protocols';
import { Validation } from '../../protocols/Validation';

interface MakeSutTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
}

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
  const addAccountStub = makeAddAccount();

  const sut = new SignUpController(addAccountStub, validationStub);
  return { sut, addAccountStub, validationStub };
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
