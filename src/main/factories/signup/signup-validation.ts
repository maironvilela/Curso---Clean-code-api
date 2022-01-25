import { Validation } from '../../../presentation/protocols/Validation';
import { CompareFieldsValidation } from '../../../validation/compare-fields-validation';
import { EmailValidation } from '../../../validation/email-validation';
import { RequiredFieldsValidation } from '../../../validation/required-fields-validation';
import { ValidationComposite } from '../../../validation/validation-composite';
import { EmailValidatorAdapter } from '../../adapters/validation/email-validator/email-validator-adapter';

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
