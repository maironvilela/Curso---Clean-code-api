import { MissingParamError } from '../error/missing-param-error';
import { SignUpController } from './signup';

describe('SignUp Controller', () => {
  test('should be able return code 400 if the username is not provided', () => {
    const sut = new SignUpController();

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
    const sut = new SignUpController();

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
    const sut = new SignUpController();

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
});
