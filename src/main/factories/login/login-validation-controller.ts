import { Validation } from '../../../presentation/protocols/Validation';
import { EmailValidation } from '../../../validation/email-validation';
import { RequiredFieldsValidation } from '../../../validation/required-fields-validation';
import { ValidationComposite } from '../../../validation/validation-composite';
import { EmailValidatorAdapter } from '../../adapters/validation/email-validator-adapter';

export const makeLoginValidation = (): Validation => {
  const fields = ['email', 'password'];
  const validations: Validation[] = [];

  for (const field of fields) {
    validations.push(new RequiredFieldsValidation(field));
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
