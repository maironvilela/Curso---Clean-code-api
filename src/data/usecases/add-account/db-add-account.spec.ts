import {
  AccountModel,
  Hasher,
  AddAccountModel,
} from './db-add-account-protocols';
import { AddAccountRepository } from '../../protocols/db/account/add-account-repository';
import { DbAddAccount } from './db-add-account';

interface MakeSutTypes {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'));
    }
  }

  return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve =>
        resolve(
          Object.assign({}, accountData, {
            id: 'valid_id',
          }),
        ),
      );
    }
  }
  return new AddAccountRepositoryStub();
};

const makeSut = (): MakeSutTypes => {
  const hasherStub = makeHasherStub();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub);

  return { hasherStub, sut, addAccountRepositoryStub };
};

describe('Add Account', () => {
  it('should be able to hash password', async () => {
    const { sut } = makeSut();
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    const account = await sut.add(accountData);

    expect(account.password).toEqual('hashed_password');
  });

  it('should call the function hash with valid password', async () => {
    const { sut, hasherStub } = makeSut();

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    const hashSpy = jest.spyOn(hasherStub, 'hash');

    await sut.add(accountData);

    expect(hashSpy).toHaveBeenCalledWith('valid_password');
  });

  it('should throw exception oin case of failure of Hasher ', async () => {
    const { sut, hasherStub } = makeSut();
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    jest
      .spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });

  it('should save account with success', async () => {
    const { sut } = makeSut();

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    const account = await sut.add(accountData);

    expect(account).toHaveProperty('id');
    expect(account.password).toEqual('hashed_password');
  });

  it('should throw exception case of failure of addAccountRepository ', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });
});
