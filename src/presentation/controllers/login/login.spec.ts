import { MissingParamError, ServerError } from '../../error';
import {
  badRequest,
  internalServerError,
  unauthorized,
} from '../../helpers/http-helpers';
import { Validation } from '../../protocols/Validation';
import { LoginController } from './';
import {
  Authentication,
  AuthenticationProps,
  AuthenticationResult,
  HttpRequest,
} from './login-protocols';

interface SutTypes {
  sut: LoginController;
  authenticationStub: Authentication;
  validatorStub: Validation;
}
const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'valid_email@email.com',
    password: 'valid_password',
  },
});

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth({
      email,
      password,
    }: AuthenticationProps): Promise<AuthenticationResult | null> {
      return await new Promise(resolve =>
        resolve({ name: 'any_name', token: 'any_token' }),
      );
    }
  }
  return new AuthenticationStub();
};

const makeValidatorStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub();
  const validatorStub = makeValidatorStub();
  const sut = new LoginController(authenticationStub, validatorStub);
  return { authenticationStub, sut, validatorStub };
};

describe('Login Controller', () => {
  test('should be able called the validator function with the correct values', async () => {
    const { sut, validatorStub } = makeSut();
    const request = makeHttpRequest();

    const validateSpy = jest.spyOn(validatorStub, 'validate');

    await sut.handle(request);

    expect(validateSpy).toHaveBeenCalledWith(request.body);
  });

  test('should be able return code 400 if there is validator error', async () => {
    const { sut, validatorStub } = makeSut();

    jest
      .spyOn(validatorStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_param'));

    const error = await sut.handle(makeHttpRequest());

    expect(error.statusCode).toEqual(400);
    expect(error).toEqual(badRequest(new MissingParamError('any_param')));
  });

  test('should be able return code 500 if there is an error on the server when to login', async () => {
    const { sut, authenticationStub } = makeSut();

    jest
      .spyOn(authenticationStub, 'auth')
      .mockImplementationOnce(async (): Promise<any> => {
        const promise = await new Promise((resolve, reject) =>
          reject(new ServerError('Internal Server Error')),
        );
        return promise;
      });
    const httpResponse = await sut.handle(makeHttpRequest());

    expect(httpResponse.statusCode).toEqual(500);
    expect(httpResponse).toEqual(
      internalServerError(new ServerError('Internal Server Error')),
    );
  });

  test('should be able return code 401 if authentication fails', async () => {
    const { sut, authenticationStub } = makeSut();

    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValue(new Promise(resolve => resolve(null)));

    const httpResponse = await sut.handle(makeHttpRequest());

    expect(httpResponse).toEqual(unauthorized());
  });

  test('should be able return code 200 when the login successfully', async () => {
    const { sut } = makeSut();

    const response = await sut.handle(makeHttpRequest());

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ token: 'any_token', name: 'any_name' });
  });
});
