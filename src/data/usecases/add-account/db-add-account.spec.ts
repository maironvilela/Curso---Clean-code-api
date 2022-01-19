import { AccountModel } from '../../../domain/models/account';
import { AddAccountModel } from '../../../domain/usecases/add-account';
import { AddAccountRepository } from '../../protocols/db/add-account-repository';
import { DbAddAccount } from './db-add-account';
import { Encrypter } from './db-add-account-protocols';

interface MakeSutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'));
    }
  }

  return new EncrypterStub();
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
  const encrypterStub = makeEncrypterStub();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return { encrypterStub, sut, addAccountRepositoryStub };
};

describe('Add Account', () => {
  it('should be able to encrypt password', async () => {
    const { sut } = makeSut();
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    const account = await sut.add(accountData);

    expect(account.password).toEqual('hashed_password');
  });

  it('should call the function encrypt with valid password', async () => {
    const { sut, encrypterStub } = makeSut();

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  it('should throw exception oin case of failure of Encrypter ', async () => {
    const { sut, encrypterStub } = makeSut();
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    jest
      .spyOn(encrypterStub, 'encrypt')
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
