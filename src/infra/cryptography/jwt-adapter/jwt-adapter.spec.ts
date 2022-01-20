import jwt from 'jsonwebtoken';
import { TokenGenerator } from '../../../data/protocols/cryptography/token-generator';

import { JWTAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'any_token';
  },
}));

interface SutTypes {
  sut: TokenGenerator;
}

const makeSut = (): SutTypes => {
  const sut = new JWTAdapter();
  return { sut };
};

describe('JWT Adapter ', () => {
  it('Should call generate function with id correct', async () => {
    const { sut } = makeSut();
    const signSpy = jest.spyOn(jwt, 'sign');

    await sut.generate('any_id', 'secret');

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
  });

  it('Should should throw execution if failure generate function ', async () => {
    const { sut } = makeSut();

    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
    });

    const generateSpy = sut.generate('any_id', 'secret');

    await expect(generateSpy).rejects.toThrow();
  });

  it('Should return the token on success ', async () => {
    const { sut } = makeSut();

    const generateSpy = await sut.generate('any_id', 'secret');

    expect(generateSpy).toEqual('any_token');
  });
});
