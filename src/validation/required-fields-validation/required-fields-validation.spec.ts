import { RequiredFieldsValidation } from '.';
import { MissingParamError } from '../../presentation/error';

interface SutTypes {
  sut: RequiredFieldsValidation;
}
const makeSut = (): SutTypes => {
  const sut = new RequiredFieldsValidation('fieldName');
  return { sut };
};

describe('CompareFieldsValidation', () => {
  it('Should ensure that a function validator will be called with the correct values', () => {
    const { sut } = makeSut();

    const validateSpy = jest.spyOn(sut, 'validate');

    sut.validate({ fieldName: 'any_field' });

    expect(validateSpy).toHaveBeenCalledWith({
      fieldName: 'any_field',
    });
  });

  it('Should ensure that a function validator success return', () => {
    const { sut } = makeSut();

    const error = sut.validate({
      fieldName: 'any_field',
    });

    expect(error).toBeNull();
  });

  it('should ensure that the validator function returns error MissingParamError in case the fields is not  provided', () => {
    const { sut } = makeSut();

    const error = sut.validate({
      field: 'correct_field',
    });

    expect(error).toEqual(new MissingParamError('fieldName'));
  });
});
