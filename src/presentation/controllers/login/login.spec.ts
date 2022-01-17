import { MissingParamError } from '../../error';
import { badRequest } from '../../helpers/http-helpers';
import { HttpRequest } from '../../protocols';
import { LoginController } from './';

interface SutTypes {
  sut: LoginController;
}

const makeSut = (): SutTypes => {
  const sut = new LoginController();
  return { sut };
};

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: '123',
  },
});

describe('Login Controller', () => {
  test('should be able return code 400 if the username is not provided', async () => {
    const { sut } = makeSut();
    const response = await sut.handle(makeHttpRequest());

    expect(response).toEqual(badRequest(new MissingParamError('username')));
  });
});
