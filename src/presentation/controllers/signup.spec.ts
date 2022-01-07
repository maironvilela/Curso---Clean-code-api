import { SignUpController } from './signup';

describe('Signup', () => {
  test('should be able return code 400 if the username is not provide', () => {
    const sut = new SignUpController();

    const httpRequest = {
      email: 'any_email@emnail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password',
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toEqual(400);
    expect(httpResponse.body).toEqual(new Error('Missing param: name'));
  });
});
