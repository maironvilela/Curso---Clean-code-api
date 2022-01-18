import { MissingParamError } from '../presentation/error';
import { Validation } from '../presentation/protocols/Validation';

export class RequiredFieldsValidator implements Validation {
  constructor(private readonly fieldName: string) {}
  validate(input: any): Error | null {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
    return null;
  }
}
