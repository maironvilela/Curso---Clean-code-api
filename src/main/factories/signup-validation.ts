import { Validation } from '../../presentation/protocols/Validation';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { CompareFieldsValidation } from '../../validation/compare-fields-validation';
import { EmailValidation } from '../../validation/email-validation';
import { RequiredFieldsValidation } from '../../validation/required-fields-validation';
import { ValidationComposite } from '../../validation/validation-composite';

export const makeSignUpValidation = (): Validation => {
  const fields = ['name', 'email', 'password', 'passwordConfirmation'];
  const validations: Validation[] = [];

  for (const field of fields) {
    validations.push(new RequiredFieldsValidation(field));
  }
  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation'),
  );

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
