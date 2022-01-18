import { ValidationComposite } from '.';
import { MissingParamError } from '../../presentation/error/missing-param-error';
import { Validation } from '../../presentation/protocols/Validation';

interface SutTypes {
  validationStubs: Validation[];
  sut: ValidationComposite;
}
const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }

  return new ValidationStub();
};
const makeSut = (): SutTypes => {
  const validationStubs = [makeValidationStub(), makeValidationStub()];
  const sut = new ValidationComposite(validationStubs);

  return { sut, validationStubs };
};

describe('ValidationComposite', () => {
  it('should return an error if any validator fails', () => {
    const { sut, validationStubs } = makeSut();

    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValue(new MissingParamError('any_field'));
    const error = sut.validate({ any_field: 'any_field_value' });

    expect(error).toEqual(new MissingParamError('any_field'));
  });

  it('should return an first error if many validator fails', () => {
    const { sut, validationStubs } = makeSut();

    jest.spyOn(validationStubs[0], 'validate').mockReturnValue(new Error());
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValue(new MissingParamError('any_field'));

    const error = sut.validate({ any_field: 'any_field_value' });

    expect(error).toEqual(new Error());
  });

  it('should return null if validator success', () => {
    const { sut } = makeSut();

    const error = sut.validate({ any_field: 'any_field_value' });

    expect(error).toBeNull();
  });
});
