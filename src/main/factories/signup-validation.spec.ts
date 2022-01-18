import { makeSignUpValidation } from './signup-validation';
import { ValidationComposite } from '../../validation/validation-composite';
import { RequiredFieldsValidator } from '../../validation/required-fields-validation';
import { Validation } from '../../presentation/protocols/Validation';

// realiza o mock do modulo validation-composite. Ja que não é necessário passar o construtor
jest.mock('../../validation/validation-composite');

describe('SignUpValidationFactory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const fields = ['name', 'email', 'password', 'passwordConfirmation'];
    const validations: Validation[] = [];

    for (const field of fields) {
      validations.push(new RequiredFieldsValidator(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
