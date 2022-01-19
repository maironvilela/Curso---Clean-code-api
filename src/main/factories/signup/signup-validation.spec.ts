import { makeSignUpValidation } from './signup-validation';
import { RequiredFieldsValidation } from '../../../validation/required-fields-validation';
import { Validation } from '../../../presentation/protocols/Validation';
import { EmailValidation } from '../../../validation/email-validation';
import { EmailValidator } from '../../../presentation/protocols/email-validator';
import { CompareFieldsValidation } from '../../../validation/compare-fields-validation';
import { ValidationComposite } from '../../../validation/validation-composite';
//  realiza o mock do modulo validation-composite. Ja que não é necessário passar o construtor
jest.mock('../../../validation/validation-composite');

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    validate(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe('SignUpValidationFactory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const fields = ['name', 'email', 'password', 'passwordConfirmation'];
    const validations: Validation[] = [];
    for (const field of fields) {
      validations.push(new RequiredFieldsValidation(field));
    }
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation'),
    );
    validations.push(new EmailValidation('email', makeEmailValidatorStub()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
