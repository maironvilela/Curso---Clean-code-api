import validator from 'validator';
import { EmailValidator } from '../../../presentation/protocols/email-validator';
export class EmailValidatorAdapter implements EmailValidator {
  validate(email: string): boolean {
    const isValid = validator.isEmail(email);
    return isValid;
  }
}
