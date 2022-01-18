import { EmailValidation } from '.';
import { EmailValidator } from '../../presentation/protocols/email-validator';

interface SutTypes {
  sut: EmailValidation;
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
  const sut = new EmailValidation('email', emailValidatorStub);
  return { sut, emailValidatorStub };
};

describe('EmailValidator', () => {
  it('should called the validate function with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();

    const validateSpy = jest.spyOn(emailValidatorStub, 'validate');

    sut.validate({ email: 'any_email@email.com' });

    expect(validateSpy).toHaveBeenCalledWith('any_email@email.com');
  });

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'validate').mockImplementationOnce(() => {
      throw new Error();
    });
    expect(sut.validate).toThrow();
  });
});
