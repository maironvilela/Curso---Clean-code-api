import { Validation } from '../../presentation/protocols/Validation';
import { RequiredFieldsValidator } from '../../validation/required-fields-validation';
import { ValidationComposite } from '../../validation/validation-composite';

export const makeSignUpValidation = (): Validation => {
  const fields = ['name', 'email', 'password', 'passwordConfirmation'];
  const validations: Validation[] = [];

  for (const field of fields) {
    validations.push(new RequiredFieldsValidator(field));
  }
  return new ValidationComposite(validations);
};
