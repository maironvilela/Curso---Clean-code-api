import { InvalidParamError, MissingParamError, ServerError } from '../../error';
import { badRequest, internalServerError } from '../../helpers/http-helpers';
import { HttpRequest } from '../../protocols';
import { EmailValidator } from '../signup/signup-protocols';
import { LoginController } from './';

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    validate(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub();
  const sut = new LoginController(emailValidatorStub);
  return { sut, emailValidatorStub };
};

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_username',
    password: 'any_password',
  },
});

describe('Login Controller', () => {
  test('should be able return code 400 if the email is not provided', async () => {
    const { sut } = makeSut();
    const response = await sut.handle({
      body: {
        password: '123',
      },
    });

    expect(response).toEqual(badRequest(new MissingParamError('email')));
  });

  it('should be able return code 400 if the password is not provider', async () => {
    const { sut } = makeSut();
    const response = await sut.handle({
      body: {
        email: 'any_email@email.com',
      },
    });

    expect(response).toEqual(badRequest(new MissingParamError('password')));
  });

  it('should be able return code 400 if the email provided is invalid ', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'validate').mockReturnValueOnce(false);

    const response = await sut.handle(makeHttpRequest());

    expect(response.statusCode).toEqual(400);
    expect(response).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('should ensure that the LoginController returns code 500 in case of failure to validate the email', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'validate').mockImplementationOnce(() => {
      throw new ServerError('Internal Server Error');
    });

    const response = await sut.handle(makeHttpRequest());

    console.log(internalServerError(new ServerError('Internal Server Error')));

    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual(new ServerError('Internal Server Error'));
  });

  it('should call the validate function with the correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const validateSpy = jest.spyOn(emailValidatorStub, 'validate');

    await sut.handle(makeHttpRequest());

    console.log(internalServerError(new ServerError('Internal Server Error')));

    expect(validateSpy).toHaveBeenCalledWith(makeHttpRequest().body.email);
  });
});
