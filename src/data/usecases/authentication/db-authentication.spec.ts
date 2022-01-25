import { HashComparer } from '../../protocols/cryptography/hash-comparer';
import { TokenGenerator } from '../../protocols/cryptography/token-generator';
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../protocols/db/account/update-access-token-repository';
import { AccountModel } from '../add-account/db-add-account-protocols';
import { DBAuthentication } from './db-authentication';

interface SutTypes {
  sut: DBAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hashedValue: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true));
    }
  }

  return new HashComparerStub();
};

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(): Promise<string> {
      return 'any_token';
    }
  }

  return new TokenGeneratorStub();
};

const makeLoadAccountByEmailRepositoryStub =
  (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository
    {
      async load(email: string): Promise<AccountModel | null> {
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email',
          password: 'hashed_password',
        };
        return await new Promise(resolve => resolve(account));
      }
    }

    return new LoadAccountByEmailRepositoryStub();
  };

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update(id: string, token: string): Promise<void> {}
  }
  return new UpdateAccessTokenRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub =
    makeLoadAccountByEmailRepositoryStub();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub();
  const tokenGeneratorStub = makeTokenGeneratorStub();
  const hashComparerStub = makeHashComparerStub();
  const sut = new DBAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  };
};

describe('DB Authentication', () => {
  it('should call loadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');
    await sut.auth({ email: 'any_email', password: 'any_password' });

    expect(loadSpy).toHaveBeenCalledWith('any_email');
  });

  it('should throws exception if loadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.auth({ email: 'any_email', password: 'any_password' });
    await expect(promise).rejects.toThrow();
  });

  it('should return null if the email provided is invalid', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)));

    const token = await sut.auth({
      email: 'any_email',
      password: 'any_password',
    });

    expect(token).toBeNull();
  });

  it('should call hashCompare with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();

    const loadSpy = jest.spyOn(hashComparerStub, 'compare');

    await sut.auth({ email: 'any_email@email.com', password: 'password' });

    expect(loadSpy).toHaveBeenCalledWith('password', 'hashed_password');
  });

  it('should return null if password invalid', async () => {
    const { sut, hashComparerStub } = makeSut();

    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValue(new Promise(resolve => resolve(false)));

    const result = await sut.auth({
      email: 'any_email@email.com',
      password: 'password',
    });

    expect(result).toBeNull();
  });

  it('should call token generator ', async () => {
    const { sut, tokenGeneratorStub } = makeSut();

    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');

    await sut.auth({ email: 'any_email@email.com', password: 'any_password' });

    expect(generateSpy).toHaveBeenCalled();
  });

  it('Should return username and token in case success', async () => {
    const { sut } = makeSut();

    const result = await sut.auth({
      email: 'any_email',
      password: 'any_password',
    });

    expect(result).toEqual({ token: 'any_token', name: 'any_name' });
  });

  it('Should call updateAccessToken with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    const updateAccessTokenSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'update',
    );

    await sut.auth({ email: 'any_email', password: 'any_password' });

    expect(updateAccessTokenSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  it('Should throws the exception if there is an error in the token update', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    jest
      .spyOn(updateAccessTokenRepositoryStub, 'update')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.auth({ email: 'any_email', password: 'any_password' });

    await expect(promise).rejects.toThrow();
  });
});
