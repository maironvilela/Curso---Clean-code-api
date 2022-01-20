import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await new Promise(resolve => resolve('hashed_value'));
  },
  async compare(): Promise<boolean> {
    return await new Promise(resolve => resolve(true));
  },
}));

describe('BCrypt Adapter', () => {
  it('should call hash with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.hash('any_value');

    expect(hashSpy).toHaveBeenLastCalledWith('any_value', salt);
  });

  it('should return hashed value', async () => {
    const sut = makeSut();

    const hash = await sut.hash('any_value');

    expect(hash).toBe('hashed_value');
  });

  it('should throw exception case of failure of hash ', async () => {
    const sut = makeSut();

    const bcryptHash = jest
      .fn()
      .mockImplementationOnce(
        async () => await new Promise((resolve, reject) => reject(new Error())),
      );

    (bcrypt.hash as jest.Mock) = bcryptHash;

    const promise = sut.hash('any_value');

    await expect(promise).rejects.toThrowError();
  });

  it('should call compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'hashed_value');
    expect(compareSpy).toHaveBeenLastCalledWith('any_value', 'hashed_value');
  });

  it('Should return true on successful comparison ', async () => {
    const sut = makeSut();
    const isSuccessInComparison = await sut.compare(
      'any_value',
      'hashed_value',
    );
    expect(isSuccessInComparison).toBe(true);
  });

  it('Should return false if the comparison fails ', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => {
      const promise = await new Promise(resolve => resolve(false));
      return promise;
    });
    const isSuccessInComparison = await sut.compare(
      'any_value',
      'hashed_value',
    );
    expect(isSuccessInComparison).toBe(false);
  });

  it('should throw exception case of failure of hash ', async () => {
    const sut = makeSut();

    const bcryptCompare = jest
      .fn()
      .mockImplementationOnce(
        async () => await new Promise((resolve, reject) => reject(new Error())),
      );

    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const promise = sut.compare('any_value', 'hashed_value');

    await expect(promise).rejects.toThrowError();
  });
});
