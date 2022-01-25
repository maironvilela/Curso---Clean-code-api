import { EmailValidatorAdapter } from './email-validator-adapter';
import validator from 'validator';
import { EmailValidator } from '../../../presentation/protocols/email-validator';
const makeSut = (): EmailValidator => {
  return new EmailValidatorAdapter();
};

// mock da função isEmail da biblioteca validator
jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe('EmailValidatorAdapter', () => {
  test('Should be able to validate with valid email ', () => {
    const sut = makeSut();
    const isEmailValid = sut.validate('valid_email@email.com');
    expect(isEmailValid).toBe(true);
  });

  test('Should be able to not validate with invalid_valid email ', () => {
    const sut = makeSut();

    jest.spyOn(validator, 'isEmail').mockImplementationOnce(() => {
      return false;
    });

    const isEmailValid = sut.validate('invalid_email@email.com');
    expect(isEmailValid).toBe(false);
  });

  test('Should be able validated if the email passed as a parameter is a correct email ', () => {
    const sut = makeSut();

    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    sut.validate('any_email@email.com');
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@email.com');
  });
});
