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
}));

describe('BCrypt Adapter', () => {
  it('should call bcrypt with correct values', async () => {
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

  it('should throw exception case of failure of bcrypt ', async () => {
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
});
