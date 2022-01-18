import { InvalidParamError } from '../../presentation/error';
import { CompareFieldsValidation } from './';

interface SutTypes {
  sut: CompareFieldsValidation;
}
const makeSut = (): SutTypes => {
  const sut = new CompareFieldsValidation('fieldName', 'fieldToCompareName');

  return { sut };
};

describe('CompareFieldsValidation', () => {
  it('Should ensure that a function validator will be called with the correct values', () => {
    const { sut } = makeSut();

    const validateSpy = jest.spyOn(sut, 'validate');

    sut.validate({ fieldName: 'any_field', fieldToCompareName: 'any_field' });

    expect(validateSpy).toHaveBeenCalledWith({
      fieldName: 'any_field',
      fieldToCompareName: 'any_field',
    });
  });

  it('Should ensure that a function validator success return', () => {
    const { sut } = makeSut();

    const error = sut.validate({
      fieldName: 'any_field',
      fieldToCompareName: 'any_field',
    });

    expect(error).toBeNull();
  });

  it('should ensure that the validator function returns error InvalidParamError in case the fields be different', () => {
    const { sut } = makeSut();

    const error = sut.validate({
      fieldName: 'correct_field',
      fieldToCompareName: 'different_field',
    });

    expect(error).toEqual(new InvalidParamError('fieldToCompareName'));
  });
});
